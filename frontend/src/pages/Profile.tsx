import { useEffect, useState } from "react";
import { userApi } from "../api/userApi";

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