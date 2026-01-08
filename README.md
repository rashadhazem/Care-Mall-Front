# E-commerce Frontend Application (React / Tailwind) 🛍️

**Short description:** A modern, responsive front-end for an e-commerce platform built with React, Vite, and Tailwind CSS. It features a complete shopping experience, real-time communication, and dedicated management dashboards.

---

## 🔧 Features

- **User Shopping Experience**:
  - Product browsing with categories and filters.
  - Detailed product pages with reviews.
  - Shopping Cart and Wishlist management.
  - Secure Checkout process.
- **Real-time Communication**:
  - Live chat between Users and Vendors using **Socket.io**.
  - Instant notifications for orders, messages, and system alerts.
- **User Management**:
  - Authentication (Login, Register, Password Reset).
  - Profile management and Order history.
- **Dashboards**:
  - **Admin Dashboard**: Comprehensive management of users, products, categories, and system-wide settings.
  - **Vendor Dashboard**: Store management, product listings, and order fulfillment.
- **Multi-language Support**: Integrated i18n for internationalization.
- **Animations**: Smooth transitions and UI feedback using **Framer Motion**.

---

## 🧰 Tech Stack

- **Framework**: React 18 (Vite)
- **Language**: javaScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router 7
- **Networking**: Axios
- **Real-time**: Socket.io-client
- **UI Components**: Lucide React (Icons), SweetAlert2 (Alerts), Chart.js (Dashboards)
- **Animations**: Framer Motion

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Backend server running (see `Back` folder)

### Install & Run

1. **Clone the repo** (if not already done):
   ```bash
   cd Front
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file or check `src/lib/api.js` for API configuration. Ensure the base URL points to your running backend.

4. **Run in development**:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

---

## 🔧 Project Structure

- `src/components/` — Reusable UI components (Admin, Auth, Chat, Layout, etc.).
- `src/pages/` — Page components for different routes.
- `src/store/` — Redux store configuration and slices.
- `src/lib/` — API services, socket configuration, and utility functions.
- `src/i18n/` — Translation configurations.
- `src/assets/` — Static assets and global styles.

---


