import type { Product } from "../../types/product";

import { Link } from "react-router-dom";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <div
      className="
        group
        overflow-hidden
        rounded-3xl
        bg-white
        shadow-sm
        ring-1
        ring-slate-200

        dark:bg-slate-900
        dark:ring-slate-700

        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-xl
      "
    >
      <div
        className="
          overflow-hidden
          bg-slate-50

          dark:bg-slate-950
        "
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="
            h-72
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />
      </div>

      <div className="p-5">
        {/* Stock Badge */}
        <div className="mb-3">
          {product.stock > 0 ? (
            <span
              className="
                inline-flex
                rounded-full
                bg-emerald-100
                px-3
                py-1
                text-xs
                font-medium
                text-emerald-700

                dark:bg-emerald-950
                dark:text-emerald-300
              "
            >
              In Stock ({product.stock})
            </span>
          ) : (
            <span
              className="
                inline-flex
                rounded-full
                bg-red-100
                px-3
                py-1
                text-xs
                font-medium
                text-red-700

                dark:bg-red-950
                dark:text-red-300
              "
            >
              Out of Stock
            </span>
          )}
        </div>

        <h3
          className="
            text-xl
            font-semibold
            tracking-tight
            text-slate-900

            dark:text-white
          "
        >
          {product.name}
        </h3>

        <p
          className="
            mt-3
            line-clamp-2
            text-sm
            text-slate-500

            dark:text-slate-400
          "
        >
          {product.description}
        </p>

        <div
          className="
            mt-6
            flex
            items-center
            justify-between
          "
        >
          <span
            className="
              text-2xl
              font-bold
              text-slate-900

              dark:text-white
            "
          >
            ₹{product.price}
          </span>

          <Link
            to={`/products/${product.id}`}
            className="
              rounded-xl
              bg-emerald-600
              px-4
              py-2
              text-white
              transition

              hover:bg-emerald-700
            "
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}