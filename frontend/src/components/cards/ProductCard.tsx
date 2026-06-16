import type { Product } from "../../types/product";
import { Link } from "react-router-dom";
import { BsArrowUpRight } from "react-icons/bs";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-card-bg border border-card-border shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/30 premium-card">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface p-6 flex items-center justify-center">
        {/* Subtle background glow for image */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 drop-shadow-xl"
        />

        {/* Quick View Overlay (appears on hover) */}
        <div className="absolute inset-0 bg-background/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
           <Link
             to={`/products/${product.id}`}
             className="px-6 py-3 bg-background/90 text-foreground font-bold text-sm rounded-full border border-border shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 hover:bg-primary hover:text-white hover:border-primary"
           >
             Inspect Hardware <BsArrowUpRight />
           </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
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

        <p className="line-clamp-2 text-sm text-foreground/60 leading-relaxed mb-6 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
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

          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-surface border border-border text-foreground hover:bg-primary hover:border-primary hover:text-white transition-all">
             <span className="text-lg leading-none mb-[2px]">+</span>
          </button>
        </div>
      </div>
    </div>
  );
}