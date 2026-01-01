import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import loginImg from "/login.png";
import PageWrapper from "../../components/ui/PageWrapper";
import { Link } from "react-router-dom";
import { authAPI } from "../../lib/api";
import { showToast } from "../../lib/toast";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice";


export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    timer: 3000,
    showConfirmButton: false,
  });

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      return "Email and password are required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }

    return null;

  };
  const handleLogin = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      Toast.fire({
        icon: 'error',
        title: error,
      });
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:8000/api/v1/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const user = await res.json();

      if (!res.ok) {
        Toast.fire({
          icon: 'error',
          title: user.message || 'Login failed',
        });

        throw new Error(user.message || "Login failed");

      }
      console.log("user", user);
      dispatch(loginSuccess(user.token));
      Toast.fire({
        icon: 'success',
        title: 'Login successful!',
      });
      console.log("Login successful:", user);
      console.log("role", role);
      switch (user.user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "vendor":
          navigate("/vendor");
          break;
        default:
          navigate("/products");
      }
    }
    catch (error) {
      Toast.fire({
        icon: 'error',
        title: `Login failed: ${error.message}`,
      });
      console.error("Login error:", error);
    }
    finally {
      setLoading(false);
    }

  };

  return (
    <PageWrapper className="flex min-h-[80vh] font-poppins">
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-gray-800">

        {/* Image Section - Hidden on small screens or stacked */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-blue-50 dark:bg-gray-700/30 p-8">
          <img
            src={loginImg}
            alt="Login"
            className="w-full max-w-sm object-contain hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 relative">
          <div className="w-full max-w-sm space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
              {t("Welcome Back")}
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
              Please enter your details to sign in
            </p>

            {/* Email */}
            <div className="space-y-4">
              <input
                type="email"
                placeholder={t("email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />

              <input
                type="password"
                placeholder={t("password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Button */}
            <button
              onClick={handleLogin}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 transform transition-all active:scale-95"
            >
              {t("login")}
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              {t("Don't have an account?")}{" "}
              <Link to="/signup" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
                {t("signup")}
              </Link>
            </p>

            <p className="text-center text-sm">
              <Link to="/forgot-password" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {t("Forgot Password?")}
              </Link>
            </p>

          </div>
        </div>
      </div> {/* Close flex-col */}
    </PageWrapper>
  );
}
