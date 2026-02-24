"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GithubIcon, Loader2, LoaderIcon, Send } from "lucide-react";
import { useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  const [githubPending, startGithubTransition] = useTransition(); //this is to show the pending state when the Login with github button clicked or inshort its for pending state
  const [emailPending, startEmailTransition] = useTransition(); //this is to show the pending state when the Login with email button clicked or inshort its for pending state
  const [email, setEmail] = useState(""); //to store the user email


  async function signInWithGithub() {
    startGithubTransition(async () => {
      //if it is in process this will make the gihubPending to true //after it finshed it will make githubPending to false
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in with Github, you will be redirected...");
          },
          onError: (error) => {
            console.error("GitHub sign-in error:", error);
            toast.error(
              `Sign-in failed: ${error.error?.message || "Internal Server Error"}`,
            );
          },
        },
      });
    });
  }

   function signInWithEmail() {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
        fetchOptions:{
          onSuccess: ()=>{
            toast.success("Email sent ")
            router.push("/verify-request")
          },
          onError: ()=>{
            toast.error("Error sending email")
          }
        }
      })
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome back!</CardTitle>
        <CardDescription>
          Login with your Github or Email Account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          disabled={githubPending}
          onClick={signInWithGithub}
          className="w-full"
          variant="outline"
        >
          {githubPending ? (
            <>
              <LoaderIcon className="size-4 animate-spin" /> Signing in...
            </>
          ) : (
            <>
              <GithubIcon className="size-4" /> Sign in with Github
            </>
          )}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-mute-foreground">
            Or continue with
          </span>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="m@example.com" required />
          </div>
          <Button onClick={signInWithEmail} disabled={emailPending}>
            {emailPending ? (
              <>
                <Loader2 className="size-4 animate-spin"/>
                <span>Loading...</span>
              </>) : (
                <>
                <Send className="size-4" />
                <span>Continue with Email</span>
                </>
              )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
