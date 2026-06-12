import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import CategoriesSection from "../../components/common/CategoriesSection";
import PromoBanner from "../../components/common/PromoBanner";
import FeaturedProducts from "../../components/common/FeaturedProducts";

import MainLayout from "../../components/layouts/MainLayout";
import Container from "../../components/common/Container";

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="bg-slate-50 py-28">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <span
              className="
                inline-block
                rounded-full
                border
                border-slate-300
                px-4
                py-2
                text-sm
                font-medium
                text-slate-700
              "
            >
              Premium Marketplace
            </span>

            <h1
              className="
                mt-8
                text-5xl
                font-bold
                tracking-tight
                text-slate-900
                md:text-7xl
              "
            >
              Discover technology built for the future.
            </h1>

            <p
              className="
                mt-6
                max-w-2xl
                text-lg
                text-slate-600
              "
            >
              Explore premium gadgets, electronics, accessories and innovative
              products carefully selected for modern lifestyles.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="
                  rounded-xl
                  bg-blue-600
                  px-6
                  py-3
                  font-medium
                  text-white
                  transition
                  hover:bg-blue-700
                "
              >
                Shop Now
              </Link>

              <Link
                to="/products"
                className="
                  rounded-xl
                  border
                  border-slate-300
                  px-6
                  py-3
                  font-medium
                  hover:bg-white
                "
              >
                Browse Products
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Categories */}
      <CategoriesSection />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Promotional Banner */}
      <PromoBanner />
    </MainLayout>
  );
}
