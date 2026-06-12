import { Link } from "react-router-dom";
import Container from "../common/Container";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight">
            NiyasStore
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="rounded-lg border px-4 py-2 text-sm">
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Register
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
