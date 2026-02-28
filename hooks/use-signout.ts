'use client'
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

//i created this hook because i dont want to write the async function everywhere when needed instead i created a hook 
export default function useSignOut(){
    const router = useRouter();

    const handleSignout = async function signOut() {
    //to signout the user
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/"); // redirect to login page
          toast.success("Signed out successfully");
        },
        onError: ()=>{
            toast.error("Failed to sign out");
        }
      },
    });
  }

  return handleSignout
}