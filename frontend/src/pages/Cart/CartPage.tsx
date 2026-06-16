import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layouts/MainLayout";
import Container from "../../components/common/Container";

import { getCart } from "../../services/cartService";
import type { CartItem } from "../../types/cartItem";
import { BsCartX, BsShieldCheck } from "react-icons/bs";

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCart() {
      try {
        const data = await getCart();
        setItems(data);
      } finally {
        setLoading(false);
      }
    }
    loadCart();
  }, []);

  function handleCheckout() {
    navigate("/checkout");
  }

  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <MainLayout>
      <div className="bg-background min-h-[90vh]">
        <Container>
          <div className="py-20">
            <div className="mb-12 border-b border-border pb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-primary mb-4 cyber-glow">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Shopping Cart
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                Command Center Cart
              </h1>
              <p className="mt-4 text-lg text-foreground/60 leading-relaxed max-w-2xl">
                Review your selected products before checkout.
              </p>
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center">
                 <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                    <span className="font-mono text-xs uppercase tracking-widest text-primary animate-pulse">Loading Inventory...</span>
                 </div>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-80 text-foreground/40 border-2 border-dashed border-border rounded-3xl bg-surface/50">
                 <BsCartX size={48} className="mb-6 opacity-50" />
                 <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                 <p className="font-mono text-sm uppercase tracking-widest">Add products to start shopping.</p>
                 <button 
                   onClick={() => navigate('/products')}
                   className="mt-8 px-6 py-3 bg-surface border border-border rounded-xl font-bold text-foreground hover:border-primary hover:text-primary transition-all"
                 >
                    Browse Products
                 </button>
              </div>
            ) : (
              <div className="grid gap-12 lg:grid-cols-12 items-start">
                {/* Cart Items */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-border/50 text-xs font-mono font-bold uppercase tracking-wider text-foreground/50">
                     <span>Product</span>
                     <span>Authorization Value</span>
                  </div>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="group flex flex-col sm:flex-row items-center gap-6 rounded-2xl bg-surface p-6 border border-border shadow-sm hover:border-primary/30 transition-all premium-card"
                    >
                      <div className="h-24 w-24 bg-background rounded-xl border border-border/50 flex items-center justify-center p-2">
                        {/* Placeholder for item image if available in future API */}
                        <div className="font-mono text-xs text-foreground/20">IMG_N/A</div>
                      </div>
                      
                      <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                            {item.productName}
                          </h3>
                          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-foreground/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                            Qty: {item.quantity}
                          </div>
                        </div>

                        <div className="text-2xl font-black text-foreground">
                          ₹{item.totalPrice.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-4 sticky top-28">
                  <div className="rounded-3xl bg-card-bg border border-card-border p-8 shadow-2xl premium-card relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
                    
                    <h2 className="text-2xl font-extrabold text-foreground mb-6 pb-6 border-b border-border/50">
                      Order Summary
                    </h2>

                    <div className="space-y-4 mb-8">
                       <div className="flex justify-between text-foreground/70 text-sm">
                          <span>Subtotal</span>
                          <span className="font-mono">₹{total.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between text-foreground/70 text-sm">
                          <span>Processing Fee</span>
                          <span className="font-mono">₹0</span>
                       </div>
                       <div className="flex justify-between items-center text-foreground mt-4 pt-4 border-t border-border/50">
                          <span className="font-bold">Total</span>
                          <span className="text-3xl font-black text-primary">₹{total.toLocaleString()}</span>
                       </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="w-full relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-primary px-8 py-4 font-bold text-white shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40 cyber-glow-hover mb-4"
                    >
                      Checkout
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 text-xs text-foreground/40 font-mono">
                       <BsShieldCheck /> Secure 256-bit Encryption
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
      </div>
    </MainLayout>
  );
}
