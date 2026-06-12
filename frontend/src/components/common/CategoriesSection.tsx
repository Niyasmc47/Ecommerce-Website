import { FaHeadphones, FaLaptop, FaMobileAlt, FaGamepad } from "react-icons/fa";

import Container from "./Container";

const categories = [
  { title: "Smartphones", icon: FaMobileAlt },
  { title: "Laptops", icon: FaLaptop },
  { title: "Gaming", icon: FaGamepad },
  { title: "Accessories", icon: FaHeadphones },
];

export default function CategoriesSection() {
  return (
    <section className="bg-white py-24 dark:bg-slate-950">
      <Container>
        <div className="mb-14">
          <h2 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Shop by Category
          </h2>

          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
            Explore our most popular product categories.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.title}
              className="group rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-slate-900 dark:ring-slate-700"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950">
                <category.icon className="text-3xl text-emerald-600 dark:text-emerald-400" />
              </div>

              <h3 className="mt-6 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {category.title}
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Browse our latest {` ${category.title.toLowerCase()}`}
                collection.
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
