import type { ReactNode } from "react";

import AdminSidebar
from "./AdminSidebar";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: Props) {

  return (

    <div
      className="
        flex
        min-h-screen
      "
    >

      <AdminSidebar />

      <main
        className="
          flex-1
          p-8
        "
      >
        {children}
      </main>

    </div>

  );
}