"use client";
import { useEffect, useState } from "react";
import { motion, steps } from "framer-motion";
import { Code, Sparkles } from "lucide-react";

export default function SnippetLoadingSkeleton() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Return a simple skeleton until client-side code runs
  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 pt-20 pb-20"></div>;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 pt-20 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header with animated shine effect */}
        <div className="mb-10 relative overflow-hidden">
          <motion.div 
            className="h-12 w-1/3 bg-gray-800 rounded-lg mb-3"
            animate={{ 
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="relative">
            <motion.div 
              className="h-20 w-3/4 bg-gray-800 rounded-xl mb-6"
              animate={{ 
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            {/* Animated sparkle effect */}
            <motion.div
              className="absolute -top-2 -right-2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.8, 1.2, 0.8],
                rotate: [0, 15, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.5, 1]
              }}
            >
              <Sparkles className="w-8 h-8 text-purple-400/50" />
            </motion.div>
          </div>
          <div className="flex items-center space-x-4 mb-6">
            <motion.div 
              className="h-10 w-10 rounded-full bg-gray-800"
              animate={{ opacity: [0.5, 0.7, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="h-6 w-40 bg-gray-800 rounded-md"
              animate={{ opacity: [0.5, 0.7, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3
              }}
            />
          </div>
        </div>

        {/* Code editor skeleton with pulsing animation */}
        <div className="relative rounded-xl overflow-hidden bg-gray-900/70 backdrop-blur-md border border-white/10 shadow-2xl">
          {/* Editor toolbar */}
          <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
            <div className="flex items-center space-x-3">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="h-8 w-20 bg-gray-800 rounded-md"
                  animate={{ opacity: [0.5, 0.7, 0.5] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
            <motion.div
              className="h-8 w-28 bg-gray-800 rounded-md"
              animate={{ opacity: [0.5, 0.7, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Code content */}
          <div className="p-6 h-[500px] relative">
            {/* Line numbers */}
            <div className="absolute top-6 left-6 h-[calc(100%-48px)] w-10 flex flex-col space-y-3">
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-4 w-6 bg-gray-800/50 rounded-sm"
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.1
                  }}
                />
              ))}
            </div>

            {/* Code lines */}
            <div className="ml-10 flex flex-col space-y-3">
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`h-4 bg-gray-800 rounded-sm`}
                  style={{ width: `${(i % 5) * 10 + 40}%` }} // Predictable pattern based on index
                  animate={{ 
                    opacity: [0.5, 0.7, 0.5],
                    x: [0, 2, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.1
                  }}
                />
              ))}
            </div>

            {/* Animated cursor */}
            <motion.div
              className="absolute w-[2px] h-4 bg-blue-400"
              style={{ left: "40%", top: "20%" }}
              animate={{ 
                opacity: [1, 0, 1],
                height: [16, 16, 16]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: steps(1),
              }}
            />

            {/* Floating code icon */}
            <motion.div
              className="absolute bottom-6 right-6 p-3 rounded-full bg-purple-800/20 backdrop-blur"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Code className="w-6 h-6 text-purple-400" />
            </motion.div>
          </div>
        </div>

        {/* Output panel skeleton */}
        <div className="mt-8 rounded-xl overflow-hidden bg-gray-900/70 backdrop-blur-md border border-white/10 shadow-lg">
          <div className="p-4 border-b border-white/5 bg-white/5">
            <motion.div 
              className="h-8 w-32 bg-gray-800 rounded-md"
              animate={{ opacity: [0.5, 0.7, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
          <div className="p-6 h-[200px]">
            {/* Output lines with wave effect */}
            <div className="flex flex-col space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`h-4 bg-gray-800 rounded-sm`}
                  style={{ width: `${Math.random() * 40 + 40}%` }}
                  animate={{ 
                    opacity: [0.5, 0.7, 0.5],
                    x: [0, 3, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Loading indicator at bottom */}
        <div className="mt-12 flex justify-center">
          <motion.div 
            className="flex space-x-3"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-blue-500"
                animate={{ 
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}