import { useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import MainLayout from "../../components/layouts/MainLayout";
import Container from "../../components/common/Container";

import { login } from "../../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await login({
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      localStorage.setItem("role", response.data.role);

      localStorage.setItem("email", response.data.email);

      toast.success("Login successful");

      navigate("/");
    } catch {
      toast.error("Invalid credentials");
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
          <h1
            className="
              text-center
              text-4xl
              font-bold
            "
          >
            Login
          </h1>

          <form onSubmit={handleSubmit} className="mt-10 space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full
                rounded-xl
                border
                p-4
              "
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full
                rounded-xl
                border
                p-4
              "
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-xl
                bg-blue-600
                py-4
                text-white
                hover:bg-blue-700
              "
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </Container>
    </MainLayout>
  );
}
