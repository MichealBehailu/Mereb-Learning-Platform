import {z} from 'zod'
import { NextResponse } from 'next/server'

const fileUploadSchema = z.object({
    fileName: z.string().min(1, {message: 'File name is required'}),
    contentType: z.string().min(1, {message: 'Content type is required'}),
    size: z.number().min(1, {message: 'Size is required'}),
    isImage: z.boolean()
})


export async function POST(request: Request){
    
    try {
        const body = request.body; //to get the boady input but we need some kind of validation //so we create a schema called fileUploadSchema 
        const validation = fileUploadSchema.safeParse(body) //check if the body that is sent as an input validates the schema

        if(!validation.success){ //if the body fails to validate the schema then validation.sucess will be false
            return NextResponse.json({error: 'Invalid request body'}, {status: 400}) //400 means failed 
        }

        const {fileName, contentType, size, isImage} = validation.data
        
    } catch (error) {
        
    }

} 