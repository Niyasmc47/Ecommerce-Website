import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside
      className="
        w-64
        border-r
        bg-white
        p-6
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
        "
      >
        <Link to="/admin" className="rounded-lg p-3 hover:bg-slate-100">
          Dashboard
        </Link>

        <Link
          to="/admin/products"
          className="rounded-lg p-3 hover:bg-slate-100"
        >
          Products
        </Link>

        <Link
          to="/admin/categories"
          className="rounded-lg p-3 hover:bg-slate-100"
        >
          Categories
        </Link>

        <Link to="/admin/orders" className="rounded-lg p-3 hover:bg-slate-100">
          Orders
        </Link>

        <Link to="/admin/users" className="rounded-lg p-3 hover:bg-slate-100">
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
