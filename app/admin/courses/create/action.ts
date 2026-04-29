"use server"

import {CourseSchemaType, courseSchema} from "../../../../lib/zodSchemas";
import {prisma} from '../../../../lib/db'
import { ApiResponse } from "../../../../lib/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from '@/lib/arcjet'
import { request } from "@arcjet/next";

//to protect the route from DDos or bot farm
const aj = arcjet.withRule(
   detectBot({
    mode: 'LIVE', //block request 
    allow : [], //dont want to allow 3rd party apps like ai 
   })
).withRule(
    fixedWindow({
        mode:'LIVE',
        window: '1m', //allow the user to upload 5 files within 1 minute window
        max: 5 //five request in 1 minute window
    })
)


export async function CreateCourse(values:CourseSchemaType):Promise<ApiResponse> {

   const session = await requireAdmin()

    try {
          // Access request data that Arcjet needs when you call `protect()` similarly
         // to `await headers()` and `await cookies()` in `next/headers`
        const req = await request()

        const decision = await aj.protect(req, {
            fingerprint: session?.user.id as string,
        })

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){

               return {
                status:'error',
                message:'You are making too many requests. Please try again later.'
                 }
            }else{

                return {
                    status:'error',
                    message:'Looks like you are a bot! if this is a mistake please contact our support'
                }
            }
        }

        const validation = courseSchema.safeParse(values); //we have to validate the data //to get protected from attackers also

        if(!validation.success){
            return {
                status:'error',
                message:'Invalid Form Data'
            }
        }

        //creating a mutuation using prisma 
        await prisma.course.create({
            data:{
                ...validation.data, //spread the data
                userId: session?.user.id as string //this is required because of one to many relationship
            }
        });
 
        return {
            status : 'success',
            message: 'Course created successfully'
        }
        
    } catch {
        return{
            status:'error',
            message:"Failed to create course"
        }
    }
}