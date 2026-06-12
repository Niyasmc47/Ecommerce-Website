import type { Product } from "../../types/product";
import { Link } from "react-router-dom";
interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <div
      className="
      overflow-hidden
      rounded-2xl
      border
      border-slate-200
      bg-white
      transition
      hover:-translate-y-1
      hover:shadow-lg
      "
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className="
        h-64
        w-full
        object-cover
        "
      />

      <div className="p-5">
        <h3
          className="
          text-lg
          font-semibold
          "
        >
          {product.name}
        </h3>

        <p
          className="
          mt-2
          line-clamp-2
          text-sm
          text-slate-500
          "
        >
          {product.description}
        </p>

        <div
          className="
          mt-4
          flex
          items-center
          justify-between
          "
        >
          <span
            className="
            text-xl
            font-bold
            "
          >
            ₹{product.price}
          </span>

          <Link
            to={`/products/${product.id}`}
            className="rounded-xl
  bg-blue-600
  px-4
  py-2
  text-white
  "
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
