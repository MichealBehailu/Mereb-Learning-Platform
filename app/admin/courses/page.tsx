import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function CoursesPage(){
    return (
        <>
           <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Your Courses</h1>
            
            <Link href="/admin/courses/create" className={buttonVariants()}>Create Course</Link>
           </div>

{/* I will show the courses offered*/}
           <div>
            <h1>Here you will see all of the available courses</h1>
           </div>
        </>
    )
}