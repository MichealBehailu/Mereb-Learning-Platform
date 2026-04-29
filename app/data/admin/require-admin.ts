import 'server-only'
import { redirect } from "next/navigation";
// import {auth} from "../../../lib/auth"
import { auth } from "@/lib/auth"
import { headers } from "next/headers";


export async function requireAdmin(){
    
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(!session){
        return redirect('/login')
    }


    if(session.user.role !== 'admin'){ //check if the session user is an admin or not
        return redirect('/not-admin')
    }

    return session //the user is an admin 
}