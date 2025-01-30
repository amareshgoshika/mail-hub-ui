import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import {
  CreditCard,
  Lock,
  Package,
  User,
  Phone,
  Mail,
  Users,
  Edit3,
} from 'lucide-react';
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function AccountPage() {
  const navigate = useNavigate();
  const [name, setName] = useState(null);
  const [creditsUsed, setCreditsUsed] = useState(null);
  const [phone, setPhone] = useState(null);
  const [planName, setPlanName] = useState(null);
  const [price, setPrice] = useState(null);
  const [emailsPerDay, setEmailsPerDay] = useState(null);
  const [emailsPerMonth, setEmailsPerMonth] = useState(null);
  const [aiRewrites, setaiRewrites] = useState(null);
  const [aiRewritesUsed, setaiRewritesUsed] = useState(null);
  const [pricingPlan, setPricingPlan] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
  });
  const [isFetched, setIsFetched] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedPhone, setEditedPhone] = useState(phone);

  useEffect(() => {
    if (isFetched) return;
    const params = new URLSearchParams(window.location.search);
    const planName = params.get("planName");
    const sessionId = params.get("session_id");
    const tab = params.get("tab");
    const senderEmail = localStorage.getItem("userEmail");

    if (sessionId && tab === "Account") {
      axios.post(`${process.env.REACT_APP_UPGRADE_PRICING_PLAN}`, { planName, senderEmail, sessionId })
        .then((response) => {
          console.log("Payment successful, Firebase updated:", response.data);
          navigate("/");
        })
        .catch((error) => {
          console.error("Error updating Firebase:", error);
        });
    }

    
    const fetchUserDetails = async (senderEmail) => {

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_GETUSERDETAILS_URL}?email=${senderEmail}`
        );
        setName(response.data.name);
        setCreditsUsed(response.data.credits);
        setPhone(response.data.phone);
        setPlanName(response.data.pricingPlan);
        setaiRewritesUsed(response.data.aiRewrites);
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
      setaiRewrites(accountResponse.data.aiRewrites);
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
  }, [isFetched, emailsPerDay, planName, navigate]);

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

  const handleUpgrade = async (plan, planName) => {
    try {
      const stripe = await stripePromise;
      const userEmail = localStorage.getItem("userEmail");

      if (!userEmail) {
        alert("User email is missing. Please log in again.");
        return;
      }

      const response = await axios.post(
        process.env.REACT_APP_CREATE_CHECKOUT_SESSION_URL,
        { 
          planId: plan,
          userEmail: userEmail,
          planName: planName,
         }
      );

      const { sessionId } = response.data;

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error("Stripe Checkout error:", error.message);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setEditedName(value);
    } else if (name === 'phone') {
      setEditedPhone(value);
    }
  };

  const handleCancel = () => {
    setEditedName(name);
    setEditedPhone(phone);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL_HTTPS}/api/update-profile`, {
        name: editedName,
        phone: editedPhone,
        email: formData.email,
      });

      if (response.status === 200) {
        setName(editedName);
        setPhone(editedPhone);
        setIsEditing(false);
        alert('Profile updated successfully! Refresh the page.');
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Profile Section */}
          <div className="col-span-2 rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-indigo-900">
                Profile Information
              </h2>
              <button
                className="text-gray-500 hover:text-indigo-600"
                onClick={toggleEdit}
              >
                <Edit3 className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={name}
                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="font-medium">{name}</p>
                    )}
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
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={phone}
                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="font-medium">{phone}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => navigate('/?tab=ChangePassword')}
                  className="inline-flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <Lock className="h-4 w-4" />
                  <span>Change Password</span>
                </button>

                {isEditing && (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center space-x-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

          <div class="flex flex-col md:flex-row gap-4">
            {/* Credits Section */}
            <div className="rounded-lg bg-white p-6 shadow-sm flex-1">
              <h2 className="text-xl font-bold text-indigo-900">
                Credits Overview
              </h2>
              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Available Credits</span>
                    <span className="font-medium text-indigo-600">
                      {emailsPerMonth - creditsUsed}
                    </span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="absolute left-0 top-0 h-full bg-indigo-600 transition-all duration-300"
                      style={{
                        width: `${(creditsUsed / emailsPerMonth) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      {creditsUsed} Used
                    </span>
                    <span className="text-gray-500">
                      {emailsPerMonth} Total
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Available AI Rewrites</span>
                    <span className="font-medium text-indigo-600">
                      {aiRewrites - aiRewritesUsed}
                    </span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="absolute left-0 top-0 h-full bg-indigo-600 transition-all duration-300"
                      style={{
                        width: `${(aiRewritesUsed / aiRewrites) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      {aiRewritesUsed} Used
                    </span>
                    <span className="text-gray-500">
                      {aiRewrites} Total
                    </span>
                  </div>
                </div>
                {creditsUsed === emailsPerMonth && (
                  <button className="inline-flex w-full items-center justify-center space-x-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Purchase Credits</span>
                </button>
                )}
              </div>
            </div>

            {/* Current Plan Section */}
            <div className="rounded-lg bg-white p-6 shadow-sm flex-1">
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
                <div className="mt-12 text-center">
                  <button
                    onClick={() => navigate('/?tab=SubscriptionManagement')}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Manage Your Subscription
                  </button>
                </div>
              </div>
            </div>
          </div>

        {/* Available Plans Section */}
        <div className="col-span-2 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-indigo-900">Available Plans</h2>
          <div className="mt-6">

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlan
          .filter((plan) => plan.name !== "welcome")
          .map((plan) => (
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
                  if (plan.name !== planName) handleUpgrade(plan.stripePriceID, plan.name);
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