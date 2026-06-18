import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../../components/layouts/MainLayout";
import { getProducts } from "../../services/productService";
import { addToCart } from "../../services/cartService";
import type { Product } from "../../types/product";
import { getCategories } from "../../services/categoryService";
import type { Category } from "../../types/category";

const DUMMY_PRODUCTS = [
  {
    id: "dummy-1",
    name: "A4tech Bloody Gaming Headphone",
    description:
      "Feature-Packed Wireless Headset Engineered For Professional Gamers and Audiophiles.",
    price: 3200,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD4Q59owZeaveUtV2Gb4kCZ4I0SUF9OyoMk5tf7HWfOaln16Dw6UVdHxRzfyqgJYrzUCUGnkkzCewUqqsmQSf392pjBVUgVNqfKgDFQ_s6XGtIR5Q50Zw6Tvw0u-JNI2yrKBkr82vAHWgwY1de1Ukx-2H3gocukLWdqAE6L0wWhPGrJThTCMgBdzBK7Ec5fkPcYlbQcw5EbRaepo9uHdqzBgthi-25TnHeO_7uJb5_7LXYUKQb52W3WKRLTjKy7MkJSMtbwEiojoss",
    tag: "New Arrivals",
  },
  {
    id: "dummy-2",
    name: "NPT 200W Pure Sine Wave UPS",
    description: "Reliable power backup.",
    price: 4500,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_BLKwWhIHvZ5RW54B9vSdHfpRQ9xV2gp03YK0h5aWvEPVtyj66yU3Bcz7XhG2VTELCiosIxjoBamFi5v7WsMuEyh34EUP8Jrhve1L_rEE7uax-I4X5Q1LvDIdO1n4irPJgji87b32xcLhhWhmJNFrOt7J_cakSfMeFF_NtiY1f8itvL1Zac9ylRMasH-eEfkIUfw22y30SJvznH7uTFcLo58gxYkN7n98C239oY_0nqN2_in6VvCVkPxh2tG-dO_SXzyWpIDPVfo",
    tag: "-40% OFF",
    tagColor: "text-error",
  },
  {
    id: "dummy-3",
    name: "TP-Link Archer AX53 WiFi 6 Router",
    description: "Next gen wifi speed.",
    price: 3100,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuALveJzTet6556aUV1sVVEmFcbuIkpjPzOnpBWNZC8EQes2yA7FauDQOFnx6xnnbZ27Qj9Smb1eMMhO6Ph9cY5RCGglZWmtHPpArcN3q1NOtPRKQKaNtrzM_Pw3Et2c-9a4fg6vk7XEokKoajBrCRZxYWf_r-YAjAuaIvxA0fkdkD6TLXS-vgj-YVaiwyb0ReYg12c1pz1Veq40yJmEwV1dVhOF-4WmAzscZwXgFX25zjVhsckI9WDh4cPDeR_f8CKWeJzFKxKA4po",
    tag: "Gigabit Series",
    tagColor: "text-primary",
  },
  {
    id: "dummy-4",
    name: "Gigabyte AI TOP 100 Z890 Core Ultra",
    description: "",
    price: 108000,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBYUeouXNqH3uTGw1Umu2TBX8bWO7kwy5wO_0amxvWoWVyE1q9JN33_p9_a4nD_EVR1pIGjPL8OUHHo28cYKvybj5hUgXOUuZWirnhkN9rBWHbdv2R6ftdK3DWZ5kvxY3upl1RI_YlYIsfXTryBjRNlS8qFGbfdMQUT9CW5s2GoZA9a2ilBXkE9bU-C_DZoie1q20YvPU14ylRIZ57Xq5jGulG3DLa_3t4A9EAIw_-KwN4nLBkE_8YFuxNG9bkY-f2BEcAYCmmIclU",
    badges: [
      { text: "NEW", color: "bg-primary-container" },
      { text: "3% Installment", color: "bg-tertiary-container" },
    ],
    rating: 5,
    tag: "Best Selling",
  },
  {
    id: "dummy-5",
    name: "MacBook Air M4 Chip 13-inch (10-Core CPU)",
    description: "",
    price: 120500,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCkKzOHpzA_dC0yzGibE4fyq1iDeAPf6px10kRAwhiHxENkdWdKnnSe1sRJVkXAi09t3apFecQQAAEMVM5V3XvMuGCpNypkQGkZ3FR6I31Gh34afy1QhvfIr0CjV-p9o_na5W_uNuYfXrW3n3GfI5w7P15uLLBja5CxF4G40k8cyDVh6rWD8Z0a-yj-2uNiUati2P8LtBhkwLqZ4sxw2gUDf07OCaVytIeM73EqYRmhTiMBf8mL4FpkT_k7JyF9U2_bf_deqUx9VI0",
    badges: [{ text: "5% Installment", color: "bg-tertiary-container" }],
    rating: 4.5,
    tag: "Top Rated",
  },
  {
    id: "dummy-6",
    name: 'BenQ GW2486TC 23.8" 100Hz IPS Monitor',
    description: "",
    price: 66000,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDm0xffHHpytxJu-_---GxU8j_AxPjZbS4vkOgpSg37sT7I6m1OlYTJS9tQ_u9C4bjUHDajIBCK10kddmbVELXvvW2NldNnQkTW10p6-FBnJM0B1jq7xVlS4XfGEyx33zL6LAvRS4eo2mbLBXkorUNzFsxm4Um0xhvvTp9AggAkdWcVqfAirRIipmUgOY2MOHioGUZ6Dj7yo0PmqQ9IiazoMMphTvcn3hxKTmWQpjso3iAuAMQvfLhC6KHCJpFD-2mDSUOyqWHBdgw",
    badges: [{ text: "0% Installment", color: "bg-tertiary-container" }],
    rating: 4,
    tag: "New Release",
  },
  {
    id: "dummy-7",
    name: "Sony ZV-1 20.1MP Vlogging 4K Digital Camera",
    description: "",
    price: 91000,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDCpm1-9Bw4DojkkOAUCsWQI6O90oMAK2zGhlku5tBc2rFODvXcN6O1zY40Qopz292aNego9dfxjx88zmgBHfVvhUZA-OuGH5JEK8Q_aEi8iOLTM0eIdSz3tXvi0dRBgE8Xr8dyd_b-fw5PGo_8O00zVXXer3mC9R_WjYPOBrO-nuGVlcrW4lcEGzSE6PLkMVUx-QHS05RL2aWzLST_d5d9BYutxNEg_X4Na1WtdYZDeJlqu5LTfBCw-EAl-M3DCt8z563U07mTPlU",
    badges: [{ text: "10% Installment", color: "bg-tertiary-container" }],
    rating: 5,
    tag: "Best Seller",
  },
  {
    id: "dummy-8",
    name: "GIGABYTE AORUS AGC31 Gaming Chair",
    description: "",
    price: 49800,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuADbWF7jZ9HJgK1Oyr-W4CHKjrwgJy7A5eLZZQa4Dgi15r1UXGbLMIeoxTJoFqO52R5f6K-kNPH6rRDLrL5oEgYKlCE6tzA5YwTpmsaQQSmnxaPhrU3Qv3DOBmILNw8w9oEPXFFwQtffzOg924M0bUgkbTGQuvE0H6cc2gYCY5rMTeBiiTLXIfz2ozLl5ECcMyvNNaIMVENZbxbb1lP_zcjaxva4lcjXM_KUgQ022JW4KE-tHWXDHgWDPTf1in2w3U-EqX-1Gr4bzA",
    badges: [{ text: "0% Installment", color: "bg-tertiary-container" }],
    rating: 4.5,
    tag: "Hot Items",
  },
  {
    id: "dummy-9",
    name: "Samsung W26",
    description: "",
    price: 149000,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQ5SVLSkxuCpRJD8YY-v16wgwDpXTD801CcnQZCXiiztaUw8jlFNY7elQ58JR8kbtA2njZmFtVam8xFGa8MEKqtmcEMYRPeebmCf-dCYr2LLlpCotf0OQBItx3E_gC-4AEJHly6t1UpSRGbNXs463TUNc5U-Io1flNmzmACXtZ3tbooqpiKf7t-NZtVYdG3-PYnFNYNfJPxlTJkqLtLPpr-oopxDggTkU-LqwCErodfPPgPqk8I7DFzOf7zSUJcXlnAf0hf9foeqk",
    rating: 5,
    badges: [],
    tag: "",
  },
  {
    id: "dummy-10",
    name: "Samsung Galaxy F70e",
    description: "",
    price: 53900,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBDx_blZA47nQK927BD9KYyLTMLG_wmrJX4D1tKCQBRl_xC0tCZoBvV9jRkdCARSfppM3ls6LowHcHBcgknRki_ab-AdI2u8mXO5CUIGwR5G_mLhBy6NWaT_gZL3VRbb4R_Fdi8mJiqikBjYEKDHy-l9vWbOH9ftUcofsNEuHJSnhAIMD-1AgYGh_VSxjwA5ubFif7lSJcZdFGsnzJcLqJFd_sJ84gUjTrTMD_7vgEsb2_fTEJxvMA39HjuR3fYFj7OXiA4SrURlhU",
    rating: 4.5,
    badges: [],
    tag: "",
  },
  {
    id: "dummy-11",
    name: "Apple iPhone 17 Pro MAX",
    description: "",
    price: 165900,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBOyHxsD-rMTsZVZ4tH_LhMqY8S6nV-Fu5G9kegpl83FrwH3tacCT8NLUqs8TcyUgqtTBSN3SmdUp8zkr1VObZrcKDdGVOCBll-KNz2aA3iYFOLt-3BbzBaObSe3seRszUds1tlONKDn0STBCyGMM1sPDOMQivlO56R4nJODi0MUP-JjBto9M4ZmzW_ZlByCEtz84HznusY4OWOzX9fMz0e3s1Gfm0DIhJnQ6CbqG6FYFr2zEI2BIx0nagsQhUPZy5SvWPOhodcsyc",
    rating: 5,
    badges: [],
    tag: "",
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);

    getCategories().then(setCategories).catch(console.error);
  }, []);

  // Merge real products with dummy placeholders
  const merged = Array.from({ length: 11 }).map((_, i) => {
    if (products[i]) {
      return {
        ...DUMMY_PRODUCTS[i],
        id: products[i].id.toString(),
        name: products[i].name,
        description: products[i].description || DUMMY_PRODUCTS[i].description,
        price: products[i].price,
        imageUrl: products[i].imageUrl,
        isReal: true,
        originalId: products[i].id,
      };
    }
    return { ...DUMMY_PRODUCTS[i], isReal: false };
  });

  const heroItem = merged.find((x: any) => x.originalId === 2005) ?? merged[0];

  const secondary1 =
    merged.find((x: any) => x.originalId === 2006) ?? merged[1];

  const secondary2 =
    merged.find((x: any) => x.originalId === 2007) ?? merged[2];
  const bestSellers = merged.slice(3, 8);
  const cellphones = merged.slice(8, 11);

  // Helper to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} className="material-symbols-outlined text-[14px]">
            star
          </span>,
        );
      } else if (i - 0.5 === rating) {
        stars.push(
          <span key={i} className="material-symbols-outlined text-[14px]">
            star_half
          </span>,
        );
      } else {
        stars.push(
          <span key={i} className="material-symbols-outlined text-[14px]">
            star_outline
          </span>,
        );
      }
    }
    return stars;
  };

  const getProductLink = (item: any) =>
    item.isReal ? `/products/${item.originalId}` : `/products`;

  async function handleQuickAdd(item: any, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!item.isReal) {
      toast.error(
        "This is a demo placeholder. Go to Admin to add real products.",
      );
      return;
    }

    try {
      await addToCart(item.originalId, 1);
      toast.success(`${item.name} added to cart!`);
    } catch {
      toast.error("Please login to add to cart");
    }
  }

  return (
    <MainLayout>
      <div className="max-w-[1280px] mx-auto px-6 py-8 space-y-12 w-full">
        {/* Hero Section & SideNav */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:min-h-[520px]">
          {/* Side Navigation */}
          <aside className="hidden lg:flex lg:col-span-3 bg-surface-container rounded-xl overflow-hidden shadow-md flex-col">
            <div className="bg-primary p-4 text-on-primary">
              <h2 className="font-headline-sm text-headline-sm flex items-center gap-3">
                <span className="material-symbols-outlined">menu</span>
                All Categories
              </h2>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1 hide-scrollbar">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-primary-container/10 hover:text-primary transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]">
                      {category.iconName || "category"}
                    </span>

                    <span className="font-label-md text-label-md">
                      {category.name}
                    </span>
                  </div>

                  <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">
                    chevron_right
                  </span>
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Carousel Content */}
          <div className="lg:col-span-9 flex flex-col gap-6">
            {/* Large Hero */}
            <div className="relative flex-1 bg-surface-container-high rounded-2xl overflow-hidden group">
              <div className="relative h-full flex items-center p-12">
                <div className="max-w-xs md:max-w-sm space-y-6 z-10 relative">
                  <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-micro-tag font-micro-tag uppercase tracking-widest">
                    {heroItem.tag}
                  </span>
                  <h1 className="font-display-lg text-display-lg text-on-surface leading-tight drop-shadow-lg">
                    {heroItem.name}
                  </h1>
                  <p className="text-body-lg text-on-surface-variant drop-shadow-md">
                    {heroItem.description}
                  </p>
                  <Link
                    to={getProductLink(heroItem)}
                    className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold text-sm no-underline hover:scale-105 hover:shadow-lg transition-all"
                  >
                    Buy Now
                  </Link>
                </div>
                <div className="absolute right-12 top-1/2 -translate-y-1/2 w-1/2 flex justify-center pointer-events-none">
                  <img
                    alt={heroItem.name}
                    className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-700 drop-shadow-2xl max-h-[350px]"
                    src={heroItem.imageUrl}
                  />
                </div>
              </div>
            </div>

            {/* Secondary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-48">
              {[secondary1, secondary2].map((item, idx) => (
                <Link
                  key={item.id || idx}
                  to={getProductLink(item)}
                  className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant flex items-center gap-4 group cursor-pointer hover:shadow-md transition-shadow no-underline"
                >
                  <div className="flex-1">
                    <span
                      className={`${item.tagColor} font-micro-tag text-micro-tag`}
                    >
                      {item.tag}
                    </span>
                    <h3 className="font-headline-sm text-headline-sm mt-1">
                      {item.name}
                    </h3>
                    <span
                      className="text-primary font-label-md text-label-md hover:underline inline-block mt-2"
                    >
                      Shop Now
                    </span>
                  </div>
                  <img
                    alt={item.name}
                    className="w-24 h-24 object-contain group-hover:scale-110 transition-transform"
                    src={item.imageUrl}
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Side Promo Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 bg-surface-container rounded-2xl p-8 flex flex-col justify-between group overflow-hidden relative">
            <div>
              <h3 className="font-headline-sm text-headline-md leading-tight">
                Oraimo Watch 5 Smart Watch
              </h3>
              <p className="text-on-surface-variant font-label-md mt-2">
                Health tracking simplified.
              </p>
            </div>
            <div className="mt-4">
              <Link
                to="/products"
                className="inline-block bg-primary text-on-primary px-6 py-2 rounded-full font-label-md text-label-md hover:scale-105 transition-transform"
              >
                Buy Now
              </Link>
            </div>
            <img
              alt="Smart Watch"
              className="absolute -bottom-4 -right-4 w-40 h-40 object-contain group-hover:rotate-12 transition-transform"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGK3Eg0AW59rMk0F_279srxXAii68k4hiWB7lPb6AgOUkt4Uri-5NfUy0Dd-PqjanmpWJWrFn69s6K3MGHRsnCxz16EP5GIZjG1iRXz-6UubHtx5ATNM_ZIrqHv45Hrm6P-9w742bEICYFknJkYufnmt9irGpUkXe8cukIS1xmJqwI4bx1xbT_SRcVZ6GMSS4crv9Qc1moLel0PBkxBMn0IVL24I_9VfJ0fBOdt12_gwQlxKcreF9EqnAGadQapI3ejff7ESGJ8_0"
            />
          </div>
          <div className="md:col-span-8 bg-inverse-surface text-inverse-on-surface rounded-2xl p-8 flex items-center justify-between group relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <h3 className="font-display-lg text-headline-lg">
                Canon EOS R50 Mirrorless Camera
              </h3>
              <p className="text-inverse-on-surface/80">
                Unleash your creativity with 4K clarity.
              </p>
              <div className="text-primary-fixed-dim font-price-lg text-price-lg">
                From ₹75000
              </div>
              <Link
                to="/products"
                className="inline-block text-primary-fixed-dim border border-primary-fixed-dim px-6 py-2 rounded-full font-label-md text-label-md hover:bg-primary-fixed-dim hover:text-on-primary transition-all"
              >
                Explore
              </Link>
            </div>
            <img
              alt="Canon Camera"
              className="w-48 h-48 md:w-64 md:h-64 object-contain group-hover:scale-110 transition-transform duration-500 relative z-10"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8u0aL-tFkpinwJcX9cPlfzn6Qstb1Hm1RsThfvMs07BS8Wf6HBnTsPK4wAwgnfjv0A4GW7N-K_TaIVhtbQQras7Q4TB39469WcOfID1koGmtR4bg8Pk1eh86Ot1KomxlGeGIQQelEZdRDcP16xZFox9SxCUXnoQ3q8147-HA95pTah1PSvaXkD_POXMw95LqUYooFN6sBzRQ-7Y1Ol-3FMDLnZZAKCbep-eYik3S4I3kJDrf_087VS50ZeOMUFrxwDo1x1wf4M70"
            />
          </div>
        </section>

        {/* Brand Scroller */}
        <section className="py-8 border-y border-outline-variant">
          <div className="flex items-center gap-12 overflow-x-auto hide-scrollbar whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity">
            <span className="font-headline-sm font-black text-on-surface-variant">
              Panasonic
            </span>
            <span className="font-headline-sm font-black text-primary">
              DELL
            </span>
            <span className="font-headline-sm font-black text-on-surface-variant">
              MSI
            </span>
            <span className="font-headline-sm font-black text-primary">HP</span>
            <span className="font-headline-sm font-black text-on-surface-variant">
              Acer
            </span>
            <span className="font-headline-sm font-black text-primary">
              TP-Link
            </span>
            <span className="font-headline-sm font-black text-on-surface-variant">
              Lenovo
            </span>
            <span className="font-headline-sm font-black text-primary">
              Apple
            </span>
            <span className="font-headline-sm font-black text-on-surface-variant">
              Samsung
            </span>
            <span className="font-headline-sm font-black text-primary">
              Intel
            </span>
          </div>
        </section>

        {/* Best Sellers */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-headline-lg text-headline-lg">Best Seller</h2>
              <p className="text-on-surface-variant">
                Top performing gadgets this month.
              </p>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
              <button className="bg-primary text-on-primary px-5 py-2 rounded-full font-label-md text-label-md whitespace-nowrap">
                Top 20
              </button>
              <button className="bg-surface-container-low text-on-surface-variant px-5 py-2 rounded-full font-label-md text-label-md hover:bg-surface-container transition-colors whitespace-nowrap">
                PC Gaming
              </button>
              <button className="bg-surface-container-low text-on-surface-variant px-5 py-2 rounded-full font-label-md text-label-md hover:bg-surface-container transition-colors whitespace-nowrap">
                Computers
              </button>
              <button className="bg-surface-container-low text-on-surface-variant px-5 py-2 rounded-full font-label-md text-label-md hover:bg-surface-container transition-colors whitespace-nowrap">
                Cameras
              </button>
              <button className="bg-surface-container-low text-on-surface-variant px-5 py-2 rounded-full font-label-md text-label-md hover:bg-surface-container transition-colors whitespace-nowrap">
                Gadgets
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {bestSellers.map((item) => (
              <Link
                key={item.id}
                to={getProductLink(item)}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 group hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full relative no-underline text-inherit"
              >
                <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                  {item.badges?.map((badge: any, i: number) => (
                    <span
                      key={i}
                      className={`${badge.color} text-white px-2 py-0.5 rounded text-micro-tag font-micro-tag`}
                    >
                      {badge.text}
                    </span>
                  ))}
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  className="absolute top-3 right-3 text-on-surface-variant hover:text-error transition-colors z-10"
                >
                  <span className="material-symbols-outlined">favorite</span>
                </button>
                <div className="bg-surface-container-low rounded-lg overflow-hidden mb-4 h-48 flex items-center justify-center p-4">
                  <img
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    src={item.imageUrl}
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <span className="text-primary font-micro-tag text-micro-tag uppercase">
                    {item.tag}
                  </span>
                  <span
                    className="block font-label-md text-label-md font-bold text-on-surface line-clamp-2 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </span>
                  <div className="flex items-center gap-1 text-tertiary-fixed-dim">
                    {renderStars(item.rating ?? 0)}
                  </div>
                  <div className="font-price-lg text-price-lg text-primary">
                    ₹{item.price.toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={(e) => handleQuickAdd(item, e)}
                  className="mt-4 w-full bg-surface-container text-primary font-label-md text-label-md py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-on-primary"
                >
                  Quick Add
                </button>
              </Link>
            ))}
          </div>
        </section>

        {/* Wide Promo Banner */}
        <section className="relative h-[240px] rounded-3xl overflow-hidden group">
          <div className="absolute inset-0 bg-primary/20 z-0 group-hover:scale-105 transition-transform duration-700"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center p-12 z-10">
            <div className="max-w-xl text-white space-y-4">
              <span className="text-primary-fixed uppercase font-micro-tag tracking-widest">
                Pre Order
              </span>
              <h2 className="font-display-lg text-headline-lg lg:text-display-lg leading-tight">
                Apple Watch Sport Series 8
              </h2>
              <p className="text-surface-variant font-body-lg">
                A healthy leap ahead. Experience the future of health tracking.
              </p>
              <Link
                to="/products"
                className="inline-block bg-on-background text-on-surface px-8 py-3 rounded-full font-label-md text-label-md hover:scale-105 active:scale-95 transition-all"
              >
                Discover Now
              </Link>
            </div>
          </div>
        </section>

        {/* Top Cellphones & Tablets */}
        <section className="space-y-8">
          <div className="flex items-end justify-between border-b border-outline-variant pb-4">
            <h2 className="font-headline-lg text-headline-lg">
              Top Cellphones & Tablets
            </h2>
            <Link
              to="/products"
              className="text-primary font-label-md hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Banner */}
            <div className="lg:col-span-4 bg-surface-container-high rounded-2xl p-8 flex flex-col justify-between group overflow-hidden relative">
              <div className="space-y-4 relative z-10">
                <h3 className="font-headline-md text-headline-md">
                  REDMI NOTE 12 PRO+ 5G
                </h3>
                <p className="text-on-surface-variant">
                  Rise to the challenge with ultra-fast charging.
                </p>
                <Link
                  to="/products"
                  className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm no-underline hover:scale-105 transition-transform"
                >
                  Shop Now
                </Link>
              </div>
              <img
                alt="Redmi Note"
                className="mt-8 transform group-hover:scale-105 group-hover:rotate-3 transition-transform duration-700 relative z-10"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp70JiKzEe2kA9aQLo0EYNY0dGPLnnnIZqVsiYrEnpE96HS777kkOj9-v9FZzWRb7hiPdipgD-jGjztxUkiIYAxAPsy10PkEjmc9uQIBUD2HaZ96k8-Ps-bvMfugKpQuMep6zVCw0uZ-cLlNxrfPC3COaazjnN8j8ADFPNMClG-r3RhCSwvr9_JvuvgW25zvoG9sPNviJncVhV-x0_jviS_Uvsbe6_CGeKLfH5TumAWhm-UaB1gqheXT8m5c_IuNySVot9Fyz5I84"
              />
            </div>

            {/* Brand Grid & Product Cards */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.slice(0, 4).map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.id}`}
                    className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center gap-3 cursor-pointer hover:border-primary transition-all group no-underline text-inherit"
                  >
                    <span className="material-symbols-outlined text-[24px] text-primary group-hover:scale-110 transition-transform">
                      {cat.iconName || "category"}
                    </span>
                    <div>
                      <div className="font-label-md text-label-md font-bold">
                        {cat.name}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {cellphones.map((item) => (
                  <Link
                    key={item.id}
                    to={getProductLink(item)}
                    className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant group hover:shadow-lg transition-all text-center flex flex-col h-full no-underline text-inherit"
                  >
                    <img
                      alt={item.name}
                      className="w-24 h-32 object-contain mx-auto mb-4 group-hover:scale-110 transition-transform"
                      src={item.imageUrl}
                    />
                    <span
                      className="font-label-md text-label-md font-bold hover:text-primary transition-colors flex-1"
                    >
                      {item.name}
                    </span>
                    <div className="flex items-center justify-center gap-1 text-tertiary-fixed-dim my-1">
                      {renderStars(item.rating ?? 0)}
                    </div>
                    <div className="font-price-lg text-price-lg text-primary">
                      ₹{item.price.toLocaleString()}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
