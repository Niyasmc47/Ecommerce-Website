import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await login({ email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("name", response.data.name);
      toast.success("Login successful");
      navigate("/");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between bg-white border-b border-slate-200">
        <Link
          to="/"
          className="text-xl font-black text-[#0D47A1] tracking-tight"
        >
          Velocity.Shop
        </Link>
        <div className="flex items-center gap-4 text-slate-500">
          <span className="material-symbols-outlined cursor-pointer hover:text-slate-800 transition-colors">
            language
          </span>
          <span className="material-symbols-outlined cursor-pointer hover:text-slate-800 transition-colors">
            help_outline
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-3xl -z-10"></div>

        <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-slate-500 mt-2 text-sm">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">
                  mail
                </span>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-200 focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] outline-none transition-all text-sm bg-slate-50/50"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#0D47A1] font-medium hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 rounded-lg border border-slate-200 focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] outline-none transition-all text-sm tracking-widest bg-slate-50/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]"
              />
              <label
                htmlFor="remember"
                className="text-sm text-slate-600 cursor-pointer"
              >
                Remember this device
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0D47A1] hover:bg-[#1565C0] text-white py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-70 mt-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
            >
              {loading ? "Logging In..." : "Log In"}
              {!loading && (
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#0D47A1] font-bold hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-slate-200 bg-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-500">
          <span className="font-bold text-slate-900 mr-2">Velocity.Shop</span>©
          2024 Velocity Premium Retail. Secure Encryption Enabled.
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-600 font-medium">
          <a
            href="#"
            className="hover:text-slate-900 underline decoration-slate-300 underline-offset-4"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="hover:text-slate-900 underline decoration-slate-300 underline-offset-4"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="hover:text-slate-900 underline decoration-slate-300 underline-offset-4"
          >
            Security Standards
          </a>
          <a
            href="#"
            className="hover:text-slate-900 underline decoration-slate-300 underline-offset-4"
          >
            Contact Support
          </a>
        </div>
      </footer>
    </div>
  );
}
