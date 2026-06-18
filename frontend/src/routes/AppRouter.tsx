import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "../pages/Home/HomePage";
import ProductsPage from "../pages/Products/ProductsPage";
import ProductDetailsPage from "../pages/ProductDetails/ProductDetailsPage";
import CartPage from "../pages/Cart/CartPage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import AdminDashboardPage from "../pages/Admin/AdminDashboardPage";
import AdminProductsPage from "../pages/Admin/AdminProductsPage";
import AdminOrdersPage from "../pages/Admin/AdminOrdersPage";
import AdminCategoriesPage from "../pages/Admin/AdminCategoriesPage";
import OrdersPage from "../pages/Orders/OrdersPage";
import OrderDetailsPage from "../pages/Orders/OrderDetailsPage";
import AdminOrderDetailsPage from "../pages/Admin/AdminOrderDetailsPage";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import AdminUsersPage from "../pages/Admin/AdminUsersPage";
import CheckoutPage from "../pages/Checkout/CheckoutPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import DeliveryPage from "../pages/Delivery/DeliveryPage";
import DeliveryManagementPage from "../pages/Admin/DeliveryManagementPage";
import PaymentSuccessPage from "../pages/PaymentSuccess/PaymentSuccessPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import PaymentCancelPage from "../pages/PaymentCancel/PaymentCancelPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/delivery" element={<DeliveryPage />} />

        <Route path="/payment/success" element={<PaymentSuccessPage />} />

        <Route path="/payment/cancel" element={<PaymentCancelPage />} />

        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardPage />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedAdminRoute>
              <AdminProductsPage />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <ProtectedAdminRoute>
              <AdminCategoriesPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedAdminRoute>
              <AdminOrdersPage />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedAdminRoute>
              <AdminUsersPage />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/delivery"
          element={
            <ProtectedAdminRoute>
              <DeliveryManagementPage />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/orders/:id"
          element={
            <ProtectedAdminRoute>
              <AdminOrderDetailsPage />
            </ProtectedAdminRoute>
          }
        />

        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}
