import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SignupImg from "/regist.png";
import PageWrapper from "../../components/ui/PageWrapper";
import Alert from "../../components/ui/Alert";
import Swal from "sweetalert2";

export default function Signup() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  timer: 3000,
  showConfirmButton: false,
});

 const validateForm = () => {
    const { name, email, password } = form;

    if (!name.trim() || !email.trim() || !password.trim()) {
      return "All fields are required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }

    if (password.length < 5) {
      return "Password must be at least 5 characters";
    }

    return null;
  };





  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      alert("Please fill all required fields");
      return;
    }
     const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    const newUser = { name, email, password, role };
    try {
      const res = await fetch(
        "http://localhost:8000/api/v1/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        }
      );
      const data = await res.json();
      if(!res.ok){
        throw new Error(data.message || "Signup failed");
      }
      
      console.log("Signup successful:", data);
      if (data.message === "User registered. Please verify your email.") {
        Toast.fire({
          icon: "success",
          title: "Signup successful! Please verify your email.",
        });
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/login-otp");
      } else {
        Alert("error", "Signup failed", "Please try again");
      }
    } catch (error) {
      setError(error.message);
      Toast.fire({
        icon: "error",
        title: `Signup failed: ${error.message}`,
      });
      console.error("Signup error:", error);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="flex min-h-[80vh] font-poppins">
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto shadow-2xl rounded-3xl overflow-hidden bg-white dark:bg-gray-800">

        {/* Image Section */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-blue-50 dark:bg-gray-700/30 p-8">
          <img
            src={SignupImg}
            alt="Signup"
            className="w-full max-w-sm object-contain hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-sm space-y-5">

            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
              {t("Create Account")}
            </h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Start your shopping journey today</p>

            {/* Name */}
            <input
              placeholder={t("name")}
              value={name}
              onChange={(e) => {setName(e.target.value), setForm({...form, name: e.target.value})}}
              className="w-full mb-4 px-4 py-3 rounded-lg 
                       border border-gray-300 dark:border-gray-600
                       bg-gray-50 dark:bg-gray-700
                       text-gray-900 dark:text-white
                       placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Email */}
            <input
              placeholder={t("email")}
              value={email}
              onChange={(e) => {setEmail(e.target.value), setForm({...form, email: e.target.value})}}
              className="w-full mb-4 px-4 py-3 rounded-lg 
                       border border-gray-300 dark:border-gray-600
                       bg-gray-50 dark:bg-gray-700
                       text-gray-900 dark:text-white
                       placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Password */}
            <input
              type="password"
              placeholder={t("password")}
              value={password}
              onChange={(e) => {setPassword(e.target.value), setForm({...form, password: e.target.value})}}
              className="w-full mb-4 px-4 py-3 rounded-lg 
                       border border-gray-300 dark:border-gray-600
                       bg-gray-50 dark:bg-gray-700
                       text-gray-900 dark:text-white
                       placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Role */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-lg
                       border border-gray-300 dark:border-gray-600
                       bg-gray-50 dark:bg-gray-700
                       text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">{t("user")}</option>
              <option value="vendor">{t("vendor")}</option>
            </select>

            {/* Button */}
            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 transform transition-all active:scale-95"
            >
              { loading ? t("Signing up...") : t("signup")}
            </button>

            <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
              {t("Already have an account?")}{" "}
              <Link to="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
                {t("login")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
