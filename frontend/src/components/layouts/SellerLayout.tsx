import type { ReactNode } from "react";
import SellerSidebar from "./SellerSidebar";

interface Props {
  children: ReactNode;
}

export default function SellerLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/30">
      <SellerSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
