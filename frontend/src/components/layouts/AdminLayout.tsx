import type { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/30">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}