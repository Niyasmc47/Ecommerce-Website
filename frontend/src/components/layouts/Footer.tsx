import Container from "../common/Container";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200">
      <Container>
        <div className="py-10">
          <h3 className="font-semibold">NiyasStore</h3>

          <p className="mt-2 text-sm text-slate-500">
            Premium marketplace for technology, gadgets and accessories.
          </p>

          <p className="mt-6 text-sm text-slate-400">
            © 2026 NiyasStore. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
