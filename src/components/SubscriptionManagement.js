import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Clock, XCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

function SubscriptionManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(true);

  const subscriptionDetails = {
    plan: 'Professional Plan',
    price: '$29.99',
    billingCycle: 'Monthly',
    nextBilling: '2024-04-15',
    status: 'Active',
  };

  const paymentHistory = [
    { date: '2024-03-15', amount: '$29.99', status: 'Paid', id: '#INV-2024-001' },
    { date: '2024-02-15', amount: '$29.99', status: 'Paid', id: '#INV-2024-002' },
    { date: '2024-01-15', amount: '$29.99', status: 'Paid', id: '#INV-2024-003' },
  ];

  const handleCancelSubscription = () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      setIsSubscriptionActive(false);
    }
  };

    return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white text-black  py-6">
        <div className="max-w-1xl mx-auto px-4">
          <button
            onClick={() => navigate('/?tab=Account')}
            className="flex items-center text-black mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Plans
          </button>
          <h1 className="text-3xl font-bold">Subscription Management</h1>
        </div>
      </div>

      <div className="max-w-1xl mx-auto px-4 py-8">
        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-4 px-4 ${
              activeTab === 'details'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-indigo-600'
            }`}
          >
            Subscription Details
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-4 px-4 ${
              activeTab === 'history'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-indigo-600'
            }`}
          >
            Payment History
          </button>
        </div>

        {activeTab === 'details' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Current Plan</h2>
              {isSubscriptionActive && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Active
                </span>
              )}
            </div>

            <div className="grid gap-6">
              <div className="flex items-start space-x-4">
                <CreditCard className="w-6 h-6 text-indigo-600" />
                <div>
                  <h3 className="font-medium text-gray-900">{subscriptionDetails.plan}</h3>
                  <p className="text-gray-500">{subscriptionDetails.price} / month</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-indigo-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Billing Cycle</h3>
                  <p className="text-gray-500">{subscriptionDetails.billingCycle}</p>
                  <p className="text-sm text-gray-500">Next billing date: {subscriptionDetails.nextBilling}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => navigate('/?tab=Account')}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Change Plan
                </button>
                {isSubscriptionActive && (
                  <button
                    onClick={handleCancelSubscription}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Subscription
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="lg:min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentHistory.map((payment, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    );
}

export default SubscriptionManagement;