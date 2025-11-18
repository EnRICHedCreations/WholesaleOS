import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to WholesaleOS Elite!
          </h1>
          <p className="text-gray-600 mb-6">
            Hello, {session.user?.name || session.user?.email}!
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Getting Started
            </h2>
            <p className="text-blue-700">
              Your dashboard is ready! Next steps:
            </p>
            <ul className="list-disc list-inside text-blue-700 mt-2 space-y-1">
              <li>Create your first market to monitor</li>
              <li>Configure your alert preferences</li>
              <li>Start discovering high-value properties</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Properties
              </h3>
              <p className="text-3xl font-bold text-indigo-600">0</p>
              <p className="text-sm text-gray-500 mt-1">Total properties found</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Markets
              </h3>
              <p className="text-3xl font-bold text-indigo-600">0</p>
              <p className="text-sm text-gray-500 mt-1">Active markets</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Alerts
              </h3>
              <p className="text-3xl font-bold text-indigo-600">0</p>
              <p className="text-sm text-gray-500 mt-1">Unread alerts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
