"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <header className="w-full flex p-4 border-b-2 justify-end ">
      <div className="justify-between flex w-full items-center">
        <Image
          src="/logo.png"
          alt=""
          width={65}
          height={65}
          className="dark:invert"
        />

        <NavigationMenu className="flex w-full gap-6">
          <Link
            href={"/admin/relatorios"}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname.startsWith("/admin/relatorios")
                ? "text-blue-500"
                : "text-muted-foreground"
            )}
          >
            Relatórios
          </Link>
          <Link
            href={"/pre-matricula"}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname.startsWith("/pre-matricula")
                ? "text-blue-500"
                : "text-muted-foreground"
            )}
          >
            Pré-Matrícula
          </Link>
          <Link
            href={"/gerenciamento"}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname.startsWith("/gerenciamento")
                ? "text-blue-500"
                : "text-muted-foreground"
            )}
          >
            Gerenciamento
          </Link>
          <Link
            href={"/aprovacao"}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname.startsWith("/aprovacao")
                ? "text-blue-500"
                : "text-muted-foreground"
            )}
          >
            Aprovação
          </Link>
          <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 p-2"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </Button>
        </NavigationMenu>
      </div>
    </header>
  );
}
