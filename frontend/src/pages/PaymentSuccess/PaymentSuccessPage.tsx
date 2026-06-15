import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import toast from "react-hot-toast";

import MainLayout from "../../components/layouts/MainLayout";
import Container from "../../components/common/Container";

import { api } from "../../api/axios";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) {
      return;
    }

    hasRun.current = true;

    async function confirmPayment() {
      const sessionId =
        searchParams.get(
          "session_id"
        );

      if (!sessionId) {
        toast.error(
          "Missing session id"
        );

        navigate("/");
        return;
      }

      try {
        const token =
          localStorage.getItem(
            "token"
          );

        await api.post(
          `/payments/confirm/${sessionId}`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        toast.success(
          "Payment successful"
        );

        navigate("/orders");
      } catch {
        toast.error(
          "Failed to confirm payment"
        );

        navigate("/");
      }
    }

    confirmPayment();
  }, [navigate, searchParams]);

  return (
    <MainLayout>
      <Container>
        <div
          className="
            py-20
            text-center
          "
        >
          Processing payment...
        </div>
      </Container>
    </MainLayout>
  );
}