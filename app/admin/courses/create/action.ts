"use server"

import {CourseSchemaType, courseSchema} from "../../../../lib/zodSchemas";

export async function CreateCourse(data:CourseSchemaType) {
    try {

        const validation = courseSchema.safeParse(data); //we have to validate the data //to get protected from attackers also

        if(!validation.success){
            return {
                status:'error',
                message:'Invalid Form Data'
            }
        }
        
    } catch {
        
    }
}