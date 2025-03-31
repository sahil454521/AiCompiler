from accelerate import Accelerator
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, Trainer, TrainingArguments
from transformers.utils import logging
from sentence_transformers import SentenceTransformer, util
import ollama
import torch
import queue
import threading
import time
import ast
from datasets import Dataset, concatenate_datasets

# Suppress unnecessary warnings
logging.set_verbosity_error()

class AICodeFixer:
    def __init__(self):
        self.accelerator = Accelerator()
        self.device = self.accelerator.device
        self.model_version = 0
        
        # Initialize models
        self.my_model, self.my_tokenizer = self.initialize_my_model()
        self.similarity_model = SentenceTransformer('all-MiniLM-L6-v2').to(self.device)
        self.ollama = self.OllamaClient()
        
        # Initialize dataset and training queue
        self.dataset = Dataset.from_dict({'source': [], 'error': [], 'target': []})
        self.training_queue = queue.Queue()
        self.training_thread = threading.Thread(target=self.auto_retrain, daemon=True)
        self.training_thread.start()

    class OllamaClient:
        def __init__(self):
            self.available_models = ["codellama", "starcoder"]
            self.current_model = None
            self.check_models()

        def check_models(self):
            
            try:
                models = [m['name'] for m in ollama.list()['models']]
                for model in self.available_models:
                    if model in models:
                        self.current_model = model
                        return
                print("⚠️ No code models found in Ollama")
            except Exception as e:
                print(f"⚠️ Ollama connection error: {str(e)}")
                self.current_model = None

        def get_fix(self, code: str, error: str) -> str:
            
            if not self.current_model:
                return self.fallback_fix(code, error)
            
            try:
                response = ollama.generate(
                    model=self.current_model,
                    prompt=f"Fix this Python code:\n{code}\nError:\n{error}",
                    options={'temperature': 0.2}
                )
                return response['response'].strip()
            except Exception as e:
                print(f"⚠️ Ollama error: {str(e)}")
                return self.fallback_fix(code, error)

        def fallback_fix(self, code: str, error: str) -> str:
            
            if "SyntaxError" in error:
                if "unexpected EOF" in error:
                    if "(" in code and ")" not in code:
                        return code + ")"
                    if "[" in code and "]" not in code:
                        return code + "]"
                    if ":" not in code:
                        return code + ":"
                return code + " # Syntax fix applied"
            return code

    def initialize_my_model(self):
        
        try:
            model_name = "Salesforce/codet5-base"
            tokenizer = AutoTokenizer.from_pretrained(model_name)
            model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
            return self.accelerator.prepare(model), tokenizer
        except Exception as e:
            raise RuntimeError(f"Model initialization failed: {str(e)}")

    def process_error(self, code: str, error: str) -> str:
        """Main error processing workflow"""
        try:
            
            my_fix = self.generate_fix(code, error)
            ollama_fix = self.ollama.get_fix(code, error)
            
            
            if self.fixes_equivalent(my_fix, ollama_fix):
                print("✅ Fixes match - Using my model")
                return my_fix
            else:
                print("🔄 Fixes differ - Using Ollama/fallback version")
                if self.validate_fix(code, error, ollama_fix):
                    self.add_to_training_queue(code, error, ollama_fix)
                return ollama_fix
                
        except Exception as e:
            print(f"❌ Processing error: {str(e)}")
            return code

    def generate_fix(self, code: str, error: str) -> str:
        """Generate fix using our model"""
        inputs = self.my_tokenizer(
            f"Fix error: {error}\nCode: {code}",
            return_tensors="pt",
            max_length=512,
            truncation=True
        ).to(self.device)

        outputs = self.my_model.generate(
            **inputs,
            max_length=512,
            num_return_sequences=1,
            temperature=0.3,
            do_sample=True,
            top_k=50,
            top_p=0.95
        )

        return self.my_tokenizer.decode(outputs[0], skip_special_tokens=True)

    def fixes_equivalent(self, fix1: str, fix2: str) -> bool:
        """Semantic code comparison"""
        emb1 = self.similarity_model.encode(fix1)
        emb2 = self.similarity_model.encode(fix2)
        return util.cos_sim(emb1, emb2).item() > 0.95

    def validate_fix(self, original: str, error: str, fixed: str) -> bool:
        """Validation pipeline"""
        try:
            if not fixed or fixed == original:
                return False
                
            if not self.is_valid_syntax(fixed):
                return False
                
           
            if "ZeroDivisionError" in error:
                return "raise" in fixed and ("b == 0" in fixed or "b is 0" in fixed)
                
            if "SyntaxError" in error:
                return (fixed.count(":") > original.count(":")) or \
                       (fixed.count(")") > original.count(")"))
                
            return True
        except Exception as e:
            print(f"Validation error: {str(e)}")
            return False

    def is_valid_syntax(self, code: str) -> bool:
        """AST-based syntax check"""
        try:
            ast.parse(code)
            return True
        except Exception:
            return False

    def add_to_training_queue(self, code: str, error: str, fix: str):
        """Add validated examples to queue"""
        self.training_queue.put({
            'broken_code': code,
            'error': error,
            'fixed_code': fix
        })
        print(f"📥 Training queue size: {self.training_queue.qsize()}")

    def auto_retrain(self):
        """Automatic retraining system"""
        while True:
            try:
                if self.training_queue.qsize() >= 100:
                    print("\n🚀 Starting automatic retraining...")
                    start_time = time.time()
                    
                    # Process queue
                    collected = []
                    while not self.training_queue.empty():
                        collected.append(self.training_queue.get())
                    
                    # Create new dataset
                    new_data = {
                        'source': [item['broken_code'] for item in collected],
                        'error': [item['error'] for item in collected],
                        'target': [item['fixed_code'] for item in collected]
                    }
                    new_dataset = Dataset.from_dict(new_data)
                    
                    # Merge datasets
                    self.dataset = concatenate_datasets([self.dataset, new_dataset])
                    
                    
                    self.train()
                    
                    print(f"✅ Retraining completed in {time.time()-start_time:.1f}s")
                
                time.sleep(10)
                
            except Exception as e:
                print(f"🔥 Retraining error: {str(e)}")
                time.sleep(60)

    def train(self, batch_size=8, epochs=1):
        """Training process"""
        if len(self.dataset) == 0:
            raise ValueError("Cannot train with empty dataset")
            
        print(f"\n🎯 Training version {self.model_version} on {len(self.dataset)} examples")
        
        # Preprocessing
        tokenized_dataset = self.dataset.map(
            self.preprocess_examples,
            batched=True,
            remove_columns=['source', 'error', 'target']
        )

        # Training setup
        training_args = TrainingArguments(
            output_dir="./results",
            num_train_epochs=epochs,
            per_device_train_batch_size=batch_size,
            learning_rate=2e-5,
            fp16=torch.cuda.is_available(),
            logging_steps=10,
            report_to="none",
            save_strategy="no",
            remove_unused_columns=False
        )

        trainer = Trainer(
            model=self.my_model,
            args=training_args,
            train_dataset=tokenized_dataset,
        )
        
       
        trainer.train()
        self.model_version += 1

    def preprocess_examples(self, examples):
        
        inputs = [
            f"Fix error: {err}\nCode: {code}"
            for code, err in zip(examples['source'], examples['error'])
        ]
        return self.my_tokenizer(
            inputs,
            text_target=examples['target'],
            max_length=512,
            truncation=True,
            padding='max_length'
        )

if __name__ == "__main__":
    # Verify Ollama connection
    print("🔍 Checking Ollama connection...")
    try:
        ollama.list()
        print("✅ Ollama connection successful")
    except Exception as e:
        print(f"❌ Ollama connection failed: {str(e)}")
        print("⚠️ Using fallback fixes when needed")

    ai_fixer = AICodeFixer()
    
    
    initial_data = {
        'source': [
            "for i in range(10) print(i)",
            "def div(a,b): return a/b"
        ],
        'error': [
            "SyntaxError: invalid syntax",
            "ZeroDivisionError: division by zero"
        ],
        'target': [
            "for i in range(10):\n    print(i)",
            "def div(a, b):\n    if b == 0:\n        raise ValueError('Division by zero')\n    return a/b"
        ]
    }
    ai_fixer.dataset = Dataset.from_dict(initial_data)
    
  
    try:
        print("\n🔧 Starting initial training...")
        ai_fixer.train(batch_size=2, epochs=3)
        print("✅ Initial training completed!")
    except Exception as e:
        print(f"❌ Initial training failed: {str(e)}")
    
    
    test_cases = [
        {
            "code": "def div(a,b): return a//b",
            "error": "ZeroDivisionError when b=0"
        },
        {
            "code": "x = [1, 2, 3",
            "error": "SyntaxError: unexpected EOF"
        }
    ]
    
   
    for idx, case in enumerate(test_cases):
        print(f"\n🔍 Test case {idx+1}: {case['error']}")
        print(f"📝 Original code:\n{case['code']}")
        
        try:
            fixed = ai_fixer.process_error(case['code'], case['error'])
            print(f"🛠 Fixed code:\n{fixed}")
        except Exception as e:
            print(f"❌ Processing failed: {str(e)}")
    
  
    print("\n📊 System Status:")
    print(f"  Model version: v{ai_fixer.model_version}")
    print(f"  Training queue size: {ai_fixer.training_queue.qsize()}")
    print(f"  Total training examples: {len(ai_fixer.dataset)}")
    print("🔄 Auto-retrain activates when queue reaches 100 items")