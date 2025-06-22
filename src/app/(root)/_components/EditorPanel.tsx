"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useEffect, useRef, useState } from "react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../_constants";
import { Editor } from "@monaco-editor/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { RotateCcwIcon, ShareIcon, TypeIcon } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { EditorPanelSkeleton } from "./EditorPanelSkeleton";
import useMounted from "@/hooks/useMounted";
import ShareSnippetDialog from "./ShareSnippetDialog";

export default function EditorPanel() {
  const clerk = useClerk();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const { language, theme, fontSize, editor, setFontSize, setEditor } = useCodeEditorStore();
  const [code, setCode] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [decorationIds, setDecorationIds] = useState<string[]>([]);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const suggestionRef = useRef<string>("");

  const mounted = useMounted();

  useEffect(() => {
    const savedCode = localStorage.getItem(`editor-code-${language}`);
    const newCode = savedCode || LANGUAGE_CONFIG[language].defaultCode;
    setCode(newCode);
    if (editor) editor.setValue(newCode);
  }, [language, editor]);

  useEffect(() => {
    const savedFontSize = localStorage.getItem("editor-font-size");
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
  }, [setFontSize]);

  const handleRefresh = () => {
    const defaultCode = LANGUAGE_CONFIG[language].defaultCode;
    setCode(defaultCode);
    if (editor) editor.setValue(defaultCode);
    localStorage.removeItem(`editor-code-${language}`);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
      localStorage.setItem(`editor-code-${language}`, value);
    }
  };

  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, 12), 24);
    setFontSize(size);
    localStorage.setItem("editor-font-size", size.toString());
  };

  // Fetch suggestion when code changes (debounced)
  useEffect(() => {
    if (!code || code.length < 5) {
      setSuggestion("");
      if (editorRef.current) {
        setDecorationIds((ids) => editorRef.current.deltaDecorations(ids, []));
      }
      return;
    }
    const timeout = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        const { suggestion } = await res.json();
        setSuggestion(suggestion || "");
      } catch {
        setSuggestion("");
        if (editorRef.current) {
          setDecorationIds((ids) => editorRef.current.deltaDecorations(ids, []));
        }
      } finally {
        setIsLoading(false);
      }
    }, 600);
    return () => clearTimeout(timeout);
  }, [code]);

  // Monaco theme and instance
  const handleBeforeMount = (monaco: any) => {
    defineMonacoThemes(monaco);
    monacoRef.current = monaco;
  };

  // Add Tab command ONCE on mount
  const handleEditorMount = (editor: any, monaco: any) => {
    setEditor(editor);
    editorRef.current = editor;
    editor.addCommand(monaco.KeyCode.Tab, () => {
      const currentSuggestion = suggestionRef.current;
      if (currentSuggestion) {
        const pos = editor.getPosition();
        editor.executeEdits("", [
          {
            range: new monaco.Range(
              pos.lineNumber,
              pos.column,
              pos.lineNumber,
              pos.column
            ),
            text: currentSuggestion,
          },
        ]);
        const newValue = editor.getValue();
        setCode(newValue);
        setSuggestion("");
        setDecorationIds((ids) => editor.deltaDecorations(ids, []));
        localStorage.setItem(`editor-code-${language}`, newValue);
      }
    });
  };

  // Update ghost text decoration on suggestion/code/cursor change
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const updateDecoration = () => {
      if (!suggestion) {
        setDecorationIds((ids) => editor.deltaDecorations(ids, []));
        return;
      }
      const position = editor.getPosition();
      if (!position) return;
      const singleLineSuggestion = suggestion.split('\n')[0];
      const decorations = [
        {
          range: new monaco.Range(
            position.lineNumber,
            position.column,
            position.lineNumber,
            position.column
          ),
          options: {
            after: {
              contentText: singleLineSuggestion,
              inlineClassName: "monaco-ghost-text",
            },
          },
        },
      ];
      setDecorationIds((ids) => editor.deltaDecorations(ids, decorations));
    };
    updateDecoration();
    const disposable = editor.onDidChangeCursorPosition(updateDecoration);
    return () => disposable.dispose();
  }, [suggestion, code]);

  // Keep ref in sync with state
  useEffect(() => {
    suggestionRef.current = suggestion;
  }, [suggestion]);

  if (!mounted) return null;

  return (
    <div className="relative">
      <div className="relative bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-6">
        {/* Suggestion Card */}
        {(suggestion || isLoading) && (
          <div className="mb-4 p-3 bg-gray-900/80 rounded-lg border border-blue-700/40 shadow flex items-center justify-between">
            <div>
              <span className="text-sm text-blue-300 font-semibold">Suggestion:</span>
              <span className="ml-2 text-blue-400 font-mono">{suggestion || "..."}</span>
            </div>
            {isLoading && (
              <span className="text-xs text-blue-400 animate-pulse ml-4">Analyzing...</span>
            )}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5">
              <Image src={"/" + language + ".png"} alt="Logo" width={24} height={24} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-white">Code Editor</h2>
              <p className="text-xs text-gray-500">Write and execute your code</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Font Size Slider */}
            <div className="flex items-center gap-3 px-3 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5">
              <TypeIcon className="size-4 text-gray-400" />
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                  className="w-20 h-1 bg-gray-600 rounded-lg cursor-pointer"
                  title="Font size"
                />
                <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">
                  {fontSize}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors"
              aria-label="Reset to default code"
            >
              <RotateCcwIcon className="size-4 text-gray-400" />
            </motion.button>

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsShareDialogOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-gradient-to-r
               from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity"
            >
              <ShareIcon className="size-4 text-white" />
              <span className="text-sm font-medium text-white ">Share</span>
            </motion.button>
          </div>
        </div>

        {/* Editor */}
        <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]">
          {clerk.loaded && (
            <Editor
              height="600px"
              language={LANGUAGE_CONFIG[language].monacoLanguage}
              value={code}
              onChange={handleEditorChange}
              theme={theme}
              beforeMount={handleBeforeMount}
              onMount={handleEditorMount}
              options={{
                minimap: { enabled: false },
                fontSize,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                renderWhitespace: "selection",
                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                fontLigatures: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,
                contextmenu: true,
                renderLineHighlight: "all",
                lineHeight: 1.6,
                letterSpacing: 0.5,
                roundedSelection: true,
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                },
              }}
            />
          )}
          {!clerk.loaded && <EditorPanelSkeleton />}
        </div>
      </div>
      {isShareDialogOpen && <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />}
      <style>
        {`
          .monaco-ghost-text {
            opacity: 0.5;
            color: #60a5fa !important;
            font-style: italic;
          }
        `}
      </style>
    </div>
  );
}
