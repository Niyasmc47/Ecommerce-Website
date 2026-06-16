import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  createOrder,
  createCheckoutSession,
  getCart,
  type CheckoutRequest,
} from "../../services/cartService";

import { getAddresses } from "../../services/profileService";
import type { CartItem } from "../../types/cartItem";

const InputField = ({ name, label, placeholder, value, onChange, required = false, type = "text" }: { name: string, label: string, placeholder: string, value: string | number, onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>, required?: boolean, type?: string }) => (
  <div>
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full rounded-lg border border-slate-200 bg-[#F1F5F9] px-4 py-3 text-sm text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-400"
    />
  </div>
);

export default function CheckoutPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<CheckoutRequest>({
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    paymentMethod: "Stripe",
  });

  const [addresses, setAddresses] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("Standard");

  useEffect(() => {
    async function load() {
      try {
        const addrs = await getAddresses();
        setAddresses(addrs);
      } catch (err) {
        // user might not be logged in or other error
      }

      try {
        const items = await getCart();
        setCartItems(items);
        if (items.length === 0) {
          navigate("/cart");
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [navigate]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      if (form.paymentMethod === "COD") {
        await createOrder(form);
        toast.success("Order Placed Successfully!");
        navigate("/orders");
        return;
      }

      const session = await createCheckoutSession(form);
      window.location.href = session.url;
    } catch {
      toast.error("Checkout Failed");
    } finally {
      setLoading(false);
    }
  }

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingFee = shippingMethod === "Standard" ? 0 : 24.99;
  const tax = subtotal * 0.08; // 8% tax
  const grandTotal = subtotal + shippingFee + tax;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans relative pb-20">
      {/* Top Navbar Header */}
      <header className="px-8 py-4 flex items-center justify-between border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
        <Link to="/" className="text-xl font-black text-[#0D47A1] tracking-tight">Velocity.Shop</Link>
        <div className="flex items-center gap-4 text-slate-600">
          <Link to="/cart" className="text-sm font-semibold hover:text-slate-900">Return to Cart</Link>
        </div>
      </header>

      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[200px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 md:px-8 pt-8 md:pt-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Left Column - Form */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <div>
              <span className="inline-block bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-4">FINAL STAGE</span>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">Checkout</h1>
              <p className="text-slate-500 text-sm max-w-lg leading-relaxed">Complete your purchase by providing your shipping and payment information. All data is encrypted and handled securely.</p>
            </div>

            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
              
              {/* Shipping Address */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <span className="material-symbols-outlined text-blue-600 text-[24px]">local_shipping</span>
                  <h2 className="text-xl font-bold text-slate-900">Shipping Address</h2>
                </div>

                {addresses.length > 0 && (
                  <div className="mb-8 p-5 bg-blue-50/50 border border-blue-100 rounded-xl">
                    <h4 className="font-bold text-sm text-blue-900 mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">bookmark</span> Saved Addresses
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div 
                          key={addr.id} 
                          onClick={() => setForm({
                            ...form,
                            addressLine1: addr.addressLine1,
                            addressLine2: addr.addressLine2,
                            city: addr.city,
                            state: addr.state,
                            postalCode: addr.postalCode,
                            country: addr.country,
                          })}
                          className="border border-slate-200 bg-white p-4 rounded-xl cursor-pointer hover:border-blue-500 hover:shadow-md transition-all group relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-sm text-slate-800 flex items-center gap-2">
                              {addr.isPrimary ? 'Primary Address' : 'Saved Address'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium">{addr.addressLine1}</p>
                          <p className="text-xs text-slate-500 mt-1">{addr.city}, {addr.state} {addr.postalCode}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid gap-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField name="fullName" label="Full Identification Name" placeholder="e.g. Johnathan Doe" value={form.fullName} onChange={handleChange} required />
                    <InputField name="phoneNumber" label="Secure Contact Number" placeholder="+1 (555) 000-0000" value={form.phoneNumber} onChange={handleChange} required />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField name="addressLine1" label="Primary Routing Address" placeholder="123 Commerce Way" value={form.addressLine1} onChange={handleChange} required />
                    <InputField name="addressLine2" label="Secondary Routing (Optional)" placeholder="Suite 404, Building B" value={form.addressLine2} onChange={handleChange} />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField name="city" label="City Sector" placeholder="New York" value={form.city} onChange={handleChange} required />
                    <InputField name="state" label="State / Province" placeholder="NY" value={form.state} onChange={handleChange} required />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField name="postalCode" label="Postal / Zip Code" placeholder="10001" value={form.postalCode} onChange={handleChange} required />
                    <InputField name="country" label="Country" placeholder="United States" value={form.country} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-[#0D47A1] text-[24px]">inventory_2</span>
                  <h2 className="text-xl font-bold text-slate-900">Shipping Method</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <label className={`cursor-pointer border-2 rounded-xl p-5 flex items-start gap-4 transition-all ${shippingMethod === 'Standard' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                    <div className="flex items-center h-5 mt-0.5">
                      <input type="radio" name="shipping" value="Standard" checked={shippingMethod === 'Standard'} onChange={() => setShippingMethod('Standard')} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-900 text-sm">Standard Delivery</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">4-7 business days</p>
                      <p className="font-bold text-[#0D47A1] text-sm mt-3">Free</p>
                    </div>
                  </label>

                  <label className={`cursor-pointer border-2 rounded-xl p-5 flex items-start gap-4 transition-all ${shippingMethod === 'Express' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                    <div className="flex items-center h-5 mt-0.5">
                      <input type="radio" name="shipping" value="Express" checked={shippingMethod === 'Express'} onChange={() => setShippingMethod('Express')} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-900 text-sm">Express Priority</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">1-2 business days</p>
                      <p className="font-bold text-[#0D47A1] text-sm mt-3">₹24.99</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#0D47A1] text-[24px]">payments</span>
                    <h2 className="text-xl font-bold text-slate-900">Payment Method</h2>
                  </div>
                  <div className="flex gap-2 text-slate-400">
                    <span className="material-symbols-outlined text-[20px]">verified_user</span>
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className={`cursor-pointer border-2 rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all ${form.paymentMethod === 'Stripe' ? 'border-blue-600 bg-blue-50/50 text-[#0D47A1]' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}>
                    <input type="radio" name="paymentMethod" value="Stripe" checked={form.paymentMethod === 'Stripe'} onChange={handleChange} className="hidden" />
                    <span className="material-symbols-outlined text-[28px]">credit_card</span>
                    <span className="font-bold text-slate-900 text-sm">Digital Uplink</span>
                  </label>

                  <label className={`cursor-pointer border-2 rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all ${form.paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50/50 text-[#0D47A1]' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}>
                    <input type="radio" name="paymentMethod" value="COD" checked={form.paymentMethod === 'COD'} onChange={handleChange} className="hidden" />
                    <span className="material-symbols-outlined text-[28px]">account_balance_wallet</span>
                    <span className="font-bold text-slate-900 text-sm">Physical Transfer</span>
                  </label>
                </div>
              </div>

            </form>
          </div>

          {/* Right Column - Order Summary Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-28 space-y-6">
              
              {/* Order Summary Card */}
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map(item => {
                    return (
                      <div key={item.id} className="flex gap-4 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                        <div className="w-16 h-16 bg-[#F8FAFC] rounded-lg border border-slate-100 p-2 shrink-0 flex items-center justify-center">
                          <div className="font-mono text-[10px] text-slate-400 text-center leading-tight">IMG<br/>N/A</div>
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h4 className="font-bold text-slate-900 text-sm truncate">{item.productName}</h4>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold text-[#0D47A1] text-sm">₹{item.price.toFixed(2)}</span>
                            <span className="text-[10px] font-bold text-slate-400">Qty: {item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-200 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping Fee</span>
                    <span className="font-bold text-[#059669]">{shippingFee === 0 ? 'Free' : `₹${shippingFee.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-bold text-slate-900">₹{tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 mt-6 border-t border-slate-200">
                  <span className="text-lg font-bold text-slate-900">Grand Total</span>
                  <span className="text-2xl font-black text-[#0D47A1]">₹{grandTotal.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  form="checkout-form"
                  disabled={loading}
                  className="w-full mt-8 flex items-center justify-center gap-2 bg-[#0D47A1] text-white py-4 px-6 rounded-xl font-bold transition-all hover:bg-blue-800 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                >
                  <span className="material-symbols-outlined text-[20px]">verified_user</span>
                  {loading ? "Processing..." : "Place Secured Order"}
                </button>

                <div className="mt-6 p-4 bg-blue-50/50 border border-blue-100 rounded-lg flex gap-3">
                  <span className="material-symbols-outlined text-blue-600 shrink-0">shield</span>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-1">Secure Transmission</h5>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Your connection is secured using military-grade 256-bit encryption. Payment details are processed directly and never stored on our servers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Checkout Timeline */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px]">history</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Checkout Timeline</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Active Session</p>
                  </div>
                </div>

                <div className="space-y-4 pl-4 border-l-2 border-slate-100 ml-4">
                  <div className="relative pl-6">
                    <div className="absolute -left-[27px] top-1 w-6 h-6 rounded-full bg-[#A7F3D0] border-4 border-white flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#059669]"></div>
                    </div>
                    <div className="bg-[#A7F3D0] text-[#065F46] px-3 py-1.5 rounded-md text-xs font-bold inline-flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]">receipt_long</span> Order Summary
                    </div>
                  </div>
                  <div className="relative pl-6">
                    <div className="absolute -left-[23px] top-1 w-4 h-4 rounded-full bg-slate-200 border-4 border-white"></div>
                    <span className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]">local_shipping</span> Shipping Info
                    </span>
                  </div>
                  <div className="relative pl-6">
                    <div className="absolute -left-[23px] top-1 w-4 h-4 rounded-full bg-slate-200 border-4 border-white"></div>
                    <span className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]">payments</span> Payment Method
                    </span>
                  </div>
                  <div className="relative pl-6">
                    <div className="absolute -left-[23px] top-1 w-4 h-4 rounded-full bg-slate-200 border-4 border-white"></div>
                    <span className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]">history</span> Order History
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
