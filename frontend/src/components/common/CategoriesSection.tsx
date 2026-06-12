import Container from "./Container";

const categories = [
  {
    title: "Smartphones",
    icon: "📱",
  },
  {
    title: "Laptops",
    icon: "💻",
  },
  {
    title: "Gaming",
    icon: "🎮",
  },
  {
    title: "Accessories",
    icon: "⌚",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-20">
      <Container>
        <div className="mb-10">
          <h2 className="text-4xl font-bold">Shop by Category</h2>

          <p className="mt-2 text-slate-500">Browse products by category.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.title}
              className="
                rounded-2xl
                border
                border-slate-200
                p-8
                transition
                hover:-translate-y-1
                hover:shadow-lg
              "
            >
              <div className="text-5xl">{category.icon}</div>

              <h3 className="mt-4 text-xl font-semibold">{category.title}</h3>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
