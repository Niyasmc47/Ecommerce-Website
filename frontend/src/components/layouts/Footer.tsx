import { Link } from "react-router-dom";

import Container from "../common/Container";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              Velocity.Shop
            </h3>

            <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
              Your destination for electronics, gaming gear, accessories and
              modern technology.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              Shop
            </h4>

            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400">
              <Link to="/products">All Products</Link>

              <Link to="/products">New Arrivals</Link>

              <Link to="/products">Featured Items</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              Company
            </h4>

            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400">
              <Link to="/">Home</Link>

              <Link to="/products">Products</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              Support
            </h4>

            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400">
              <a href="#">Help Center</a>

              <a href="#">Contact Support</a>

              <a href="#">FAQs</a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 py-6 text-center text-sm text-slate-400 dark:border-slate-800 dark:text-slate-500">
          © 2026 Velocity.Shop. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
