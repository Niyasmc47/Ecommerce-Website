import { Link, useLocation } from "react-router-dom";
import { BsGrid, BsBoxSeam, BsReceipt, BsPeople, BsGear, BsMoonStars, BsSun, BsShop } from "react-icons/bs";
import { useEffect, useState } from "react";

export default function AdminSidebar() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const mainLinks = [
    { path: "/admin", label: "Analytics", icon: BsGrid },
    { path: "/admin/products", label: "Products", icon: BsBoxSeam },
    { path: "/admin/orders", label: "Orders", icon: BsReceipt },
    { path: "/admin/users", label: "Customers", icon: BsPeople },
  ];

  return (
    <aside className="w-64 border-r border-border bg-[#0B1120] flex flex-col h-screen sticky top-0">
      <div className="p-6 pb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Velocity.Shop</h1>
        <p className="text-xs text-white/50 font-bold uppercase tracking-widest mt-1">Admin Portal</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 flex flex-col gap-1">
        {mainLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-all ${
                isActive 
                  ? "bg-white/10 text-white" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <link.icon size={18} className={isActive ? "text-white" : "text-white/50"} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-4">
        <button
          onClick={() => {
             // If on products page, trigger form. Otherwise navigate to products page.
             if (location.pathname !== '/admin/products') {
                window.location.href = '/admin/products';
             } else {
                const btn = document.getElementById('trigger-create-product');
                if (btn) btn.click();
             }
          }}
          className="w-full flex items-center justify-center rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-3 text-sm font-bold transition-colors shadow-lg shadow-blue-500/20"
        >
          Create New Listing
        </button>

        <div className="space-y-1">
           <Link to="/" className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all">
             <BsShop size={18} className="text-white/50" /> Back to Store
           </Link>
           <button 
             onClick={() => setDarkMode(!darkMode)}
             className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all"
           >
             {darkMode ? <BsSun size={18} className="text-white/50" /> : <BsMoonStars size={18} className="text-white/50" />}
             Toggle Theme
           </button>
           <button className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all">
             <BsGear size={18} className="text-white/50" /> Settings
           </button>
        </div>
      </div>
    </aside>
  );
}
