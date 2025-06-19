import Header from "@/app/(root)/_components/Header";
import EditorPanel from "@/app/(root)/_components/EditorPanel";
import OutputPanel from "./_components/OutputPanel";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <Header />
      <main className="flex-1 flex flex-col">
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
  );
}