import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../../services/authService";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSendOtp() {
    try {
      setLoading(true);

      await forgotPassword(email);

      toast.success("OTP sent successfully");

      setStep(2);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    try {
      setLoading(true);

      await verifyOtp(email, otp);

      toast.success("OTP verified");

      setStep(3);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    try {
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      setLoading(true);

      await resetPassword(
        email,
        otp,
        newPassword
      );

      toast.success(
        "Password reset successfully"
      );

      navigate("/login");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Reset Password
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            {step === 1 &&
              "Enter your email to receive an OTP"}

            {step === 2 &&
              "Enter the OTP sent to your email"}

            {step === 3 &&
              "Create a new password"}
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] outline-none"
            />

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-[#0D47A1] text-white py-3 rounded-lg font-semibold"
            >
              {loading
                ? "Sending OTP..."
                : "Send OTP"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 rounded-lg border bg-slate-100"
            />

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value)
              }
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] outline-none"
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-[#0D47A1] text-white py-3 rounded-lg font-semibold"
            >
              {loading
                ? "Verifying..."
                : "Verify OTP"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] outline-none"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] outline-none"
            />

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-[#0D47A1] text-white py-3 rounded-lg font-semibold"
            >
              {loading
                ? "Resetting..."
                : "Reset Password"}
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-[#0D47A1] font-medium hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}