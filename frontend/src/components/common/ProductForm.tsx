import { useEffect, useState } from "react";
import { getCategories } from "../../services/categoryService";
import type { Category } from "../../types/category";
import { uploadImage } from "../../services/uploadService";
import { BsUpload, BsImage } from "react-icons/bs";

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: number;

  compareAtPrice?: number;
  installmentPlan?: string;
  images?: string[];
  brand?: string;
  isActive?: boolean;
  sku?: string;
  trackQuantity?: boolean;
  continueSellingWhenOutOfStock?: boolean;
  urlHandle?: string;
  metaDescription?: string;
  productType?: string;
  vendor?: string;
  tags?: string[];
  variants?: string;
  specifications?: string;
  features?: string[];
}

interface Props {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  submitText: string;
}

function parseVariantsToJSON(text: string): string {
  if (!text.trim()) return "";
  try {
    // If they already entered valid JSON, just pass it through
    JSON.parse(text);
    return text;
  } catch {
    const lines = text.split('\n');
    const obj: Record<string, string[]> = {};
    for (const line of lines) {
      if (!line.includes(':')) continue;
      const [key, val] = line.split(':');
      if (key && val) {
        obj[key.trim()] = val.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    return JSON.stringify(obj);
  }
}

function parseVariantsFromJSON(json: string): string {
  if (!json) return "";
  try {
    const obj = JSON.parse(json);
    return Object.entries(obj).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n');
  } catch {
    return json;
  }
}

function parseSpecsToJSON(text: string): string {
  if (!text.trim()) return "";
  try {
    JSON.parse(text);
    return text;
  } catch {
    const lines = text.split('\n');
    const obj: Record<string, string> = {};
    for (const line of lines) {
      if (!line.includes(':')) continue;
      const [key, ...valParts] = line.split(':');
      if (key) {
        obj[key.trim()] = valParts.join(':').trim();
      }
    }
    return JSON.stringify(obj);
  }
}

function parseSpecsFromJSON(json: string): string {
  if (!json) return "";
  try {
    const obj = JSON.parse(json);
    return Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join('\n');
  } catch {
    return json;
  }
}

export default function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  submitText,
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState<ProductFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    imageUrl: initialData?.imageUrl || "",
    categoryId: initialData?.categoryId || 1,
    compareAtPrice: initialData?.compareAtPrice || undefined,
    brand: initialData?.brand || "",
    isActive: initialData?.isActive ?? true,
    sku: initialData?.sku || "",
    trackQuantity: initialData?.trackQuantity ?? true,
    continueSellingWhenOutOfStock: initialData?.continueSellingWhenOutOfStock ?? false,
    urlHandle: initialData?.urlHandle || "",
    metaDescription: initialData?.metaDescription || "",
    productType: initialData?.productType || "",
    vendor: initialData?.vendor || "",
    tags: initialData?.tags || [],
    variants: parseVariantsFromJSON(initialData?.variants || ""),
    specifications: parseSpecsFromJSON(initialData?.specifications || ""),
    images: initialData?.images || [],
  });

  useEffect(() => {
    async function load() {
      const data = await getCategories();
      setCategories(data);
    }
    load();
  }, []);

  function updateField<K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleImageUpload(file: File) {
    try {
      setUploading(true);
      const imageUrl = await uploadImage(file);
      updateField("imageUrl", imageUrl);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      className="text-foreground"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          ...form,
          variants: parseVariantsToJSON(form.variants || ""),
          specifications: parseSpecsToJSON(form.specifications || "")
        });
      }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
        <div>
          <h2 className="text-2xl font-bold font-sans tracking-tight">
            {initialData ? "Edit Product" : "Create New Listing"}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-bold rounded-lg border border-border bg-surface hover:bg-background transition-colors"
          >
            Discard
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-sm font-bold rounded-lg bg-primary text-white hover:bg-primary/90 transition-all shadow-md"
          >
            {submitText}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column (Main Info) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Basic Information */}
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">info</span> Basic Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Product Name</label>
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none"
                  placeholder="e.g. MacBook Air M2"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Description</label>
                <textarea
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none h-32 resize-none"
                  placeholder="Write a detailed product description..."
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Category</label>
                  <select
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none"
                    value={form.categoryId}
                    onChange={(e) => updateField("categoryId", Number(e.target.value))}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Brand</label>
                  <input
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none"
                    placeholder="e.g. Apple"
                    value={form.brand}
                    onChange={(e) => updateField("brand", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Media Gallery */}
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">image</span> Media Gallery
            </h3>
            <div className="relative group mb-4">
              <div className={`absolute inset-0 border-2 border-dashed rounded-xl transition-colors pointer-events-none ${uploading ? 'border-primary animate-pulse' : 'border-border group-hover:border-primary/50'}`}></div>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
              <div className="p-8 flex flex-col items-center justify-center text-center h-48 bg-background/50 rounded-xl">
                {uploading ? (
                  <>
                    <div className="h-8 w-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4"></div>
                    <p className="text-xs font-bold text-primary">Uploading Image...</p>
                  </>
                ) : (
                  <>
                    <BsUpload size={32} className="text-foreground/40 mb-4 group-hover:text-primary transition-colors" />
                    <p className="text-sm font-bold">Drag and drop product image here</p>
                    <p className="text-xs text-foreground/50 mt-1">Supports: JPG, PNG, WEBP (Max 5MB)</p>
                  </>
                )}
              </div>
            </div>
            {form.imageUrl && (
              <div className="flex gap-4">
                <div className="h-20 w-20 rounded-lg border border-primary bg-background overflow-hidden relative">
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="h-20 w-20 rounded-lg border border-dashed border-border bg-background flex items-center justify-center text-foreground/30 hover:border-primary/50 cursor-pointer">
                  <BsImage size={24} />
                </div>
              </div>
            )}
            <div className="mt-4">
              <label className="block text-xs font-bold mb-1">Direct Image URL (Fallback)</label>
              <input
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:ring-1 outline-none"
                placeholder="https://..."
                value={form.imageUrl}
                onChange={(e) => updateField("imageUrl", e.target.value)}
              />
            </div>
          </div>

          {/* Variants */}
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">layers</span> Variants
            </h3>
            <textarea
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none font-mono h-24"
              placeholder="Color: Space Gray, Silver&#10;Storage: 256GB, 512GB"
              value={form.variants}
              onChange={(e) => updateField("variants", e.target.value)}
            />
            <p className="text-[10px] text-foreground/50 mt-1">Format: OptionName: val1, val2</p>
          </div>

          {/* Technical Specifications */}
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">memory</span> Technical Specifications
            </h3>
            <textarea
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none font-mono h-24"
              placeholder="Chip: Apple M2 chip&#10;Memory: 8GB unified memory"
              value={form.specifications}
              onChange={(e) => updateField("specifications", e.target.value)}
            />
            <p className="text-[10px] text-foreground/50 mt-1">Format: SpecName: SpecValue</p>
          </div>

          {/* Features */}
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">check_circle</span> Key Features
            </h3>
            <textarea
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none font-mono h-24"
              placeholder="Next-generation CPU and GPU performance&#10;Up to 18 hours of battery life"
              value={form.features?.join('\n') || ""}
              onChange={(e) => updateField("features", e.target.value.split('\n').filter(Boolean))}
            />
            <p className="text-[10px] text-foreground/50 mt-1">One feature per line</p>
          </div>

          {/* Extra Images Gallery */}
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">collections</span> Extra Gallery Images
            </h3>
            <textarea
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none font-mono h-24"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              value={form.images?.join('\n') || ""}
              onChange={(e) => updateField("images", e.target.value.split('\n').filter(Boolean))}
            />
            <p className="text-[10px] text-foreground/50 mt-1">Paste image URLs, one per line.</p>
          </div>

        </div>

        {/* Right Column (Side Info) */}
        <div className="space-y-8">
          
          {/* Status */}
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-md font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">visibility</span> Status
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={form.isActive}
                  onChange={(e) => updateField("isActive", e.target.checked)}
                />
                <div className="w-9 h-5 bg-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                <span className="ml-2 text-xs font-bold">{form.isActive ? 'Active' : 'Draft'}</span>
              </label>
            </div>
            <p className="text-xs text-foreground/60 leading-relaxed">
              When active, this product will be visible in your online store and marketplace channels.
            </p>
          </div>

          {/* SEO
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-md font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">travel_explore</span> Search Engine Optimization
            </h3>
            <div>
              <label className="block text-xs font-bold mb-1">URL Handle</label>
              <div className="flex rounded-lg overflow-hidden border border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                <span className="bg-background px-3 py-2 text-xs text-foreground/50 border-r border-border">shop.io/</span>
                <input
                  className="w-full bg-background px-3 py-2 text-sm outline-none"
                  placeholder="macbook-air"
                  value={form.urlHandle}
                  onChange={(e) => updateField("urlHandle", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Meta Description</label>
              <textarea
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none resize-none h-20"
                placeholder="Brief summary for search engines..."
                value={form.metaDescription}
                onChange={(e) => updateField("metaDescription", e.target.value)}
              />
            </div>
          </div> */}

          {/* Pricing */}
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-md font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">payments</span> Pricing
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground/50">₹</span>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-border bg-background pl-8 pr-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none"
                    placeholder="0.00"
                    value={form.price}
                    onChange={(e) => updateField("price", Number(e.target.value))}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Compare at</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground/50">₹</span>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-border bg-background pl-8 pr-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none"
                    placeholder="0.00"
                    value={form.compareAtPrice || ""}
                    onChange={(e) => updateField("compareAtPrice", e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-md font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">inventory_2</span> Inventory Management
            </h3>
            {/* <div>
              <label className="block text-xs font-bold mb-1">SKU (Stock Keeping Unit)</label>
              <input
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none font-mono"
                placeholder="MAC-AIR-M2-MID-256"
                value={form.sku}
                onChange={(e) => updateField("sku", e.target.value)}
              />
            </div> */}
            <div>
              <label className="block text-xs font-bold mb-1">Stock Quantity</label>
              <input
                type="number"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none"
                placeholder="0"
                value={form.stock}
                onChange={(e) => updateField("stock", Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2 mt-4">
              <label className="flex items-center gap-2 text-xs">
                <input 
                  type="checkbox" 
                  className="rounded text-primary focus:ring-primary bg-background border-border"
                  checked={form.trackQuantity}
                  onChange={(e) => updateField("trackQuantity", e.target.checked)}
                />
                Track quantity
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input 
                  type="checkbox" 
                  className="rounded text-primary focus:ring-primary bg-background border-border"
                  checked={form.continueSellingWhenOutOfStock}
                  onChange={(e) => updateField("continueSellingWhenOutOfStock", e.target.checked)}
                />
                Continue selling when out of stock
              </label>
            </div>
          </div>

          {/* Organization
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-md font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">folder</span> Organization
            </h3>
            <div>
              <label className="block text-xs font-bold mb-1">Product Type</label>
              <input
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none"
                placeholder="e.g. Laptop"
                value={form.productType}
                onChange={(e) => updateField("productType", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Vendor</label>
              <input
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none"
                placeholder="Apple Inc."
                value={form.vendor}
                onChange={(e) => updateField("vendor", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Tags (Comma Separated)</label>
              <input
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none"
                placeholder="NEW, M2, Laptop"
                value={form.tags?.join(", ")}
                onChange={(e) => updateField("tags", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
              />
            </div>
          </div> */}

        </div>
      </div>
    </form>
  );
}
