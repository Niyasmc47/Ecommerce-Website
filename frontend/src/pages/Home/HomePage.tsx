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
      <section className="bg-slate-50 py-32 dark:bg-slate-950">
        <Container>
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="max-w-5xl"
          >
            <span
              className="
            inline-flex
            rounded-full
            bg-emerald-100
            px-4
            py-2
            text-sm
            font-medium
            text-emerald-700
          "
            >
              New arrivals available now
            </span>

            <h1
              className="
            mt-8
            text-5xl
            font-bold
            tracking-tight
            text-slate-900

            dark:text-white
            md:text-7xl
          "
            >
              Shop the latest electronics and everyday essentials.
            </h1>

            <p
              className="
            mt-6
            max-w-2xl
            text-lg
            leading-8
            text-slate-600

            dark:text-slate-300
          "
            >
              Browse phones, laptops, accessories, gaming gear, smart devices
              and more with fast delivery and secure checkout.
            </p>

            <div
              className="
            mt-10
            flex
            flex-wrap
            gap-4
          "
            >
              <Link
                to="/products"
                className="
              rounded-xl
              bg-emerald-600
              px-6
              py-3
              font-medium
              text-white
              transition
              hover:bg-emerald-700
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
              bg-white
              px-6
              py-3
              font-medium
              transition
              hover:bg-slate-50

              dark:border-slate-700
              dark:bg-slate-900
              dark:hover:bg-slate-800
            "
              >
                Browse Products
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
      <CategoriesSection />
      <FeaturedProducts />
      <PromoBanner />
    </MainLayout>
  );
}
