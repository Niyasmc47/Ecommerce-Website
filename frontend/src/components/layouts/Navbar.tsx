import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  BsCart3,
  BsMoonStars,
  BsSun,
} from "react-icons/bs";

import Container from "../common/Container";
import { getCart } from "../../services/cartService";

export default function Navbar() {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("token");

  const name =
    localStorage.getItem("name");

  const role =
    localStorage.getItem("role");

  const [darkMode, setDarkMode] =
    useState(
      localStorage.getItem("theme") ===
        "dark"
    );

  const [cartCount, setCartCount] =
    useState(0);

  useEffect(() => {
    async function loadCart() {
      const token =
        localStorage.getItem("token");

      if (!token) return;

      try {
        const items =
          await getCart();

        const count =
          items.reduce(
            (sum, item) =>
              sum + item.quantity,
            0
          );

        setCartCount(count);
      } catch {
        //
      }
    }

    loadCart();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "light"
      );
    }
  }, [darkMode]);

  function handleLogout() {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "role"
    );

    localStorage.removeItem(
      "email"
    );

    localStorage.removeItem(
      "name"
    );

    navigate("/login");

    window.location.reload();
  }

  return (
    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-slate-200
        bg-white/90
        backdrop-blur-xl

        dark:border-slate-800
        dark:bg-slate-950/90
      "
    >
      <Container>
        <div
          className="
            flex
            h-20
            items-center
            justify-between
            gap-6
          "
        >
          <Link
            to="/"
            className="
              text-2xl
              font-bold
              text-emerald-600
            "
          >
            Velocity.Shop
          </Link>

          <nav
            className="
              hidden
              items-center
              gap-8
              md:flex
            "
          >
            <Link
              to="/"
              className="
                text-sm
                font-medium
                text-slate-600 dark:text-slate-300
                transition
                hover:text-emerald-600

                dark:text-slate-300
              "
            >
              Home
            </Link>

            <Link
              to="/products"
              className="
                text-sm
                font-medium
                text-slate-600 dark:text-slate-300
                transition
                hover:text-emerald-600

                dark:text-slate-300
              "
            >
              Products
            </Link>
          </nav>

          <div
            className="
              hidden
              max-w-md
              flex-1
              md:flex
            "
          >
            <input
              type="text"
              placeholder="Search products..."
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-2.5

                dark:border-slate-700
                dark:bg-slate-900
                dark:text-white
              "
            />
          </div>

          <div
            className="
              flex
              items-center
              gap-4
            "
          >
            <button
              onClick={() =>
                setDarkMode(
                  !darkMode
                )
              }
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                transition
                hover:bg-slate-50

                dark:border-slate-700
                dark:text-white
                dark:hover:bg-slate-800
              "
            >
              {darkMode ? (
                <BsSun />
              ) : (
                <BsMoonStars />
              )}
            </button>

            <Link
              to="/cart"
              className="
                relative
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                transition
                hover:bg-slate-50

                dark:border-slate-700
                dark:hover:bg-slate-800
              "
            >
              <BsCart3
                className="
                  text-xl
                  text-slate-700

                  dark:text-slate-200
                "
              />

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    -right-2
                    -top-2
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                    bg-emerald-600
                    text-xs
                    font-bold
                    text-white
                  "
                >
                  {cartCount}
                </span>
              )}
            </Link>

                        {token ? (
              <div className="relative group">
                <button
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    hover:bg-slate-50

                    dark:border-slate-700
                    dark:text-slate-200
                    dark:hover:bg-slate-800
                  "
                >
                  {name}
                  <span>▼</span>
                </button>

                <div
                  className="
                    invisible
                    absolute
                    right-0
                    top-14
                    w-52
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-2
                    opacity-0
                    shadow-xl
                    transition-all
                    duration-200

                    dark:border-slate-700
                    dark:bg-slate-900

                    group-hover:visible
                    group-hover:opacity-100
                  "
                >
                  <Link
                    to="/orders"
                    className="
                      block
                      rounded-xl
                      px-4
                      py-3
                      text-sm
                      hover:bg-slate-50

                      dark:text-slate-200
                      dark:hover:bg-slate-800
                    "
                  >
                    My Orders
                  </Link>

                  {role === "Admin" && (
                    <Link
                      to="/admin"
                      className="
                        block
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        hover:bg-slate-50

                        dark:text-slate-200
                        dark:hover:bg-slate-800
                      "
                    >
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="
                      block
                      w-full
                      rounded-xl
                      px-4
                      py-3
                      text-left
                      text-sm
                      text-red-600
                      hover:bg-red-50

                      dark:hover:bg-red-950
                    "
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-2.5
                    font-medium
                    transition
                    hover:bg-slate-50

                    dark:border-slate-700
                    dark:text-slate-200
                    dark:hover:bg-slate-800
                  "
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="
                    rounded-xl
                    bg-emerald-600
                    px-4
                    py-2.5
                    font-medium
                    text-white
                    transition
                    hover:bg-emerald-700
                  "
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}