import type { Product } from "../../types/product";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { addToCart } from "../../services/cartService";
import { useWishlist } from "../../contexts/WishlistContext";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  async function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  }

  async function handleAddToCart(
    e: React.MouseEvent
  ) {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToCart(
        product.id,
        1
      );

      toast.success(
        "Added to cart"
      );
    } catch {
      toast.error(
        "Please login first"
      );
    }
  }

  return (
    <div
      onClick={() =>
        navigate(
          `/products/${product.id}`
        )
      }
      className="group block relative overflow-hidden rounded-2xl bg-card-bg border border-card-border shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/30 premium-card cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface p-6 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <button
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-surface/80 backdrop-blur-sm border border-border shadow-sm hover:scale-110 active:scale-95 transition-all duration-300 group/btn"
        >
          <span className={`material-symbols-outlined text-[20px] transition-colors ${isWishlisted ? 'text-red-500 [font-variation-settings:"FILL"1]' : 'text-on-surface-variant group-hover/btn:text-red-500'}`}>
            favorite
          </span>
        </button>

        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 drop-shadow-xl"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            <p className="mt-1 text-xs font-mono uppercase tracking-wider text-foreground/50">
              {/* @ts-ignore */}
              {product.category || "Component"}
            </p>
          </div>

          <span className="text-xl font-black tracking-tighter text-foreground whitespace-nowrap">
            ₹{product.price.toLocaleString()}
          </span>
        </div>

        <p className="line-clamp-2 text-sm text-foreground/60 leading-relaxed mb-6">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          {product.stock > 0 ? (
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>

              <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                In Stock ({product.stock})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-danger"></span>

              <span className="text-xs font-mono font-bold text-danger uppercase tracking-wider">
                Depleted
              </span>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface border border-border text-foreground hover:bg-primary hover:border-primary hover:text-white transition-all"
          >
            <span className="text-lg leading-none mb-[2px]">
              +
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}