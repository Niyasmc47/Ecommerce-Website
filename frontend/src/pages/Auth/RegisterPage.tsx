import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { register } from "../../services/authService";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!agreed) {
      toast.error("You must agree to the Terms of Service");
      return;
    }

    try {
      setLoading(true);
      await register({ name, email, password });
      toast.success("Account created successfully");
      navigate("/login");
    } catch {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Header - Only visible on mobile/tablet */}
      <header className="lg:hidden px-8 py-6 flex items-center justify-between bg-white border-b border-slate-200">
        <Link to="/" className="text-xl font-black text-[#0D47A1] tracking-tight">Velocity.Shop</Link>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side - Blue Splash */}
        <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#2563EB] text-white p-12 xl:p-20 relative overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10">
            <Link to="/" className="text-2xl font-black tracking-tight text-white hover:opacity-80 transition-opacity">Velocity.Shop</Link>
          </div>
          
          <div className="space-y-6 relative z-10">
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight">Evolve Your Shopping Experience.</h1>
            <p className="text-blue-100 text-lg max-w-md">
              Join thousands of smart shoppers who trust Velocity for a seamless, secure, and premium retail journey.
            </p>
            
            <div className="flex flex-col xl:flex-row items-center gap-4 pt-8">
              <div className="bg-blue-600/50 border border-blue-400/30 p-5 rounded-xl w-full backdrop-blur-sm">
                <span className="material-symbols-outlined text-2xl mb-2">verified_user</span>
                <div className="font-bold text-sm">Secure Checkout</div>
              </div>
              <div className="bg-blue-600/50 border border-blue-400/30 p-5 rounded-xl w-full backdrop-blur-sm">
                <span className="material-symbols-outlined text-2xl mb-2">local_shipping</span>
                <div className="font-bold text-sm">Global Delivery</div>
              </div>
            </div>
          </div>
          
          <div className="text-blue-200 text-sm relative z-10">
            © 2024 Velocity Premium Retail.
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex flex-col">
          {/* Desktop Header Links */}
          <div className="hidden lg:flex justify-end items-center gap-8 p-8 text-sm font-medium text-slate-600">
            <Link to="/products" className="hover:text-slate-900">Catalog</Link>
            <Link to="/products" className="hover:text-slate-900">Deals</Link>
            <a href="#" className="hover:text-slate-900">About</a>
            <span className="material-symbols-outlined text-[20px] cursor-pointer hover:text-slate-900 transition-colors">language</span>
            <span className="material-symbols-outlined text-[20px] cursor-pointer hover:text-slate-900 transition-colors">help_outline</span>
          </div>

          <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-[460px]">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
                <p className="text-slate-500 mt-2 text-sm">Fill in your details to get started with Velocity.Shop.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">person</span>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-200 focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] outline-none transition-all text-sm bg-slate-50/50"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">mail</span>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-200 focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] outline-none transition-all text-sm bg-slate-50/50"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">lock</span>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-200 focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] outline-none transition-all text-sm tracking-widest bg-slate-50/50"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">lock_reset</span>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-200 focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] outline-none transition-all text-sm tracking-widest bg-slate-50/50"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end mb-2">
                   <button 
                     type="button" 
                     onClick={() => setShowPassword(!showPassword)}
                     className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 transition-colors"
                   >
                     <span className="material-symbols-outlined text-[16px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                     {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                   </button>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <input 
                    type="checkbox" 
                    id="terms"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]" 
                  />
                  <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer leading-relaxed">
                    I agree to the <a href="#" className="text-[#0D47A1] font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-[#0D47A1] font-bold hover:underline">Privacy Policy</a>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0D47A1] hover:bg-[#1565C0] text-white py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-70 mt-6 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                  {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-slate-600">
                Already have an account? <Link to="/login" className="text-[#0D47A1] font-bold hover:underline">Login here</Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Only visible on mobile/tablet (Desktop uses left side) */}
      <footer className="lg:hidden px-8 py-6 border-t border-slate-200 bg-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-500 text-center md:text-left">
          <span className="font-bold text-slate-900 mr-2">Velocity.Shop</span>
          © 2024 Velocity Premium Retail.
        </div>
      </footer>
    </div>
  );
}