"use server"

import {CourseSchemaType, courseSchema} from "../../../../lib/zodSchemas";
import {prisma} from '../../../../lib/db'
export async function CreateCourse(values:CourseSchemaType) {
    try {

        const validation = courseSchema.safeParse(values); //we have to validate the data //to get protected from attackers also

        if(!validation.success){
            return {
                status:'error',
                message:'Invalid Form Data'
            }
        }

        //creating a mutuation using prisma 
        const data = await prisma.Course.create({
            data:{
                ...validation.data,
                userId: "adndcdc" //this is required because of one to many relationship
            }
        });
 
        return {
            status : 'success',
            message: 'Course created successfully'
        }
        
    } catch {
        
    }
}