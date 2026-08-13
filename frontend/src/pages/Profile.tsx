import { useEffect, useState } from "react";
import { userApi } from "../api/userApi";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../api/addressApi";
import type { Address, CreateAddressInput } from "../api/addressApi";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
}
function Profile() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
  });
  const [originalProfile, setOriginalProfile] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
  });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState<CreateAddressInput>({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    country: "",
    postalCode: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const user = await userApi.getProfile();
        const data: ProfileData = {
          name: user.name ?? "",
          email: user.email ?? "",
          phone: user.phone ?? "",
        };

        setProfile(data);
        setOriginalProfile(data);

        try {
          setAddressLoading(true);
          setAddressError("");
          const userAddresses = await getAddresses();
          setAddresses(userAddresses);
        } catch (addressErr: any) {
          setAddressError(
            addressErr?.response?.data?.message || "Unable to load your addresses."
          );
        } finally {
          setAddressLoading(false);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, []);

  const handleChangePassword = async () => {
    try {
      setError("");
      setPasswordSuccess("");

      if (!currentPassword || !newPassword || !confirmPassword) {
        setError("Please fill in all password fields.");
        return;
      }

      if (newPassword.length < 8) {
        setError("New password must be at least 8 characters long.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("New password and confirmation do not match.");
        return;
      }

      setPasswordSaving(true);

      const response = await userApi.changePassword({
        currentPassword,
        newPassword,
      });

      setPasswordSuccess(
        response?.message || "Password changed successfully."
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Unable to change your password."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setError("");
    setEditing(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const response = await userApi.updateProfile(profile);
      const updatedUser = response?.user ?? response;

      const data: ProfileData = {
        name: updatedUser?.name ?? profile.name,
        email: updatedUser?.email ?? profile.email,
        phone: updatedUser?.phone ?? profile.phone,
      };

      setProfile(data);
      setOriginalProfile(data);
      setEditing(false);
      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to save your profile.");
    } finally {
      setSaving(false);
    }
  };

  const resetAddressForm = () => {
    setEditingAddress(null);
    setShowAddressForm(false);
    setAddressError("");
    setAddressForm({
      fullName: "",
      phone: "",
      street: "",
      city: "",
      country: "",
      postalCode: "",
    });
  };

  const handleAddAddress = () => {
    setAddressError("");
    setEditingAddress(null);
    setAddressForm({
      fullName: profile.name,
      phone: profile.phone,
      street: "",
      city: "",
      country: "",
      postalCode: "",
    });
    setShowAddressForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setAddressError("");
    setEditingAddress(address);
    setAddressForm({
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      country: address.country,
      postalCode: address.postalCode,
    });
    setShowAddressForm(true);
  };

  const handleAddressSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setAddressSaving(true);
      setAddressError("");

      if (editingAddress) {
        await updateAddress(editingAddress.id, addressForm);
      } else {
        await createAddress(addressForm);
      }

      const userAddresses = await getAddresses();
      setAddresses(userAddresses);
      resetAddressForm();
    } catch (addressErr: any) {
      setAddressError(
        addressErr?.response?.data?.message || "Unable to save your address."
      );
    } finally {
      setAddressSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      setAddressLoading(true);
      setAddressError("");

      await deleteAddress(addressId);
      const userAddresses = await getAddresses();
      setAddresses(userAddresses);
    } catch (addressErr: any) {
      const message = addressErr?.response?.data?.message || "";
      const isOrderConstraintError =
        message.includes("Order_addressId_fkey") ||
        message.includes("Foreign key constraint violated");

      setAddressError(
        isOrderConstraintError
          ? "This address cannot be deleted because it is linked to an existing order."
          : message || "Unable to delete your address."
      );
    } finally {
      setAddressLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-md">
          <p className="text-sm text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Account</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-950">My Profile</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          Manage your personal information and account settings.
        </p>
      </div>

      {saved && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-success-500 shadow-sm">
          Profile changes saved successfully.
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-danger-500 shadow-sm">
          {error}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-3xl font-black text-white shadow-lg ring-4 ring-brand-50">
            {(profile.name || "U").charAt(0).toUpperCase()}
          </div>
          <div className="mt-4 text-center">
            <p className="font-bold text-gray-950">
              {profile.name || "User"}
            </p>
            <p className="mt-1 break-all text-xs leading-5 text-gray-500">
              {profile.email || "Account email"}
            </p>
          </div>
        </aside>
        <main className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-gray-950">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Keep your account information up to date.
                </p>
              </div>
              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                >
                  Edit Profile
                </button>
              )}
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Name</span>
                <input
                  type="text"
                  value={profile.name}
                  disabled={!editing || saving}
                  onChange={(event) =>
                    setProfile({ ...profile, name: event.target.value })
                  }
                  placeholder="Your name"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Email</span>
                <input
                  type="email"
                  value={profile.email}
                  disabled={!editing || saving}
                  onChange={(event) =>
                    setProfile({ ...profile, email: event.target.value })
                  }
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-semibold text-gray-700">Phone</span>
                <input
                  type="tel"
                  value={profile.phone}
                  disabled={!editing || saving}
                  onChange={(event) =>
                    setProfile({ ...profile, phone: event.target.value })
                  }
                  placeholder="Your phone number"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </label>
            </div>
            {editing && (
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </section>
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-gray-950">
                  My Addresses
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Manage the delivery addresses saved to your account.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddAddress}
                className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
              >
                Add Address
              </button>
            </div>

            {addressError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-danger-500 shadow-sm">
                {addressError}
              </div>
            )}

            {showAddressForm && (
              <form
                onSubmit={handleAddressSubmit}
                className="mt-5 rounded-xl border border-brand-100 bg-brand-50/30 p-5 shadow-sm"
              >
                <h3 className="text-base font-bold text-gray-950">
                  {editingAddress ? "Edit Address" : "Add Address"}
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700">Full name</span>
                    <input
                      type="text"
                      value={addressForm.fullName}
                      onChange={(event) => setAddressForm((current) => ({ ...current, fullName: event.target.value }))}
                      required
                      disabled={addressSaving}
                      className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-950 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-gray-50"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700">Phone</span>
                    <input
                      type="tel"
                      value={addressForm.phone}
                      onChange={(event) => setAddressForm((current) => ({ ...current, phone: event.target.value }))}
                      required
                      disabled={addressSaving}
                      className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-950 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-gray-50"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-sm font-semibold text-gray-700">Street</span>
                    <input
                      type="text"
                      value={addressForm.street}
                      onChange={(event) => setAddressForm((current) => ({ ...current, street: event.target.value }))}
                      required
                      disabled={addressSaving}
                      className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-950 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-gray-50"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700">City</span>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(event) => setAddressForm((current) => ({ ...current, city: event.target.value }))}
                      required
                      disabled={addressSaving}
                      className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-950 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-gray-50"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700">Postal code</span>
                    <input
                      type="text"
                      value={addressForm.postalCode}
                      onChange={(event) => setAddressForm((current) => ({ ...current, postalCode: event.target.value }))}
                      required
                      disabled={addressSaving}
                      className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-950 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-gray-50"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-sm font-semibold text-gray-700">Country</span>
                    <input
                      type="text"
                      value={addressForm.country}
                      onChange={(event) => setAddressForm((current) => ({ ...current, country: event.target.value }))}
                      required
                      disabled={addressSaving}
                      className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-950 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-gray-50"
                    />
                  </label>
                </div>

                <div className="mt-5 flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={resetAddressForm}
                    disabled={addressSaving}
                    className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-brand-200 hover:bg-white hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addressSaving}
                    className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {addressSaving ? "Saving..." : editingAddress ? "Save Changes" : "Add Address"}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-5 space-y-3">
              {addressLoading && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center text-sm text-gray-600">
                  Loading addresses...
                </div>
              )}

              {!addressLoading && addresses.length === 0 && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center text-sm text-gray-600">
                  No saved addresses yet.
                </div>
              )}

              {!addressLoading && addresses.map((address) => (
                <div key={address.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1 text-sm">
                      <p className="font-bold text-gray-950">{address.fullName}</p>
                      <p className="text-gray-600">{address.phone}</p>
                      <p className="text-gray-600">{address.street}</p>
                      <p className="text-gray-600">{address.city}, {address.postalCode}</p>
                      <p className="text-gray-500">{address.country}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditAddress(address)}
                        disabled={addressLoading || addressSaving}
                        className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDeleteAddress(address.id)}
                        disabled={addressLoading || addressSaving}
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-danger-500 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
            <h2 className="text-lg font-bold tracking-tight text-gray-950">Account Security</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Keep your account protected with a strong password.
            </p>
            {passwordSuccess && (
              <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-success-500 shadow-sm">
                {passwordSuccess}
              </div>
            )}
            {showPasswordForm && (
              <div className="mt-5 space-y-4 rounded-xl border border-brand-100 bg-brand-50/30 p-5 shadow-sm">
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">
                    Current Password
                  </span>
                  <input
                    type="password"
                    value={currentPassword}
                    disabled={passwordSaving}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    autoComplete="current-password"
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-gray-100"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">
                    New Password
                  </span>
                  <input
                    type="password"
                    value={newPassword}
                    disabled={passwordSaving}
                    onChange={(event) => setNewPassword(event.target.value)}
                    autoComplete="new-password"
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-gray-100"
                  />
                  <span className="mt-1 block text-xs leading-5 text-gray-500">
                    Minimum 8 characters.
                  </span>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">
                    Confirm New Password
                  </span>
                  <input
                    type="password"
                    value={confirmPassword}
                    disabled={passwordSaving}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-gray-100"
                  />
                </label>
                <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setError("");
                      setPasswordSuccess("");
                      setShowPasswordForm(false);
                    }}
                    disabled={passwordSaving}
                    className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-brand-200 hover:bg-white hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={passwordSaving}
                    className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {passwordSaving ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </div>
            )}

            {!showPasswordForm && (
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setPasswordSuccess("");
                  setShowPasswordForm(true);
                }}
                className="mt-5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              >
                Change Password
              </button>
            )}
          </section>
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
            <h2 className="text-lg font-bold tracking-tight text-gray-950">Account Settings</h2>
            <div className="mt-5 divide-y divide-gray-200">
              <div className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-bold text-gray-950">Order History</p>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    View and manage your previous orders.
                  </p>
                </div>
                <a
                  href="/orders"
                  className="shrink-0 text-sm font-semibold text-brand-600 underline underline-offset-4 transition hover:text-brand-700"
                >
                  View Orders
                </a>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Profile;