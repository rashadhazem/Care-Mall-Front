import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaIdBadge,
  FaMapMarkerAlt,
  FaLock,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import Button from "../components/ui/Button";

const ProfilePage = () => {
  const [darkMode, setDarkMode] = useState(false);

  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    role: "User",
    address: "123 Street, City, Country",
  });

  const [editData, setEditData] = useState({ ...user });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [editModal, setEditModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const firstLetter = user.name.charAt(0).toUpperCase();

  /* ===== Dark Mode Toggle ===== */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  /* ===== Save Profile ===== */
  const handleSaveProfile = () => {
    setUser(editData);
    setEditModal(false);
  };

  /* ===== Change Password ===== */
  const handleSavePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordError("");
    setPasswordModal(false);
    setPasswordData({ newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-6 transition">

      {/* ===== Card ===== */}
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">

        {/* ===== Header ===== */}
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white text-center">
          {/* <button
            onClick={() => setDarkMode(!darkMode)}
            className="absolute top-4 right-4 bg-white/20 p-2 rounded-full hover:bg-white/30"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button> */}

          <div className="mx-auto w-32 h-32 rounded-full bg-white text-blue-600 flex items-center justify-center text-5xl font-bold shadow-lg">
            {firstLetter}
          </div>
          <h2 className="mt-4 text-2xl font-bold">{user.name}</h2>
          <p className="opacity-90">Your Profile</p>
        </div>

        {/* ===== Content ===== */}
        <div className="p-8 grid md:grid-cols-2 gap-6">

          {/* Info */}
          <div className="space-y-4">
            <InfoItem icon={<FaUser />} label="Name" value={user.name} />
            <InfoItem icon={<FaEnvelope />} label="Email" value={user.email} />
            <InfoItem icon={<FaIdBadge />} label="Role" value={user.role} />
            {user.address && (
              <InfoItem
                icon={<FaMapMarkerAlt />}
                label="Address"
                value={user.address}
              />
            )}
          </div>

          {/* Actions */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 shadow-inner flex flex-col m-8 justify-around">
            <div>
              <h3 className="text-xl font-semibold dark:text-white">
                Account Settings
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Manage your account information and security.
              </p>
            </div>

            <div className="space-y-3 mt-6">
              <Button
                onClick={() => {
                  setEditData(user);
                  setEditModal(true);
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl"
              >
                Edit Profile
              </Button>

              <Button
                onClick={() => setPasswordModal(true)}
                className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <FaLock /> Change Password
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Edit Profile Modal ===== */}
      {editModal && (
        <Modal title="Edit Profile">
          <Input
            label="Name"
            value={editData.name}
            onChange={(e) =>
              setEditData({ ...editData, name: e.target.value })
            }
          />
          <Input
            label="Email"
            value={editData.email}
            onChange={(e) =>
              setEditData({ ...editData, email: e.target.value })
            }
          />
          <Input
            label="Address"
            value={editData.address}
            onChange={(e) =>
              setEditData({ ...editData, address: e.target.value })
            }
          />

          <ModalActions
            onCancel={() => setEditModal(false)}
            onSave={handleSaveProfile}
          />
        </Modal>
      )}

      {/* ===== Password Modal ===== */}
      {passwordModal && (
        <Modal title="Change Password">
          <Input
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
          />
          <Input
            label="Confirm Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                confirmPassword: e.target.value,
              })
            }
          />

          {passwordError && (
            <p className="text-red-500 text-sm text-center">{passwordError}</p>
          )}

          <ModalActions
            onCancel={() => setPasswordModal(false)}
            onSave={handleSavePassword}
          />
        </Modal>
      )}
    </div>
  );
};

/* ===== Reusable Components ===== */

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow transition">
    <div className="text-2xl text-blue-500">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-semibold dark:text-white">{value}</p>
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="block mb-1 font-medium dark:text-white">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

const Modal = ({ title, children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl">
      <h3 className="text-xl font-bold mb-6 text-center dark:text-white">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  </div>
);

const ModalActions = ({ onCancel, onSave }) => (
  <div className="flex justify-end gap-3 pt-4">
    <Button
      onClick={onCancel}
      className="bg-gray-200 dark:bg-gray-600 dark:text-white hover:bg-gray-300"
    >
      Cancel
    </Button>
    <Button
      onClick={onSave}
      className="bg-blue-500 hover:bg-blue-600 text-white"
    >
      Save
    </Button>
  </div>
);

export default ProfilePage;
