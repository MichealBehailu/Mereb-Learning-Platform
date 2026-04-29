"use server"

import {CourseSchemaType, courseSchema} from "../../../../lib/zodSchemas";
import {prisma} from '../../../../lib/db'
import { ApiResponse } from "../../../../lib/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { requireAdmin } from "@/app/data/admin/require-admin";


export async function CreateCourse(values:CourseSchemaType):Promise<ApiResponse> {

   const session = await requireAdmin()

    try {

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