import { authClient } from "@/lib/auth-client";
import LoginForm from "./_component/LoginForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    //this will prevent logged in users from accessing the login page
    return redirect("/");
  }

  return <LoginForm />;
}
