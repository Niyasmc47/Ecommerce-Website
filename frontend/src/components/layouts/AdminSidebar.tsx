import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside
      className="
        w-64
        border-r
        border-slate-200
        bg-white
        p-6

        dark:border-slate-700
        dark:bg-slate-900
      "
    >
      <h2
        className="
          mb-8
          text-2xl
          font-bold
        "
      >
        Admin Panel
      </h2>

      <nav
        className="
          flex
          flex-col
          gap-3
          dark:text-white
        "
      >
        <Link
          to="/admin"
          className="rounded-lg p-3 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Dashboard
        </Link>

        <Link
          to="/admin/products"
          className="rounded-lg p-3 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Products
        </Link>

        <Link
          to="/admin/categories"
          className="rounded-lg p-3 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Categories
        </Link>

        <Link
          to="/admin/orders"
          className="rounded-lg p-3 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Orders
        </Link>

        <Link
          to="/admin/users"
          className="rounded-lg p-3 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Users
        </Link>

        <button
          onClick={() => {
            localStorage.clear();

            window.location.href = "/";
          }}
          className="
    mt-8
    rounded-lg
    bg-red-600
    p-3
    text-white
  "
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
