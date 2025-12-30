import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Base translations (can be moved to separate JSON files later)
const resources = {
    en: {
        translation: {
            "welcome": "Welcome to CARE Mall",
            "stores": "Stores",
            "cart": "Cart",
            "login": "Login",
            "search": "Search products...",
            "language": "Language",
            "theme": "Theme",
            "rights": "All rights reserved.",
            "info": "Explore hundreds of premium stores offering top-quality brands,and discover thousands of products designed to meet all your needs — all in one place.",
            "Shop Now":"Shop Now",
            "View Stores":"View Stores",
            "Shop by Category":"Shop by Category",
            "Featured Stores":"Featured Stores",
            "Trending Products":"Trending Products",
            "Premium Brands":"Trusted by Premium Brands",
            "About":"About",
            "Privacy":"Privacy",
            "Terms":"Terms",
            "Contact":"Contact",
            "info2":"Your premium shopping destination.",
            
        }
    },
    ar: {
        translation: {
            "welcome": "مرحبًا بكم",
            "stores": "المتاجر",
            "cart": "عربة التسوق",
            "login": "تسجيل الدخول",
            "search": "ابحث عن المنتجات...",
            "language": "اللغة",
            "theme": "المظهر",
            "rights": "جميع الحقوق محفوظة.",
            "info":"استكشف مئات المتاجر المميزة اللي بتقدم أفضل الماركات واكتشف الاف المنتاجات اللى بتلبى احتياجاتك كل دة فى مكان واحد ",
            "Shop Now":"تسوق الان",
            "View Stores":"تصفّح المتاجر",
            "Shop by Category":"اختر حسب الفئة",
            "Featured Stores":"المتاجر المقترحة",
            "Trending Products":"المنتجات الشائعة",
            "Premium Brands":"موثوق بها من أفضل الماركات",
            "About":"لمحة عنّا",
            "Privacy":"الخصوصية",
            "Terms":"الشروط",
            "Contact":"تواصل معنا",
            "info2":"وجهتك الأولى للتسوق المميز.",

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
