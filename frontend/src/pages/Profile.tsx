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
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <p className="text-sm font-medium text-gray-500">Account</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your personal information and account settings.
        </p>
      </div>

      {saved && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Profile changes saved successfully.
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-900 text-3xl font-bold text-white">
            {(profile.name || "U").charAt(0).toUpperCase()}
          </div>
          <div className="mt-4 text-center">
            <p className="font-semibold text-gray-900">
              {profile.name || "User"}
            </p>
            <p className="mt-1 break-all text-xs text-gray-500">
              {profile.email || "Account email"}
            </p>
          </div>
        </aside>

        <main className="space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Keep your account information up to date.
                </p>
              </div>

              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Name</span>
                <input
                  type="text"
                  value={profile.name}
                  disabled={!editing || saving}
                  onChange={(event) =>
                    setProfile({ ...profile, name: event.target.value })
                  }
                  placeholder="Your name"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black disabled:bg-gray-50 disabled:text-gray-500"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Email</span>
                <input
                  type="email"
                  value={profile.email}
                  disabled={!editing || saving}
                  onChange={(event) =>
                    setProfile({ ...profile, email: event.target.value })
                  }
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black disabled:bg-gray-50 disabled:text-gray-500"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-gray-700">Phone</span>
                <input
                  type="tel"
                  value={profile.phone}
                  disabled={!editing || saving}
                  onChange={(event) =>
                    setProfile({ ...profile, phone: event.target.value })
                  }
                  placeholder="Your phone number"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black disabled:bg-gray-50 disabled:text-gray-500"
                />
              </label>
            </div>

            {editing && (
              <div className="mt-6 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Account Security</h2>
            <p className="mt-1 text-sm text-gray-500">
              Keep your account protected with a strong password.
            </p>

            <button
              type="button"
              className="mt-5 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Change Password
            </button>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Account Settings</h2>
            <div className="mt-5 divide-y">
              <div className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-medium text-gray-900">Order History</p>
                  <p className="mt-1 text-sm text-gray-500">
                    View and manage your previous orders.
                  </p>
                </div>
                <a
                  href="/orders"
                  className="shrink-0 text-sm font-semibold text-gray-900 underline"
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