"use client";
import Image from "next/image";

import { ThemeToggle } from "@/components/ui/theme-Toggle";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const { data: session } = authClient.useSession(); //to fetch the user data on a client side
  const router = useRouter();

  async function signOut() { //to signout the user 
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/"); // redirect to login page
          toast.success("Signed out successfully");
        },
      },
    });
  }

  return (
    <div className="p-24">
      <h1 className="text-2xl font-bold text-red-500">Hello world</h1>
      <ThemeToggle />
      {session ? (
        <div>
          <p>{session.user?.name}</p>
          <Button onClick={signOut}>Logout</Button>
        </div>
      ) : (
        <p>
          <Button>Login</Button>
        </p>
      )}
    </div>
  );
  
}

//TODO check the logout page on the index page and navigate to the login page /login check if you can access the page