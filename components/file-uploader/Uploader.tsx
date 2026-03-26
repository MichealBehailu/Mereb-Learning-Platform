"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RenderEmptyState, RenderErrorState } from "./RenderState";
import { toast } from "sonner";
import type { FileRejection } from "react-dropzone";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

interface UploaderState{
    id:string | null; //we use this for mapping purpose only
    file: File|null;
    uploading: boolean;
    progress : number;
    key?:string ;
    isDeleting:boolean;
    error:boolean;
    objectUrl?:string //local
    fileType:"image"|"video"
}

export function Uploader() {

    const [fileState, setFileState] = useState<UploaderState>({
        error:false, //this fields are for initials
        file:null,
        id:null,
        uploading:false,
        progress:0,
        isDeleting:false,
        fileType:"image"    
    })

    function uploadFile(file:File){ 
        setFileState(prev=>({ //gets prev file state and updates it
            ...prev,
            uploading:true,
            progress:0
        }))

        try{

        }catch()
    }
  
    const onDrop = useCallback((acceptedFiles: File[]) => {
   if(acceptedFiles.length>0){
    const file = acceptedFiles[0];
    
    setFileState({
        file:file,
        uploading:false,
        progress:0,
        objectUrl:URL.createObjectURL(file), //to store it like local url
        error:false,
        id:uuidv4(), //must be unique
        isDeleting:false,
        fileType:'image'
    })

   }
  }, []);

  function rejectedFiles(fileRejection:FileRejection[]){
    if(fileRejection.length){

        const tooManyFiles = fileRejection.find((rejection)=>rejection.errors[0].code === 'too-many-files')
        
        const fileSizeToBig = fileRejection.find((rejection)=>rejection.errors[0].code === 'file-too-large')
        
        if(tooManyFiles){
           toast.error('Too many files selected, max is 1')
        }

        if(fileSizeToBig){
            toast.error('File Size exceeds the limit')
        }
        
        if(fileSizeToBig){
           toast.error('File size too big, max is 5mb')
        }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] }, //only accept image only for now
    maxFiles: 1, //only allowed to upload 1 file only
    multiple: false, //can select only one file at a time
    maxSize: 5 * 1024 * 1024, //5mb max file size
    onDropRejected: rejectedFiles
  });
  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary",
      )}
    >
      <CardContent className="flex items-center justify-center h-full w-full p-4">
        <input {...getInputProps()} />
        {/* <RenderErrorState /> */}
        <RenderEmptyState isDragActive={isDragActive} />
      </CardContent>
    </Card>
  );
}

//for the uploader i used a simple package called react dropzone
