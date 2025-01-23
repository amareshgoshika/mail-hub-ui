import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { CreditCard, Clock, XCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import 'firebase/firestore';

function SubscriptionManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pricingPlan, setPricingPlan] = useState(null);
  const [renewalDate, setRenewalDate] = useState(null);
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const senderEmail = localStorage.getItem('userEmail');

    const fetchPaymentHistory = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_GET_PAYMENT_HISTORY}?senderEmail=${senderEmail}`);
        const data = await response.json();
        if (data.paymentHistory) {
          setPaymentHistory(data.paymentHistory);
        }
      } catch (error) {
        console.error('Error fetching payment history:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserDetails = async (senderEmail) => {

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_GETUSERDETAILS_URL}?email=${senderEmail}`
        );
        setPricingPlan(response.data.pricingPlan);
        setRenewalDate(response.data.renewalDate);
        setIsSubscriptionActive(response.data.subscriptionStatus);
        fetchUserAccounts(response.data.pricingPlan);
  
      } catch (error) {
        console.error("Error user details", error);
      }
    };

    const fetchUserAccounts = async (planName) => {

      try {
        const accountResponse = await axios.get(
          `${process.env.REACT_APP_GET_USER_ACCOUNTS_URL}?planName=${planName}`
        );
        setPrice(accountResponse.data.price);
  
      } catch (error) {
        console.error("Error user details", error);
      }
    };

    fetchUserDetails(senderEmail);
    fetchPaymentHistory();
  }, []);

  const formatTransactionDate = (datevalue) => {
    const milliseconds = datevalue._seconds * 1000;
    const date = new Date(milliseconds);
    const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    return formattedDate;
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
            {isSubscriptionActive === true && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-semibold text-gray-800">Current Plan</h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Active
                  </span>
                </div>
              </div>
            )}

            <div className="grid gap-6">
              <div className="flex items-start space-x-4">
                <CreditCard className="w-6 h-6 text-indigo-600" />
                <div>
                  <h3 className="font-medium text-gray-900 uppercase">{pricingPlan}</h3>
                  <p className="text-gray-500">{price} / month</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-indigo-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Billing Cycle</h3>
                  <p className="text-gray-500">Monthly</p>
                  <p className="text-sm text-gray-500">Next billing date: {renewalDate}</p>
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
                    // onClick={handleCancelSubscription}
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
            {loading ? (
              <p>Loading payment history...</p>
            ) : (
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
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentHistory.map((payment, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTransactionDate(payment.transactionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.planName.toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold ">
                      ${payment.price / 100}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
        )}
      </div>
    </div>
    );
}

export default SubscriptionManagement;