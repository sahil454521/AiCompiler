import Header from "@/app/(root)/_components/Header";
import EditorPanel from "@/app/(root)/_components/EditorPanel";
import OutputPanel from "./_components/OutputPanel";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute h-96 w-96 rounded-full bg-blue-600/20 blur-3xl -top-20 -left-20" />
        <div className="absolute h-96 w-96 rounded-full bg-purple-600/20 blur-3xl top-1/3 right-0" />
        <div className="absolute h-96 w-96 rounded-full bg-cyan-600/20 blur-3xl bottom-0 left-1/3" />
      </div>

      {/* Content - wrap in relative to keep above the pattern */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex flex-col h-[calc(100vh-140px)]"> {/* Fixed height for better layout */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto w-full px-4 py-8 h-full">
            <section className="rounded-2xl bg-white/5 backdrop-blur-md shadow-xl border border-white/10 p-6 flex flex-col h-full lg:col-span-2">
              <div className="flex-1 flex flex-col">
                <EditorPanel />
              </div>
            </section>
            <section className="rounded-2xl bg-white/5 backdrop-blur-md shadow-xl border border-white/10 p-6 flex flex-col h-full">
              <div className="flex-1 flex flex-col">
                <OutputPanel />
              </div>
            </section>
          </div>
        </main>
        <footer className="w-full text-center text-xs text-gray-500 py-4 opacity-70">
          &copy; {new Date().getFullYear()} AiCompiler &mdash; All rights reserved.
        </footer>
      </div>
    </div>
  );
}