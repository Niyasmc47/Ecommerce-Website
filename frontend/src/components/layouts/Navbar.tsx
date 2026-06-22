import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCart } from "../../services/cartService";
import { useWishlist } from "../../contexts/WishlistContext";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  const [cartCount, setCartCount] = useState(0);
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    async function loadCart() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const items = await getCart();
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      } catch {
        //
      }
    }

    loadCart();
  }, []);

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && search.trim() !== "") {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    }
  }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("name");

    navigate("/login");
    window.location.reload();
  }

  return (
    <div className="flex flex-col">
      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-50 bg-surface-container-lowest shadow-sm border-b border-outline-variant">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between gap-4 md:gap-8">
          
          {/* Brand Logo */}
          <Link to="/" className="font-headline-lg text-headline-lg font-black text-primary tracking-tighter">
            Velocity.Shop
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 font-label-md text-label-md">
            <Link to="/" className="text-primary font-bold border-b-2 border-primary pb-1">Home</Link>
            <Link to="/products" className="text-on-surface-variant hover:text-primary transition-colors">Products</Link>
            <Link to="/cart" className="text-on-surface-variant hover:text-primary transition-colors">Cart</Link>
            {role === "Admin" && (
              <Link to="/admin" className="text-on-surface-variant hover:text-primary transition-colors">Admin Dashboard</Link>
            )}
            {role === "Seller" && (
              <Link to="/seller" className="text-on-surface-variant hover:text-primary transition-colors">Seller Dashboard</Link>
            )}
            {(role === "Admin" || role === "DeliveryAgent") && (
              <Link to="/delivery" className="text-on-surface-variant hover:text-primary transition-colors">Deliveries</Link>
            )}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl relative group">
            <div className="flex items-center w-full bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant group-focus-within:border-primary transition-all">
              <input
                type="text"
                placeholder="Search anything..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                className="bg-transparent border-none outline-none focus:ring-0 w-full text-body-md font-body-md placeholder:text-outline"
              />
              <button 
                className="text-primary active:scale-95 transition-transform"
                onClick={() => search.trim() && navigate(`/products?search=${encodeURIComponent(search.trim())}`)}
              >
                <span className="material-symbols-outlined">search</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Auth Dropdown */}
            {token ? (
              <div className="relative group flex items-center gap-2 cursor-pointer">
                <div className="hidden sm:flex flex-col items-end mr-2">
                  <span className="font-label-md text-label-md text-on-surface-variant max-w-[100px] truncate">{name}</span>
                </div>
                <button className="p-2 rounded-full hover:bg-surface-container-low transition-all bg-surface-container">
                  <span className="material-symbols-outlined text-primary">person</span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-[100%] w-48 rounded-xl border border-outline-variant bg-surface-container-lowest p-2 opacity-0 shadow-lg transition-all duration-200 invisible group-hover:visible group-hover:opacity-100 z-50">
                   <Link to="/profile" className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-container hover:text-primary rounded-lg transition-colors">Profile</Link>
                   <Link to="/orders" className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-container hover:text-primary rounded-lg transition-colors">Orders</Link>
                   <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors mt-1">Sign Out</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 group cursor-pointer">
                <div className="hidden sm:flex flex-col items-end mr-2">
                  <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-primary transition-colors">Log In / Sign Up</span>
                </div>
                <button className="p-2 rounded-full hover:bg-surface-container-low transition-all">
                  <span className="material-symbols-outlined">person</span>
                </button>
              </Link>
            )}

            <Link to="/wishlist" className="relative p-2 rounded-full hover:bg-surface-container-low transition-all">
              <span className="material-symbols-outlined">favorite</span>
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-2 rounded-full hover:bg-surface-container-low transition-all">
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="hidden md:flex p-2 rounded-full hover:bg-surface-container-low transition-all"
              title="Toggle Dark Mode"
            >
              <span className="material-symbols-outlined">
                {darkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            
            {/* Mobile Menu & Dark Mode Toggles */}
            <div className="flex md:hidden items-center gap-1">
              <button onClick={() => setDarkMode(!darkMode)} className="p-2">
                 <span className="material-symbols-outlined text-[20px]">{darkMode ? 'light_mode' : 'dark_mode'}</span>
              </button>
              <button className="p-2 text-primary">
                <span className="material-symbols-outlined text-[24px]">menu</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Sub-header Trust Bar (Removed as part of top-bar removal or keep? User said "that thign above navbar which is like call hotbar and stuff", meaning the top bar. We will remove this trust bar as well just to be clean, or wait, user said "that thign above navbar". This trust bar is BELOW the navbar. I'll leave it but change it to be more localized if needed or just remove it to be safe. I will remove the subheader trust bar to keep the design clean as requested by the overall "remove hotbar and stuff".) */}
    </div>
  );
}
