import { Button } from "../../../components/ui/button";

import {
  BookOpenIcon,
  ChevronDownIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LogOutIcon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

import Link from "next/link";

import useSignout from '@/hooks/use-signout';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";

interface iAppProps{
    name:string;
    email:string;
    image:string;
}

export function UserDropdown({name,email,image}:iAppProps) {

  const handleSignOut = useSignout(); //to handle the signout using a hook created at the hook folder
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src={image} alt="Profile image" />
            <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            className="opacity-60"
            size={16}
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-64 ">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
            <span className="text-foreground turncate text-sm font-medium">{name}</span>
            <span className="text-muted-foreground turncate text-xs font-normal">{email}</span>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/">
            <HomeIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Home</span>
            </Link>
          </DropdownMenuItem>

         <DropdownMenuItem asChild>
            <Link href="/courses">
            <BookOpenIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Courses</span>
            </Link>
          </DropdownMenuItem>

         <DropdownMenuItem asChild>
            <Link href="/dashboard">
            <LayoutDashboardIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>

        </DropdownMenuGroup>

        <DropdownMenuItem onClick={handleSignOut}>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
