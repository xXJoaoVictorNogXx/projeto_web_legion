"use client";

import { usePathname } from "next/navigation";

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
      {renderNavbar ? null : <div>navbar</div>}

      {children}
    </div>
  );
}
