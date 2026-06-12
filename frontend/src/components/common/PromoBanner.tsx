import { Link } from "react-router-dom";

import Container from "./Container";

export default function PromoBanner() {
  return (
    <section className="py-20">
      <Container>
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 px-8 py-12 text-white lg:px-12">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-medium">
              Limited Time Offers
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
              Upgrade your setup.
            </h2>

            <p className="mt-4 text-lg leading-8 text-emerald-100">
              Discover laptops, smartphones, gaming gear and accessories
              carefully selected for work, entertainment and everyday use.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="rounded-xl bg-emerald-500 px-6 py-3 font-medium text-white transition hover:bg-emerald-400"
              >
                Shop Collection
              </Link>

              <Link
                to="/products"
                className="rounded-xl border border-white/30 px-6 py-3 font-medium text-white transition hover:bg-white/10"
              >
                View Products
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
