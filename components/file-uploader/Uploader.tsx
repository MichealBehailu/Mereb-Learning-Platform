"use client";
import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RenderEmptyState, RenderErrorState, RenderUploadedState, RenderUploadingState } from "./RenderState";
import { toast } from "sonner";
import type { FileRejection } from "react-dropzone";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface UploaderState {
  id: string | null; //we use this for mapping purpose only
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string; //local
  fileType: "image" | "video";
}

export function Uploader() {
  //main
  const [fileState, setFileState] = useState<UploaderState>({
    error: false, //this fields are for initials
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    fileType: "image",
  });

  async function uploadFile(file: File) {
    setFileState((prev) => ({
      //gets prev file state and updates it
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
      //1. get presigned url

      const presignedResponse = await fetch("/api/s3/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: true,
        }),
      });

      if (!presignedResponse.ok) {
        toast.error("Failed to get presigned URL");
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));

        return;
      }

      const { presignedUrl, key } = await presignedResponse.json();

      await new Promise<void>((resolve, reject) => {
        //this is used to track the upload progress //since fetchthen cant do it we use XHR
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentageCompleted = (event.loaded / event.total) * 100; //this will give us the percentage uploaded // if we upload 5mb then first the loaded(e.g 2mb) is divided by the total(5mb) and multiplied by 100 to get the percentage
            setFileState((prev) => ({
              ...prev,
              progress: Math.round(percentageCompleted), //round the percentage to the nearest whole number
            }));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFileState((prev) => ({
              ...prev,
              progress: 100,
              uploading: false,
              key: key,
            }));

            toast.success("File uploaded successfully");
            resolve();
          } else {
            reject(new Error("Upload failed"));
          }

        };
        xhr.onerror = () => {
          reject(new Error("Upload failed"));
        };

        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch (error) {
      toast.error("Something went wrong");
      setFileState((prev) => ({
        ...prev,
        progress: 0,
        error: true,
        uploading: false,
      }));
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      // Check if the objectUrl is a local URL or an external URL
      // If it's a local URL, revoke it before setting a new one
      if(fileState.objectUrl && !fileState.objectUrl.startsWith('http')){ // This condition checks if the objectUrl starts with 'http', which indicates that it's an external URL
        // If it's not an external URL, it's a local URL, so we need to revoke it before setting a new one
        URL.revokeObjectURL(fileState.objectUrl);
      }

      setFileState({
        file: file,
        uploading: false,
        progress: 0,
        objectUrl: URL.createObjectURL(file), //to store it like local url
        error: false,
        id: uuidv4(), //must be unique
        isDeleting: false,
        fileType: "image",
      });

      uploadFile(file);
    }
  }, [fileState.objectUrl]);

  function rejectedFiles(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files",
      );

      const fileSizeToBig = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large",
      );

      if (tooManyFiles) {
        toast.error("Too many files selected, max is 1");
      }

      if (fileSizeToBig) {
        toast.error("File Size exceeds the limit");
      }

      if (fileSizeToBig) {
        toast.error("File size too big, max is 5mb");
      }
    }
  }

  function renderContent(){
    if(fileState.uploading){ //this shows uploading state
      return <RenderUploadingState progress={fileState.progress} file={fileState.file as File} />
    }

    if(fileState.error){ //this shows error state
      return <RenderErrorState />
    }

    if(fileState.objectUrl){ //this will be displayed when the file is uploaded
      return(
        <RenderUploadedState previewUrl={fileState.objectUrl} />
      )
    }

    return <RenderEmptyState isDragActive={isDragActive} />
  }

  useEffect(()=>{
    return ()=>{ //for cleaning up purpose
      if(fileState.objectUrl && !fileState.objectUrl.startsWith('http')){ // This condition checks if the objectUrl starts with 'http', which indicates that it's an external URL
        // If it's not an external URL, it's a local URL, so we need to revoke it before setting a new one
        URL.revokeObjectURL(fileState.objectUrl);
      }
    }
  }, [fileState.objectUrl])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] }, //only accept image only for now
    maxFiles: 1, //only allowed to upload 1 file only
    multiple: false, //can select only one file at a time
    maxSize: 5 * 1024 * 1024, //5mb max file size
    onDropRejected: rejectedFiles,
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
        {renderContent()}
      </CardContent>
    </Card>
  );
}

//for the uploader i used a simple package called react dropzone
