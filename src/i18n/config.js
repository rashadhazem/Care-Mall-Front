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
            "Shop Now": "Shop Now",
            "View Stores": "View Stores",
            "Shop by Category": "Shop by Category",
            "Featured Stores": "Featured Stores",
            "Trending Products": "Trending Products",
            "Premium Brands": "Trusted by Premium Brands",
            "About": "About",
            "Privacy": "Privacy",
            "Terms": "Terms",
            "Contact": "Contact",
            "info2": "Your premium shopping destination.",
            "email": "Email",
            "password": "Password",

            "signup": "Sign Up",
            "Don't have an account?": " Don't have an account?",
            "Forgot Password?": "Forgot Password?",
            "Already have an account?": "Already have an account?",
            "admin": "Admin",
            "user": "User",
            "vendor": "Vendor",
            "Signing up...": "Signing up...",

            // Admin General
            "dashboard": "Dashboard",
            "users_management": "Users Management",
            "products_management": "Products Management",
            "categories_management": "Categories Management",
            "stores_management": "Stores Management",
            "logout": "Logout",
            "add_new": "Add New",
            "edit": "Edit",
            "delete": "Delete",
            "save": "Save",
            "cancel": "Cancel",
            "actions": "Actions",
            "search_placeholder": "Search...",
            "confirm_delete": "Are you sure?",
            "confirm_delete_text": "You won't be able to revert this!",
            "yes_delete": "Yes, delete it!",
            "deleted": "Deleted!",
            "updated": "Updated!",
            "created": "Created!",
            "error": "Error",
            "success": "Success",

            // Admin Users
            "add_user": "Add User",
            "edit_user": "Edit User",
            "name": "Name",
            "role": "Role",
            "status": "Status",
            "joined": "Joined",

            // Admin Products
            "add_product": "Add Product",
            "edit_product": "Edit Product",
            "title": "Title",
            "price": "Price",
            "category": "Category",
            "image": "Image",
            "description": "Description",

            // Admin Categories
            "add_category": "Add Category",
            "edit_category": "Edit Category",

            // Admin Stores
            "add_store": "Add Store",
            "edit_store": "Edit Store",
            "owner": "Owner",
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
            "info": "استكشف مئات المتاجر المميزة اللي بتقدم أفضل الماركات واكتشف الاف المنتاجات اللى بتلبى احتياجاتك كل دة فى مكان واحد ",
            "Shop Now": "تسوق الان",
            "View Stores": "تصفّح المتاجر",
            "Shop by Category": "اختر حسب الفئة",
            "Featured Stores": "المتاجر المقترحة",
            "Trending Products": "المنتجات الشائعة",
            "Premium Brands": "موثوق بها من أفضل الماركات",
            "About": "لمحة عنّا",
            "Privacy": "الخصوصية",
            "Terms": "الشروط",
            "Contact": "تواصل معنا",
            "info2": "وجهتك الأولى للتسوق المميز.",
            "login": " تسجيل الدخول",
            "email": "البريد الالكتروني",
            "password": "كلمة المرور",
            "signup": "إنشاء حساب",
            "Don't have an account?": "ليس لديك حساب؟",
            "Forgot Password?": "نسيت كلمة المرور؟",
            "Already have an account?": "لديك حساب بالفعل؟",
            "admin": "أدمن",
            "user": "مستخدم",
            "vendor": "بائع",
            "Signing up...": "جاري إنشاء الحساب...",

            // Admin General
            "dashboard": "لوحة التحكم",
            "users_management": "إدارة المستخدمين",
            "products_management": "إدارة المنتجات",
            "categories_management": "إدارة الفئات",
            "stores_management": "إدارة المتاجر",
            "logout": "تسجيل الخروج",
            "add_new": "إضافة جديد",
            "edit": "تعديل",
            "delete": "حذف",
            "save": "حفظ",
            "cancel": "إلغاء",
            "actions": "إجراءات",
            "search_placeholder": "بحث...",
            "confirm_delete": "هل أنت متأكد؟",
            "confirm_delete_text": "لا يمكن التراجع عن هذا الإجراء!",
            "yes_delete": "نعم، احذفه!",
            "deleted": "تم الحذف!",
            "updated": "تم التحديث!",
            "created": "تم الإنشاء!",
            "error": "خطأ",
            "success": "نجاح",

            // Admin Users
            "add_user": "إضافة مستخدم",
            "edit_user": "تعديل مستخدم",
            "name": "الاسم",
            "role": "الدور",
            "status": "الحالة",
            "joined": "تاريخ الانضمام",

            // Admin Products
            "add_product": "إضافة منتج",
            "edit_product": "تعديل منتج",
            "title": "العنوان",
            "price": "السعر",
            "category": "الفئة",
            "image": "الصورة",
            "description": "الوصف",

            // Admin Categories
            "add_category": "إضافة فئة",
            "edit_category": "تعديل فئة",

            // Admin Stores
            "add_store": "إضافة متجر",
            "edit_store": "تعديل متجر",
            "owner": "المالك",
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
