import { useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import MainLayout from "../../components/layouts/MainLayout";
import Container from "../../components/common/Container";

import { register } from "../../services/authService";

export default function RegisterPage() {

  const navigate =
    useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    try {

      setLoading(true);

      await register({
        name,
        email,
        password,
      });

      toast.success(
        "Account created successfully"
      );

      navigate("/login");

    } catch {

      toast.error(
        "Registration failed"
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <MainLayout>

      <Container>

        <div
          className="
            mx-auto
            max-w-md
            py-20
          "
        >

          <div
            className="
              rounded-3xl
              bg-white
              p-8
              shadow-sm
              ring-1
              ring-slate-200

              dark:bg-slate-900
              dark:ring-slate-700
            "
          >

            <h1
              className="
                text-center
                text-4xl
                font-bold
              "
            >
              Create Account
            </h1>

            <p
              className="
                mt-3
                text-center
                text-slate-500

                dark:text-slate-400
              "
            >
              Join Velocity.Shop today.
            </p>

            <form
              onSubmit={
                handleSubmit
              }
              className="
                mt-8
                space-y-4
              "
            >

              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
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
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
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
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
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
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  bg-emerald-600
                  py-4
                  font-medium
                  text-white
                  transition
                  hover:bg-emerald-700
                "
              >
                {
                  loading
                    ? "Creating Account..."
                    : "Create Account"
                }
              </button>

            </form>

          </div>

        </div>

      </Container>

    </MainLayout>
  );
}