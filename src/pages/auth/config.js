import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Base translations (can be moved to separate JSON files later)
const resources = {
    en: {
        translation: {
            "welcome": "Welcome to Mall App",
            "stores": "Stores",
            "cart": "Cart",
            "login": "Login",
            "search": "Search products...",
            "language": "Language",
            "theme": "Theme",
            "rights": "All rights reserved.",
            "login": "Login",
            "email": "Email",
            "password": "Password",
            "login": "Login",
            "signup": "Sign Up",
            "Don't have an account?": " Don't have an account?",
            "Forgot Password?":"Forgot Password?",
            "Already have an account?": "Already have an account?",
            "admin": "Admin",
            "user": "User",
            "vendor": "Vendor",



        }
    },
    ar: {
        translation: {
            "welcome": "مرحباً بكم في تطبيق المول",
            "stores": "المتاجر",
            "cart": "عربة التسوق",
            "login": "تسجيل الدخول",
            "search": "ابحث عن المنتجات...",
            "language": "اللغة",
            "theme": "المظهر",
            "rights": "جميع الحقوق محفوظة.",
            "login": " تسجيل الدخول",
            "email": "البريد الالكتروني",
            "password": "كلمة المرور",
            "login": "دخول",
            "signup": "إنشاء حساب",
            "Don't have an account?": "ليس لديك حساب؟",
            "Forgot Password?":"نسيت كلمة المرور؟",
            "Already have an account?": "لديك حساب بالفعل؟",
            "admin": "أدمن",
            "user": "مستخدم",
            "vendor": "بائع",
        }
    }
};

const savedLang = localStorage.getItem('language') || 'en';

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: savedLang,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
