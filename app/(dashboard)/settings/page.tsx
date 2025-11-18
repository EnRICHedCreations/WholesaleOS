"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow">
          <div className="px-8 py-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>

          <div className="px-8 py-6 space-y-8">
            {/* Profile Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Profile
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={session.user?.name || ""}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={session.user?.email || ""}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Notification Preferences
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Alerts</p>
                    <p className="text-sm text-gray-500">
                      Receive email notifications for high-score properties
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-5 w-5 text-indigo-600 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alert Threshold
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    defaultValue="80"
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Get alerts for properties scoring above this threshold
                  </p>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Account
              </h2>
              <div className="space-y-4">
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
