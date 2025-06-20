import React, { useState } from 'react'
import { useCodeEditorStore } from '@/store/useCodeEditorStore'
import { useMutation } from 'convex/react';
import { X } from 'lucide-react';
import { createSnippet } from './snippets';
import { toast } from 'react-hot-toast';

import { api } from '../convex/_generated/api';

function ShareSnippetDialog({onClose}: {onClose:() => void}) {

const [title,setTitle] = useState("");
const [isSharing,setIsSharing] = useState(false);
const {language,getCode} = useCodeEditorStore();
const createSnippetMutation = useMutation(api.snippets.createSnippet);

const handleshare = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSharing(true);

    try {
        const code = getCode();

        await createSnippetMutation({ title, language, code });
        onClose();
        setTitle("");
        toast.success("Snippet shared successfully!");

    } catch (error) {
            console.log("Error sharing snippet:", error);
            toast.error("Failed to share snippet. Please try again.");
    } finally {
        setIsSharing(false);
    }
}
//save in convex


    return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
    <div className='bg-[#1e1e2e] rounded-lg p-6 w-full max-w-md'>
        <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-semibold text-white>Share Snippet'></h2>
            <button onClick={onClose} className='text-gray-400 hover:text-gray-300' aria-label="Close dialog" title="Close">
                <X className='w-6 h-6' />
            </button>
        </div>
        <form onSubmit={handleshare}>

            <div className='mb-4'>
                <label htmlFor='title' className='block text-sm font-medium text-gray-300 mb-2'>Title</label>
                <input
                    type='text'
                    id='title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className='w-full p-2 bg-[#2a2a36] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                />

            </div>
            <div className='flex justify-end gap-3'>
                <button
                    type='button'
                    onClick={onClose}
                    className='px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors'
                >
                    Cancel
                </button>
                <button
                    type='submit'
                    disabled={isSharing}
                    className={`px-4 py-2 rounded-lg transition-colors ${isSharing ? 'bg-blue-500/50 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                    {isSharing ? 'Sharing...' : 'Share Snippet'}
                </button>

            </div>
        </form>
    </div>
      
    </div>
  )
}

export default ShareSnippetDialog
