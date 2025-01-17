import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CreditCard,
  Lock,
  Package,
  User,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';

function AccountPage() {
  const [name, setName] = useState(null);
  const [creditsUsed, setCreditsUsed] = useState(null);
  const [phone, setPhone] = useState(null);
  const [planName, setPlanName] = useState(null);
  const [price, setPrice] = useState(null);
  const [emailsPerDay, setEmailsPerDay] = useState(null);
  const [, setEmailsPerMonth] = useState(null);
  const [pricingPlan, setPricingPlan] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
  });
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (isFetched) return;
    const senderEmail = localStorage.getItem("userEmail");
    const fetchUserDetails = async (senderEmail) => {

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_GETUSERDETAILS_URL}?email=${senderEmail}`
        );
        setName(response.data.name);
        setCreditsUsed(response.data.credits);
        setPhone(response.data.phone);
        setPlanName(response.data.pricingPlan);
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
      setEmailsPerDay(accountResponse.data.emailsPerDay);
      setEmailsPerMonth(accountResponse.data.emailsPerMonth);
      setPrice(accountResponse.data.price);

    } catch (error) {
      console.error("Error user details", error);
    }
  };
  
    if (senderEmail) {
      setFormData((prevState) => ({
        ...prevState,
        email: senderEmail,
      }));
      fetchUserDetails(senderEmail);
      fetchPricingPlans();
      setIsFetched(true);
    }
  }, [isFetched, emailsPerDay, planName]);

  const fetchPricingPlans = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_FETCH_PRICING_PLANS_URL
      );
      const plansArray = Object.values(response.data.pricingPlans);
      setPricingPlan(plansArray);
    } catch (error) {
      console.error("Error fetching mail formats:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Profile Section */}
          <div className="col-span-2 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-indigo-900">
              Profile Information
            </h2>
            <div className="mt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{phone}</p>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <button className="inline-flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <Lock className="h-4 w-4" />
                  <span>Change Password</span>
                </button>
              </div>
            </div>
          </div>

          {/* Credits Section */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-indigo-900">
              Credits Overview
            </h2>
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Available Credits today</span>
                  <span className="font-medium text-indigo-600">
                    {emailsPerDay - creditsUsed}
                  </span>
                </div>
                <div className="relative h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="absolute left-0 top-0 h-full bg-indigo-600 transition-all duration-300"
                    style={{
                      width: `${(creditsUsed / emailsPerDay) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {creditsUsed} Used
                  </span>
                  <span className="text-gray-500">
                    {emailsPerDay} Total
                  </span>
                </div>
              </div>
              {creditsUsed === emailsPerDay && (
                <button className="inline-flex w-full items-center justify-center space-x-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <CreditCard className="h-4 w-4" />
                <span>Purchase Credits</span>
              </button>
              )}
            </div>
          </div>

          {/* Current Plan Section */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-indigo-900">
              Current Subscription
            </h2>
            <div className="mt-6 space-y-6">
              <div className="rounded-lg bg-indigo-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-indigo-900">
                    {planName?.toUpperCase()}
                    </h4>
                    <p className="text-sm text-indigo-600">
                      ${price}/month
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Next Renewal</p>
                    <p className="font-medium">Currently not available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Plans Section */}
        <div className="col-span-2 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-indigo-900">Available Plans</h2>
          <div className="mt-6">

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlan.map((plan) => (
            <div
              key={plan.name}
              className={`p-8 rounded-2xl shadow-lg
                   "bg-white border-2 border-transparent hover:border-indigo-100 transition-all" `}
            >
              <h3 className="text-xl font-semibold mb-2">{plan.name?.toUpperCase()}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">
                  {typeof plan.price === "number" ? `$${plan.price}` : plan.price}
                </span>
                {plan.billingCycle !== "custom" && <span className="text-gray-600">/month</span>}
              </div>
              <ul className="space-y-4 mb-8 text-gray-900">
                <li>Emails per Day: {plan.emailsPerDay}</li>
                <li>Emails per Month: {plan.emailsPerMonth}</li>
                <li>Templates: {plan.templates}</li>
                <li>AI Rewrites: {plan.aiRewrites}</li>
                <li>Customer Support: {plan.customerSupport}</li>
              </ul>
              <button
                className={`w-full px-6 py-2 rounded-lg font-semibold ${
                  plan.name === planName
                    ? "bg-indigo-600 text-white cursor-default"
                    : "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                } transition-colors`}
                disabled={plan.name === planName}
                onClick={() => {
                  if (plan.name !== planName) alert(`This feature is not available currently. Please contact support.`);
                }}
              >
                {plan.name === planName ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          ))}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;