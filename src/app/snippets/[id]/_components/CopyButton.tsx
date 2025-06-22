"use client"


import { Check, Copy } from "lucide-react";
import { useState } from "react";



function CopyButton({code}:{code:string}) {
const [copied,setCopied] =useState(false);


const CopyToClipboard = async() => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(()=> setCopied(false),2000);

}

  return (
    <button onClick={CopyToClipboard}
            className="p-2 hover:bg-gray-700 transition-colors duration-200 rounded-md"
            
    
    >
        {copied ? (
        <Check className="size-4 text-gray-400" />
            ) :(
                <Copy className="size-4 text-gray-400" />
            )}
    </button>
  )
}

export default CopyButton
