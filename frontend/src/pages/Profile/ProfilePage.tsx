import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import MainLayout from "../../components/layouts/MainLayout";
import {
  getProfile,
  updateProfile,
  changePassword,
  getAddresses,
  addAddress,
  deleteAddress,
} from "../../services/profileService";
import type { Profile } from "../../types/profile";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    isPrimary: false,
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getProfile();
        setProfile(data);
        setName(data.name);
        setPhoneNumber(data.phoneNumber || "");

        const addrs = await getAddresses();
        setAddresses(addrs);
      } catch {
        toast.error("Please login again");
        navigate("/login");
      }
    }
    load();
  }, [navigate]);

  async function handleSaveProfile() {
    try {
      setIsSaving(true);
      await updateProfile(name, phoneNumber);
      localStorage.setItem("name", name);
      setProfile((prev) => (prev ? { ...prev, name, phoneNumber } : null));
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdatePassword() {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      setIsChangingPassword(true);
      await changePassword(oldPassword, newPassword, confirmPassword);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully");
    } catch {
      toast.error("Failed to update password");
    } finally {
      setIsChangingPassword(false);
    }
  }

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    try {
      await addAddress(newAddress);
      toast.success("Address added successfully");
      setIsAddingAddress(false);
      setNewAddress({
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        isPrimary: false,
      });
      const addrs = await getAddresses();
      setAddresses(addrs);
    } catch {
      toast.error("Failed to add address");
    }
  }

  async function handleDeleteAddress(id: number) {
    try {
      await deleteAddress(id);
      toast.success("Address deleted");
      const addrs = await getAddresses();
      setAddresses(addrs);
    } catch {
      toast.error("Failed to delete address");
    }
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="flex h-[60vh] items-center justify-center bg-[#F8FAFC]">
          <div className="h-10 w-10 rounded-full border-4 border-blue-600/20 border-t-blue-600 animate-spin"></div>
        </div>
      </MainLayout>
    );
  }

  const memberSince = new Date(profile.createdDate).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" },
  );

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col md:flex-row max-w-[1440px] mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-[#F8FAFC] border-r border-slate-200 flex flex-col min-h-[calc(100vh-73px)]">
          <div className="p-6">
            <h2 className="text-[#0D47A1] font-bold text-lg">
              Account Settings
            </h2>
            <p className="text-slate-500 text-xs mt-1">Manage your profile</p>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            <a
              href="#personal-info"
              className="flex items-center gap-3 px-4 py-3 bg-[#2563EB] text-white rounded-lg font-medium text-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                person
              </span>
              Personal Info
            </a>
            <a
              href="#security"
              className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-lg font-medium text-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                security
              </span>
              Security
            </a>
            <a
              href="#addresses"
              className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-lg font-medium text-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                location_on
              </span>
              Addresses
            </a>

            <Link
              to="/support"
              className="
    flex
    items-center
    gap-3
    px-4
    py-3
    text-slate-600
    hover:bg-slate-100
    rounded-lg
    font-medium
    text-sm
    transition-colors
  "
            >
              <span
                className="
      material-symbols-outlined
      text-[20px]
    "
              >
                support_agent
              </span>
              Support Center
            </Link>
          </nav>
          <div className="p-6 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                logout
              </span>
              Log Out
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto">
          <div className="max-w-4xl space-y-12">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-slate-900">My Account</h1>
              <p className="text-slate-600 mt-2">
                Update your personal details and security preferences below.
              </p>
            </div>

            {/* Personal Information */}
            <section id="personal-info" className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                <span className="material-symbols-outlined text-[#0D47A1] text-[24px]">
                  assignment_ind
                </span>
                <h2 className="text-2xl font-bold text-slate-900">
                  Personal Information
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-white shadow-sm flex items-center justify-center text-blue-700 text-3xl font-bold">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {profile.name}
                    </h3>
                    <p className="text-sm text-slate-500 mb-2">
                      Member since {memberSince}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#A7F3D0] text-[#065F46] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        Premium Account
                      </span>
                      <span className="bg-blue-100 text-[#1E40AF] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-[#0D47A1] text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-[#1565C0] transition-colors"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-full font-medium text-sm hover:bg-slate-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="bg-[#059669] text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-[#047857] transition-colors disabled:opacity-70"
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 px-2">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-medium text-slate-500">
                      Full Name
                    </label>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-[#0D47A1] text-xs font-medium hover:underline"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm font-medium text-slate-900"
                    />
                  ) : (
                    <div className="font-semibold text-slate-900">
                      {profile.name}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-medium text-slate-500">
                      Email Address
                    </label>
                  </div>
                  <div className="font-semibold text-slate-900">
                    {profile.email}
                  </div>
                  {isEditing && (
                    <p className="text-xs text-slate-400 mt-1">
                      Email cannot be changed.
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-medium text-slate-500">
                      Phone Number
                    </label>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-[#0D47A1] text-xs font-medium hover:underline"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 012-3456"
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm font-medium text-slate-900"
                    />
                  ) : (
                    <div className="font-semibold text-slate-900">
                      {profile.phoneNumber || "Not provided"}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Security Section */}
            <section id="security" className="space-y-6 pt-8">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                <span className="material-symbols-outlined text-[#0D47A1] text-[24px]">
                  security
                </span>
                <h2 className="text-2xl font-bold text-slate-900">Security</h2>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Change Password
                </h3>
                <p className="text-sm text-slate-600 mt-1 mb-6">
                  Update your account password to maintain security.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none text-sm tracking-widest"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none text-sm tracking-widest"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none text-sm tracking-widest"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleUpdatePassword}
                    disabled={isChangingPassword}
                    className="bg-[#0D47A1] text-white px-8 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#1565C0] transition-colors disabled:opacity-70"
                  >
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-[#F8FAFC] border border-slate-100 rounded-xl mt-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-[#0D47A1] rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined">
                      phonelink_setup
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D47A1]"></div>
                </label>
              </div>
            </section>

            {/* Address Book */}
            <section id="addresses" className="space-y-6 pt-8">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#0D47A1] text-[24px]">
                    location_on
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Address Book
                  </h2>
                </div>
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="text-[#0D47A1] text-sm font-semibold flex items-center gap-1 hover:underline"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      add_circle
                    </span>{" "}
                    Add New Address
                  </button>
                )}
              </div>

              {isAddingAddress && (
                <form
                  onSubmit={handleAddAddress}
                  className="bg-slate-50 border border-slate-200 p-6 rounded-xl space-y-4"
                >
                  <h3 className="font-bold text-slate-900 mb-2">
                    New Shipping Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      required
                      placeholder="Address Line 1"
                      value={newAddress.addressLine1}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          addressLine1: e.target.value,
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                    />
                    <input
                      placeholder="Address Line 2 (Optional)"
                      value={newAddress.addressLine2}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          addressLine2: e.target.value,
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                    />
                    <input
                      required
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                    />
                    <input
                      required
                      placeholder="State / Province"
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                    />
                    <input
                      required
                      placeholder="Postal Code"
                      value={newAddress.postalCode}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          postalCode: e.target.value,
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                    />
                    <input
                      required
                      placeholder="Country"
                      value={newAddress.country}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          country: e.target.value,
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      checked={newAddress.isPrimary}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          isPrimary: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Set as primary address
                    </span>
                  </label>
                  <div className="flex items-center justify-end gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-[#0D47A1] rounded-lg hover:bg-blue-800"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`border-2 rounded-xl p-6 relative ${address.isPrimary ? "border-[#0D47A1] bg-blue-50/30" : "border-slate-200 bg-white"}`}
                  >
                    {address.isPrimary && (
                      <div className="absolute top-0 right-0 bg-[#0D47A1] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl rounded-tr-xl">
                        Primary
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className={`material-symbols-outlined ${address.isPrimary ? "text-[#0D47A1]" : "text-slate-500"}`}
                      >
                        {address.isPrimary ? "home" : "location_on"}
                      </span>
                      <h4 className="font-bold text-slate-900">
                        {address.isPrimary ? "Home" : "Address"}
                      </h4>
                    </div>
                    <div className="space-y-1 text-sm text-slate-600 mb-6 min-h-[100px]">
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p>{address.country}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="w-full flex items-center justify-center bg-white border border-slate-200 text-slate-500 py-2 rounded-lg hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px] mr-1">
                          delete
                        </span>{" "}
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                {!isAddingAddress && (
                  <div
                    onClick={() => setIsAddingAddress(true)}
                    className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-colors cursor-pointer min-h-[220px]"
                  >
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined">add</span>
                    </div>
                    <span className="font-medium text-sm">
                      Add Shipping Address
                    </span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
