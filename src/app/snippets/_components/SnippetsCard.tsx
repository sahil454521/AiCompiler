import React from "react";
import { motion } from "framer-motion";
import { Code, User } from "lucide-react";

interface SnippetsCardProps {
  title?: string;
  language?: string;
  code?: string;
  userName?: string;
  createdAt?: string;
}

const SnippetsCard: React.FC<SnippetsCardProps> = ({
  title = "Untitled Snippet",
  language = "javascript",
  code = "// Your code goes here...",
  userName = "Anonymous",
  createdAt = "Just now",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{
        scale: 1.025,
        boxShadow: "0 8px 32px 0 rgba(0,0,0,0.25)",
        transition: { duration: 0.2 },
      }}
      transition={{ duration: 0.3, type: "spring" }}
      className="group relative bg-gradient-to-br from-[#181825] via-[#1e1e2e] to-[#232336] rounded-2xl p-5 shadow-lg border border-white/10 overflow-hidden"
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-transparent blur-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        aria-hidden
      />

      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#232336] ring-1 ring-white/10">
          <img
            src={`/${language}.png`}
            alt={language}
            className="w-6 h-6 object-contain"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <span className="text-xs text-gray-400 capitalize">{language}</span>
        </div>
      </div>

      {/* Code Preview */}
      <motion.pre
        initial={false}
        whileHover={{ backgroundColor: "#232336" }}
        className="relative rounded-xl bg-[#181825] text-gray-200 text-xs font-mono p-4 mb-4 overflow-x-auto max-h-32 transition-colors"
      >
        <code>
          {code.length > 120 ? code.slice(0, 120) + "..." : code}
        </code>
        <motion.div
          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
          whileHover={{ scale: 1.1 }}
        >
          <Code className="w-4 h-4 text-blue-400" />
        </motion.div>
      </motion.pre>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>{userName}</span>
        </div>
        <span>{createdAt}</span>
      </div>
    </motion.div>
  );
};

export default SnippetsCard;