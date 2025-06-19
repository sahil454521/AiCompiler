import Header from "@/app/(root)/_components/Header";
import EditorPanel from "@/app/(root)/_components/EditorPanel";
import OutputPanel from "./_components/OutputPanel";
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950"> 
      <Header/>
      <div className="max-w-[1800px] mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EditorPanel/>
          <OutputPanel/>
        </div>
      </div>
    </div>
  );
}
