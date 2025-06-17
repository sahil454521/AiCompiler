import {create} from 'zustand';
import { LANGUAGE_CONFIG } from '@/app/(root)/_constants';
import { CodeEditorState } from './../types/index';
import { Monaco } from '@monaco-editor/react';


const getInitialState = () => {
    if (typeof window === 'undefined') {
        return {
            language: "javascript",
            fontSize: 14,
            theme: "vs-dark",
        };
    }
    // if we are on the client side, we can access localStorage because localStorage is not available on the server side
    const savedLanguage = localStorage.getItem('language') || 'javascript';
    const savedTheme = localStorage.getItem('theme') || 'vs-dark';
    const savedFontSize = localStorage.getItem('editor-font-size') || '14';
    return {
        language: savedLanguage,
        theme: savedTheme,
        fontSize: Number(savedFontSize),
    };
};

export const useCodeEditorStore = create<CodeEditorState>((set, get) => {
    const initialState = getInitialState();
    return {
        ...initialState,
        output: "",
        isRunning: false,
        error: "",
        editor: null,
        executionResult: null,

        getCode: () => get().editor?.getValue() || '',
        setEditor: (editor: Monaco) => {
            const savedCode = localStorage.getItem(`editor-code-${get().language}`) || '';
            if (savedCode) editor.setValue(savedCode);
            set({ editor });
        },
        setTheme: (theme: string) => {
            localStorage.setItem('theme', theme);
            set({ theme });
        },

        setFontSize: (fontSize: number) => {
            localStorage.setItem("editor-font-size", fontSize.toString());
            set({ fontSize });
        },
        setLanguage: (language: string) =>{
            const currentCode = get().editor?.getValue();
            if (currentCode){
                localStorage.setItem("editor-language",language);

                set({
                    language,
                    output:"",
                    error: "",
                });
            }
        },

        runCode: async () => {
            // Provide a default implementation or leave empty if handled elsewhere
            // Example:
            // set({ isRunning: true });
            // try {
            //     // Your code execution logic here
            //     set({ output: "Execution result", error: "" });
            // } catch (e) {
            //     set({ error: String(e) });
            // }
            // set({ isRunning: false });
        },

    };
});