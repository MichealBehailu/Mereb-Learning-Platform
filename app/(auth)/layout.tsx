//this is a layout for the auth(login and signup) pages

import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo2 from '@/public/logo2.png'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="realtive flex min-h-svh flex-col items-center justify-center">
      <Link href="/" className={buttonVariants({
        variant:'outline',
        className:"absolute top-4 left-4"
      })}> <ArrowLeft className="size-4"/>Back</Link>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href='/' className="flex items-center gap-2 self-center font-medium">
         <Image src={Logo2} alt="logo" width={32} height={32} />
         Mereb Learning.
        </Link>
        {children}
        <div className="text-balance text-center text-xs text-muted-foreground">
          By clicking continue, you agree to our  <span className="hover:text-primary hover:underline cursor-pointer">Terms of Service</span> and <span className="cursor-pointer hover:text-primary hover:underline">Privacy Policy</span>.
        </div>
        </div>
    </div>
  );
}
