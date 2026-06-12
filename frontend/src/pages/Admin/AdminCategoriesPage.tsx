import { useEffect, useState } from "react";

import AdminLayout from "../../components/layouts/AdminLayout";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";

import type { Category } from "../../types/category";

import toast from "react-hot-toast";

export default function AdminCategoriesPage() {

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [name, setName] =
    useState("");

  const [imageUrl, setImageUrl] =
    useState("");

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  useEffect(() => {

    loadCategories();

  }, []);

  async function loadCategories() {

    try {

      const data =
        await getCategories();

      setCategories(data);

    } catch {

      toast.error(
        "Failed to load categories"
      );

    } finally {

      setLoading(false);

    }
  }

  async function handleCreate() {

    try {

      await createCategory({
        name,
        imageUrl,
      });

      setName("");
      setImageUrl("");

      await loadCategories();

      toast.success(
        "Category created"
      );

    } catch {

      toast.error(
        "Create failed"
      );

    }
  }

  async function handleUpdate() {

    if (!editingCategory)
      return;

    try {

      await updateCategory(
        editingCategory.id,
        {
          name,
          imageUrl,
        }
      );

      setEditingCategory(null);

      setName("");
      setImageUrl("");

      await loadCategories();

      toast.success(
        "Category updated"
      );

    } catch {

      toast.error(
        "Update failed"
      );

    }
  }

  async function handleDelete(
    id: number
  ) {

    const confirmed =
      window.confirm(
        "Delete this category?"
      );

    if (!confirmed)
      return;

    try {

      await deleteCategory(id);

      await loadCategories();

      toast.success(
        "Category deleted"
      );

    } catch {

      toast.error(
        "Delete failed"
      );

    }
  }

  function startEdit(
    category: Category
  ) {

    setEditingCategory(
      category
    );

    setName(
      category.name
    );

    setImageUrl(
      category.imageUrl
    );
  }

  const filteredCategories =
    categories.filter(category =>
      category.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <AdminLayout>

      <div className="py-16">

        <h1
          className="
              mb-8
              text-4xl
              font-bold
              dark:text-white
            "
        >
          Category Management
        </h1>

        <div
          className="
            mb-8
            rounded-2xl
            border
            border-slate-200
            p-6
            dark:border-slate-700
            dark:bg-slate-900
          "
        >

          <h2
            className="
              mb-4
              text-2xl
              font-bold
              dark:text-white
            "
          >
            {
              editingCategory
                ? "Edit Category"
                : "Create Category"
            }
          </h2>

          <div className="space-y-4">

            <input
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder="Category Name"
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
            />

            <input
              value={imageUrl}
              onChange={(e) =>
                setImageUrl(
                  e.target.value
                )
              }
              placeholder="Image URL"
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
            />

            <button
              onClick={
                editingCategory
                  ? handleUpdate
                  : handleCreate
              }
              className="
                rounded-xl
                bg-blue-600
                px-5
                py-3
                text-white
              "
            >
              {
                editingCategory
                  ? "Update Category"
                  : "Create Category"
              }
            </button>

          </div>

        </div>

        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="
            mb-6
            w-full
            rounded-xl
            border
            border-slate-200
            p-4
            dark:border-slate-700
            dark:bg-slate-950
            dark:text-white
          "
        />

        {loading ? (

            <p className="dark:text-slate-300">
            Loading...
          </p>

        ) : (

          <div
            className="
              overflow-x-auto
              rounded-2xl
              border
              border-slate-200
              dark:border-slate-700
            "
          >

            <table className="w-full">

              <thead>

                <tr className="border-b dark:border-slate-700">

                  <th className="p-4 text-left">
                    ID
                  </th>

                  <th className="p-4 text-left">
                    Name
                  </th>

                  <th className="p-4 text-left">
                    Image
                  </th>

                  <th className="p-4 text-left">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredCategories.map(category => (

                  <tr key={category.id} className="border-b dark:border-slate-700">

                    <td className="p-4">
                      {category.id}
                    </td>

                    <td className="p-4">
                      {category.name}
                    </td>

                    <td className="p-4">

                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="
                          h-12
                          w-12
                          rounded-lg
                          object-cover
                        "
                      />

                    </td>

                    <td className="p-4">

                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            startEdit(
                              category
                            )
                          }
                          className="
                            rounded-lg
                            bg-amber-500
                            px-3
                            py-2
                            text-white
                          "
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              category.id
                            )
                          }
                          className="
                            rounded-lg
                            bg-red-600
                            px-3
                            py-2
                            text-white
                          "
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </AdminLayout>
  );
}