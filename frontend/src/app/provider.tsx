"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";

export default function RootProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const authorizedPages = ["/login", "/cadastro"];
  const renderNavbar = authorizedPages.includes(pathname);

  return (
    <div>
      {renderNavbar ? null : <Header />}

      {children}
    </div>
  );
}
