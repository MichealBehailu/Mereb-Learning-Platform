import Image from "next/image";

import { ThemeToggle } from "@/components/ui/theme-Toggle";

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-red-500">Hello world</h1>
      <ThemeToggle />
    </div>
  );
}
