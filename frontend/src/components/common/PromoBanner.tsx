import Container from "./Container";

export default function PromoBanner() {
  return (
    <section className="py-20">
      <Container>
        <div
          className="
            rounded-3xl
            bg-blue-600
            px-10
            py-16
            text-white
          "
        >
          <h2 className="text-4xl font-bold">Summer Technology Sale</h2>

          <p className="mt-4 max-w-xl text-blue-100">
            Save up to 40% on selected gadgets, accessories and electronics.
          </p>

          <button
            className="
              mt-8
              rounded-xl
              bg-white
              px-6
              py-3
              font-medium
              text-blue-600
            "
          >
            Explore Deals
          </button>
        </div>
      </Container>
    </section>
  );
}
