import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-inverse-surface text-inverse-on-surface mt-20 pt-16 pb-8 border-t border-outline-variant">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="space-y-6">
          <Link to="/" className="font-headline-md text-headline-md font-black tracking-tighter text-white">
            Velocity.Shop
          </Link>
          <p className="text-on-surface-variant text-body-md">
            Leading tech e-commerce platform delivering high-performance gadgets and electronics worldwide. Your trusted partner in innovation.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center hover:bg-primary transition-colors text-inverse-surface hover:text-white">
              <span className="material-symbols-outlined text-[20px]">share</span>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center hover:bg-primary transition-colors text-inverse-surface hover:text-white">
              <span className="material-symbols-outlined text-[20px]">alternate_email</span>
            </a>
          </div>
        </div>

        {/* Useful Links */}
        <div className="space-y-6">
          <h4 className="font-headline-sm text-headline-sm text-white">Company</h4>
          <ul className="space-y-4 font-label-md text-label-md text-on-surface-variant">
            <li><Link to="#" className="hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary">About Us</Link></li>
            <li><Link to="#" className="hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary">Terms & Conditions</Link></li>
            <li><Link to="#" className="hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary">Privacy Policy</Link></li>
            <li><Link to="#" className="hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary">Help Center</Link></li>
            <li><Link to="#" className="hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary">Shipping Guide</Link></li>
          </ul>
        </div>

        {/* Shop Categories */}
        <div className="space-y-6">
          <h4 className="font-headline-sm text-headline-sm text-white">Department</h4>
          <ul className="space-y-4 font-label-md text-label-md text-on-surface-variant">
            <li><Link to="/products" className="hover:text-primary transition-colors">Computer & Laptop</Link></li>
            <li><Link to="/products" className="hover:text-primary transition-colors">Cell Phone & Tablets</Link></li>
            <li><Link to="/products" className="hover:text-primary transition-colors">Video Game & VR</Link></li>
            <li><Link to="/products" className="hover:text-primary transition-colors">Smart Watches</Link></li>
            <li><Link to="/products" className="hover:text-primary transition-colors">Networking Devices</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-6">
          <h4 className="font-headline-sm text-headline-sm text-white">Newsletter</h4>
          <p className="text-on-surface-variant text-label-md">Subscribe to get latest news and promotional offers.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Your email..." 
              className="bg-surface-variant/10 border-outline-variant rounded-lg px-4 py-2 w-full focus:ring-primary focus:border-primary text-white"
            />
            <button className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md hover:bg-primary-container transition-all">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 mt-16 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4 text-label-md text-on-surface-variant">
        <p>© 2026 Velocity.Shop eCommerce. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXnZ-hg5hfAoDB1cZmxTNk6kmPNWf5FY3Id1hKXGodtAJwdjpXfrCUax0BRTDXL1e5a9RpdQpjOy3Zca_uBLF_zYAx3wxgHY02wlSj1ec2Iq7qC65wYOEbTIzYvaz6OLlFNBL2x3FZ94jf41FwKusD6TXm0Lp_tyVIgmVyO4sMuLYu0tpPjHtlCA5iSRyxVNIs60_oEhQFIdMwN3tBu4TC6hf08v1TFWUQovx-cyMLzoMoUcKVxTtyGXo2UQhIFk5RhHPxNoOaUtM" alt="Visa" className="h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlQZAv0wkfHKmJWQe6-wP9_mV2hMIzKAuR_cO5EOpYEfM9GfZqnwOVvlD4eEbPDLYNQJvbskSSp0QxRIaNq1-fr1DHE50heekrUEskxfJpioRJHcIXMrKyfuGjhvyKNtYW37BV-intvdPiRY2KP_rrx8xR0VsLmcGjKIUw6qW6ZeVkCDBtyOj7dmXNa4EZtrkOcM6uaIXV2ahGy2FN49aRMOGZb2zCEWxWKq8gnFFFG0mER-wgy-cRfVTlj4gVtqSWPTSjUz52ZuY" alt="Mastercard" className="h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuChAs7VYq4dcGwpZGca8H-aqJh-3GmK8Jbr1RkeRkH9otgUwIiZy316H-xKMHM52DBb-Szm-BoWzF2qWMeGCsSabONuHeMqPOLKeAiashWlBodfvkno_QWPY4ZL7HTqHVQgtXjarqZrbeOK9QwlI_nCXUintsylSrAHbz2RT-74xiZlXj4acRsU-K9cjpDAX5CfquW1ceMIyZGhBcc81xeEDJmYeRVghcF9G4ex68IGziMXhNoaxEkTd79-yWMVVnmA9MSQUolUdHA" alt="Paypal" className="h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0qNEbIyvVL3OisDQBLMUQPEr37tpvPovzoqk-BuCwwopB02UJUl9c0zrwaBSLWTLvNJkaNd3WZ-jgzfQvp5sdu20xH2tVcBZb7W58N3SuE1F8l1LlEvzvitHm_ig_xNbzlJM6XSAFXv1-k6Tth0Qdrkrj_aQ9EBNpp5I2d5nl2Iq_gR_J2LdbX251kvL2a5Ug83C4tym5Sn_fry_adxYf4x0QSpyzD8YKaGfwH4Z5CoQq8Us19rMERqhB6FB5BQw9hKD4TqJxCQA" alt="Apple Pay" className="h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
        </div>
      </div>
    </footer>
  );
}
