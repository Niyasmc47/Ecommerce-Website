import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import MainLayout from "../../components/layouts/MainLayout";
import { getProductById, getProducts } from "../../services/productService";
import { addToCart } from "../../services/cartService";
import { getReviews, createReview } from "../../services/reviewService";

import type { Product } from "../../types/product";
import type { Review } from "../../types/review";
import ProductCard from "../../components/cards/ProductCard";

const COLOR_MAP: Record<string, string> = {
  "Space Gray": "bg-[#4B4C4F]",
  "Silver": "bg-[#E3E4E5]",
  "Starlight": "bg-[#F3EFE9]",
  "Midnight": "bg-[#2E3642]",
  "Black": "bg-black",
  "White": "bg-white border-outline-variant",
  "Red": "bg-red-500",
  "Blue": "bg-blue-600",
  "Green": "bg-emerald-500",
  "Yellow": "bg-yellow-400",
  "Pink": "bg-pink-400",
  "Purple": "bg-purple-600",
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  
  // UI States
  const [activeTab, setActiveTab] = useState("description");
  const [mainImage, setMainImage] = useState("");
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getProductById(Number(id));
        setProduct(data);
        setMainImage(data.imageUrl);

        // Pre-select first options
        try {
           if (data.variants) {
              const vars = JSON.parse(data.variants);
              const initialSelected: Record<string, string> = {};
              Object.entries(vars).forEach(([k, v]) => {
                 if (Array.isArray(v) && v.length > 0) initialSelected[k] = v[0];
              });
              setSelectedVariants(initialSelected);
           }
        } catch {}

        Promise.all([
          getReviews(Number(id)).catch(() => []),
          getProducts().catch(() => [])
        ]).then(([reviewData, allProducts]) => {
          setReviews(reviewData);
          setRelatedProducts(allProducts.filter(p => p.id !== Number(id)).slice(0, 4));
        });

      } catch {
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  const parsedVariants = useMemo(() => {
     if (!product?.variants) return {};
     try { return JSON.parse(product.variants) as Record<string, string[]>; } 
     catch { return {}; }
  }, [product?.variants]);

  const parsedSpecs = useMemo(() => {
     if (!product?.specifications) return {};
     try { return JSON.parse(product.specifications) as Record<string, string>; } 
     catch { return {}; }
  }, [product?.specifications]);

  async function handleAddToCart() {
    if (!product) return;
    try {
      await addToCart(product.id, 1);
      toast.success("Added to cart");
    } catch {
      toast.error("Authentication required");
    }
  }

  async function handleBuyNow() {
    if (!product) return;
    try {
      await addToCart(product.id, 1);
      navigate("/checkout");
    } catch {
      toast.error("Authentication required");
    }
  }

  async function handleReviewSubmit() {
    if (!product) return;
    try {
      await createReview(product.id, rating, comment);
      toast.success("Review logged successfully");
      const reviewData = await getReviews(product.id);
      setReviews(reviewData);
      setComment("");
      setRating(5);
    } catch {
      toast.error("Failed to submit review");
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="flex h-[60vh] items-center justify-center flex-col gap-4">
          <span className="text-4xl">⚠️</span>
          <div className="font-mono text-sm uppercase tracking-widest text-error">Product Not Found</div>
        </div>
      </MainLayout>
    );
  }

  const galleryImages = [product.imageUrl, ...(product.images || [])].filter(Boolean);
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <MainLayout>
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-semibold">{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column - Gallery */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="aspect-square w-full rounded-2xl border border-outline-variant bg-surface-container-lowest flex items-center justify-center p-8 overflow-hidden">
              <img src={mainImage} alt={product.name} className="w-full h-full object-contain" />
            </div>
            
            {galleryImages.length > 1 && (
               <div className="grid grid-cols-5 gap-4">
                 {galleryImages.map((img, idx) => (
                   <button 
                     key={idx}
                     onClick={() => setMainImage(img)}
                     className={`aspect-square rounded-xl border-2 flex items-center justify-center p-2 bg-surface-container-lowest transition-all ${mainImage === img ? 'border-primary' : 'border-outline-variant hover:border-primary/50'}`}
                   >
                     <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-contain" />
                   </button>
                 ))}
               </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="mb-6">
              {product.brand && (
                 <span className="inline-block bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-micro-tag font-micro-tag uppercase tracking-widest mb-4 mr-2">{product.brand}</span>
              )}
              {product.tags && product.tags.slice(0, 2).map(tag => (
                 <span key={tag} className="inline-block bg-surface-container-high text-on-surface px-3 py-1 rounded-full text-micro-tag font-micro-tag uppercase tracking-widest mb-4 mr-2">{tag}</span>
              ))}
              <h1 className="text-display-sm font-headline-lg font-bold text-on-surface mb-4 leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center text-tertiary-fixed-dim">
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="material-symbols-outlined text-[16px]">star_half</span>
                </div>
                <span className="text-on-surface-variant">{averageRating} ({reviews.length > 0 ? reviews.length : '128'} Reviews)</span>
                <span className="text-outline-variant">|</span>
                {product.stock > 0 ? (
                  <span className="text-[#059669] font-bold">In Stock</span>
                ) : (
                  <span className="text-error font-bold">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-primary-container/20 rounded-2xl p-6 mb-8 border border-primary/10">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-display-md text-primary font-bold">₹{product.price.toLocaleString()}</span>
                {product.compareAtPrice && (
                  <span className="text-body-lg text-on-surface-variant line-through mb-1">₹{product.compareAtPrice.toLocaleString()}</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-primary font-medium bg-primary-container/50 w-max px-3 py-1.5 rounded-lg">
                <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                0% Installment available up to 24 months
              </div>
            </div>

            {/* Options */}
            {Object.keys(parsedVariants).length > 0 && (
               <div className="space-y-6 mb-8">
                 {Object.entries(parsedVariants).map(([variantName, options]) => {
                    const isColorVariant = variantName.toLowerCase().includes('color') || variantName.toLowerCase().includes('finish');
                    
                    // If it's not a color variant and only has 1 option, just show it as text
                    if (options.length === 1 && !isColorVariant) {
                       return (
                         <div key={variantName} className="flex items-center gap-2">
                           <h3 className="text-label-md font-bold">{variantName}:</h3>
                           <span className="text-on-surface-variant font-normal">{options[0]}</span>
                         </div>
                       );
                    }

                    return (
                       <div key={variantName}>
                         <h3 className="text-label-md font-bold mb-3">{variantName}: <span className="text-on-surface-variant font-normal">{selectedVariants[variantName] || ''}</span></h3>
                         
                         <div className={`flex flex-wrap gap-3 ${isColorVariant ? 'items-center' : ''}`}>
                           {options.map((option) => {
                             const isSelected = selectedVariants[variantName] === option;
                             
                             if (isColorVariant) {
                               const bgColor = COLOR_MAP[option] || 'bg-outline-variant';
                               return (
                                 <button
                                   key={option}
                                   onClick={() => setSelectedVariants(curr => ({...curr, [variantName]: option}))}
                                   className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isSelected ? 'ring-2 ring-primary ring-offset-2' : 'hover:scale-110'}`}
                                   title={option}
                                 >
                                   <span className={`w-full h-full rounded-full border shadow-inner ${bgColor}`}></span>
                                 </button>
                               );
                             } else {
                               return (
                                 <button
                                   key={option}
                                   onClick={() => setSelectedVariants(curr => ({...curr, [variantName]: option}))}
                                   className={`px-6 py-2.5 rounded-lg border font-medium transition-all ${isSelected ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant text-on-surface-variant hover:border-primary/50'}`}
                                 >
                                   {option}
                                 </button>
                               );
                             }
                           })}
                         </div>
                       </div>
                    );
                 })}
               </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="bg-primary text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="bg-primary-container text-primary font-bold py-4 rounded-xl hover:bg-primary-container/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Features list */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-outline-variant">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant">local_shipping</span>
                <div>
                  <div className="font-bold text-sm">Free Delivery</div>
                  <div className="text-[12px] text-on-surface-variant">Ships in 24 hours</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant">verified_user</span>
                <div>
                  <div className="font-bold text-sm">1 Year Warranty</div>
                  <div className="text-[12px] text-on-surface-variant">Official Manufacturer Warranty</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="flex items-center gap-8 border-b border-outline-variant overflow-x-auto hide-scrollbar">
            {[
              { id: "description", label: "Product Description" },
              { id: "specs", label: "Specifications" },
              { id: "reviews", label: `Customer Reviews (${reviews.length > 0 ? reviews.length : '128'})` },
              { id: "qa", label: "Q&A" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-label-md font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  {product.features && product.features.length > 0 && (
                     <h3 className="font-headline-sm font-bold">Key Features</h3>
                  )}
                  <p className="text-on-surface-variant leading-relaxed">
                    {product.description}
                  </p>
                  
                  {product.features && product.features.length > 0 && (
                     <ul className="space-y-4 pt-4 border-t border-outline-variant">
                       {product.features.map((feature, idx) => (
                         <li key={idx} className="flex items-start gap-3">
                           <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                           <span className="text-on-surface-variant">{feature}</span>
                         </li>
                       ))}
                     </ul>
                  )}
                </div>
                
                {Object.keys(parsedSpecs).length > 0 && (
                  <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant h-max">
                    {Object.entries(parsedSpecs).map(([key, value], index) => (
                      <div key={key} className={`grid grid-cols-3 p-4 ${index % 2 === 0 ? 'bg-primary/5' : 'bg-transparent'}`}>
                        <div className="font-bold text-sm col-span-1">{key}</div>
                        <div className="text-sm text-on-surface-variant col-span-2">{value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "specs" && (
              <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant max-w-3xl">
                {Object.keys(parsedSpecs).length === 0 ? (
                  <div className="p-8 text-center text-on-surface-variant">No technical specifications provided for this product.</div>
                ) : (
                  Object.entries(parsedSpecs).map(([key, value], index) => (
                    <div key={key} className={`grid grid-cols-3 p-4 ${index % 2 === 0 ? 'bg-primary/5' : 'bg-transparent'}`}>
                      <div className="font-bold text-sm col-span-1">{key}</div>
                      <div className="text-sm text-on-surface-variant col-span-2">{value}</div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant h-max">
                  <h3 className="text-headline-sm font-bold mb-4">Write a Review</h3>
                  <div className="space-y-4">
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 focus:border-primary outline-none"
                    >
                      <option value={5}>5 Stars - Excellent</option>
                      <option value={4}>4 Stars - Good</option>
                      <option value={3}>3 Stars - Average</option>
                      <option value={2}>2 Stars - Poor</option>
                      <option value={1}>1 Star - Terrible</option>
                    </select>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows={4}
                      className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 focus:border-primary outline-none resize-none"
                    />
                    <button
                      onClick={handleReviewSubmit}
                      className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-all"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  {reviews.length === 0 ? (
                    <div className="text-center py-12 text-on-surface-variant">
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-50">forum</span>
                      <p>No reviews yet. Be the first to review!</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-outline-variant pb-6 last:border-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold">
                              {review.userName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold">{review.userName}</div>
                              <div className="text-xs text-on-surface-variant">{new Date(review.createdDate).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="flex text-tertiary-fixed-dim mb-3">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="material-symbols-outlined text-[14px]">
                                {i < review.rating ? 'star' : 'star_outline'}
                              </span>
                            ))}
                          </div>
                          <p className="text-on-surface-variant">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "qa" && (
              <div className="text-center py-12 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">help</span>
                <p>No questions asked yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* You might also like */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-outline-variant pt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-headline-md font-bold">You might also like</h2>
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:border-primary hover:text-primary transition-all">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:border-primary hover:text-primary transition-all">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}
