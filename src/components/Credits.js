import React from 'react';
import { CreditCard, TrendingUp, Mail, AlertCircle } from 'lucide-react';

export function Credits() {
  const creditInfo = {
    available: 5000,
    used: 2500,
    nextRenewal: '2024-04-01',
  };

  const recentActivity = [
    { id: 1, type: 'Campaign', description: 'Monthly Newsletter', credits: -500, date: '2024-03-15' },
    { id: 2, type: 'Purchase', description: 'Credit Top-up', credits: 1000, date: '2024-03-10' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Email Credits</h2>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-semibold">Available Credits</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{creditInfo.available.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-semibold">Used Credits</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{creditInfo.used.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-semibold">Next Renewal</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{new Date(creditInfo.nextRenewal).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center gap-3">
                {activity.type === 'Campaign' ? (
                  <Mail className="w-5 h-5 text-gray-500" />
                ) : (
                  <CreditCard className="w-5 h-5 text-gray-500" />
                )}
                <div>
                  <p className="font-medium text-gray-900">{activity.description}</p>
                  <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                </div>
              </div>
              <span
                className={`font-medium ${
                  activity.credits > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {activity.credits > 0 ? '+' : ''}{activity.credits} credits
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-yellow-800">Low Credits Alert</h4>
          <p className="text-sm text-yellow-700">
            Your credits are running low. Consider purchasing more credits to ensure uninterrupted service.
          </p>
        </div>
      </div>
    </div>
  );
}