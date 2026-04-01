import {z} from 'zod'
import { NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import {v4 as uuidv4} from 'uuid'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import {S3} from '@/lib/S3Client'

const fileUploadSchema = z.object({
    fileName: z.string().min(1, {message: 'File name is required'}),
    contentType: z.string().min(1, {message: 'Content type is required'}),
    size: z.number().min(1, {message: 'Size is required'}),
    isImage: z.boolean()
})


export async function POST(request: Request){
    
    try {
        const body = await request.json(); 
        const validation = fileUploadSchema.safeParse(body) //check if the body that is sent as an input validates the schema

        if(!validation.success){ //if the body fails to validate the schema then validation.sucess will be false
            return NextResponse.json({error: 'Invalid request body'}, {status: 400}) //400 means failed 
        }

        const {fileName, contentType, size, isImage} = validation.data;

        const uniqueKey = `${uuidv4()}-${fileName}`; //unique id for the file //the output is like the key then the name of the file

        const command = new PutObjectCommand({
            Bucket:process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            ContentType: contentType,
            ContentLength:size,
            Key: uniqueKey //it is like ID
        })
        
        const presignedUrl = await getSignedUrl(S3,command, {
            expiresIn:360, //URL expires in 6min //in second(represented) in this case it is 6 minutes
            //
        })

        const response = {presignedUrl, key:uniqueKey}

        return NextResponse.json(response)
    } catch (error) {
        return NextResponse.json({error: 'Failed to generate presigned URL'}, {status: 500})
    }

} 