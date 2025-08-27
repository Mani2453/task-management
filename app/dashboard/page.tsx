import React from 'react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Total Tasks</h2>
            <div className="text-2xl font-bold text-blue-600">--</div>
          </div>
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Completed Tasks</h2>
            <div className="text-2xl font-bold text-green-600">--</div>
          </div>
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Overdue Tasks</h2>
            <div className="text-2xl font-bold text-red-600">--</div>
          </div>
        </div>
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-2">
            <li className="text-gray-500">No recent activity yet.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
