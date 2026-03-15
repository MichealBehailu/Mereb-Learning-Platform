'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Menubar } from './Menubar'
import TextAlign from '@tiptap/extension-text-align'

export function RichTextEditor({field}: {field: any}) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types:['heading', 'paragraph']
            })
        ],
        editorProps:{ //this for customization for the EditorContent component
            attributes:{
                class:'min-h-[300px] p-4 focus:outline-none pros prose-sm sm:prose lg:prose-lg xl-prose-xl dark:prose-invert !w-full !max-w-none'
            }
        },

        onUpdate:({editor})=>{
            field.onChange(JSON.stringify(editor.getJSON())) //to get json and then stringify it because on the schema the description is set to string 
        },

        content:field.value? JSON.parse(field.value):'<p>Describe your course here...</p>',
        immediatelyRender:false 
    })
    
    return (
        <div className='w-full border border-input rounded-lg overflow-hidden dark:bg-input/30'>
            <Menubar editor={editor}/>
            <EditorContent editor={editor}  />
        </div>
    )
}