"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RenderEmptyState, RenderErrorState } from "./RenderState";
import { toast } from "sonner";
import type { FileRejection } from "react-dropzone";

export function Uploader() {
  
    const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    console.log(acceptedFiles);
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
