import { useEffect, useState } from "react";

import { getCategories } from "../../services/categoryService";

import type { Category } from "../../types/category";

import { uploadImage } from "../../services/uploadService";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: number;
}

interface Props {
  initialData?: ProductFormData;

  onSubmit: (data: ProductFormData) => void;

  submitText: string;
}

export default function ProductForm({
  initialData,
  onSubmit,
  submitText,
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState<ProductFormData>(
    initialData ?? {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      imageUrl: "",
      categoryId: 1,
    },
  );

  useEffect(() => {
    async function load() {
      const data = await getCategories();

      setCategories(data);
    }

    load();
  }, []);

  function updateField(field: keyof ProductFormData, value: string | number) {
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
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();

        onSubmit(form);
      }}
    >
      <input
        className="w-full rounded-xl border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        placeholder="Product Name"
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
      />

      <textarea
        className="w-full rounded-xl border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        placeholder="Description"
        value={form.description}
        onChange={(e) => updateField("description", e.target.value)}
      />

      <input
        type="number"
        className="w-full rounded-xl border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        placeholder="Price"
        value={form.price}
        onChange={(e) => updateField("price", Number(e.target.value))}
      />

      <input
        type="number"
        className="w-full rounded-xl border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        placeholder="Stock"
        value={form.stock}
        onChange={(e) => updateField("stock", Number(e.target.value))}
      />

      <input
        type="file"
        accept="image/*"
        className="
    w-full
    rounded-xl
    border
    border-slate-200
    p-4

    dark:border-slate-700
    dark:bg-slate-950
    dark:text-white
  "
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            handleImageUpload(file);
          }
        }}
      />

      {uploading && <p>Uploading image...</p>}

      {form.imageUrl && (
        <img
          src={form.imageUrl}
          alt="Preview"
          className="
      h-40
      rounded-xl
      border
      object-cover

      border-slate-200
      dark:border-slate-700
    "
        />
      )}

      <select
        className="w-full rounded-xl border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        value={form.categoryId}
        onChange={(e) => updateField("categoryId", Number(e.target.value))}
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="
          w-full
          rounded-xl
          bg-blue-600
          py-4
          text-white
        "
      >
        {submitText}
      </button>
    </form>
  );
}
