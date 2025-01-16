import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Mail, Users, Zap, Shield, ArrowRight, CheckCircle2, Star } from 'lucide-react';


function Home() {
  const [plans, setPlans] = useState([]);
    const navigate = useNavigate();
    const handleLogin = () => navigate("/login");

    const fetchPricingPlans = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_FETCH_PRICING_PLANS_URL
        );
        const plansArray = Object.values(response.data.pricingPlans);
        setPlans(plansArray);
      } catch (error) {
        console.error("Error fetching mail formats:", error);
      }
    };

    useEffect(() => {
      fetchPricingPlans();
    }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-20">

      {/* Rest of the content remains the same */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              Send Bulk Emails with
              <span className="text-indigo-600"> Ease</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
              Streamline your email campaigns with our powerful bulk email sender. Reach multiple recipients efficiently and professionally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
             onClick={handleLogin}>
                Start Now
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="bg-white p-4 md:p-8 rounded-2xl shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=800&q=80"
              alt="Email Marketing"
              className="rounded-lg w-full"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12 md:mb-16">
            Why Choose MailEasy?
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50">
              <div className="bg-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-gray-600">
                Send thousands of emails in minutes with our optimized delivery system.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50">
              <div className="bg-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure & Reliable</h3>
              <p className="text-gray-600">
                Your data is protected with enterprise-grade security measures.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 sm:col-span-2 md:col-span-1">
              <div className="bg-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Management</h3>
              <p className="text-gray-600">
                Effortlessly manage your recipient lists with our intuitive interface.
              </p>
            </div>
          </div>
        </div>
      </div>

{/* Pricing Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Choose the perfect plan for your email marketing needs. All plans include our core features.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-8 rounded-2xl shadow-lg ${
                plan.name === "pro"
                  ? "bg-indigo-600 text-white transform hover:-translate-y-1 transition-all"
                  : "bg-white border-2 border-transparent hover:border-indigo-100 transition-all"
              }`}
            >
              {plan.name === "pro" && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Most Popular
                </div>
              )}
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
                  plan.name === "pro"
                    ? "bg-white text-indigo-600 hover:bg-indigo-50"
                    : "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                } transition-colors`}
                onClick={() => alert(`This feature is not available currently. Please contact support.`)}
              >
                {plan.price === "Contact Sales" ? "Contact Sales" : "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Everything You Need for Successful Email Campaigns
            </h2>
            <div className="space-y-4">
              {[
                'Bulk email sending with high deliverability',
                'CSV/TXT file upload support',
                'Easy recipient list management',
                'Professional email composer',
                'Real-time delivery tracking',
                'Secure and reliable platform'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-4 md:p-8 rounded-2xl shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
              alt="Email Campaign Success"
              className="rounded-lg w-full"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">
            Ready to Streamline Your Email Campaigns?
          </h2>
          <p className="text-indigo-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users who trust MailEasy for their bulk email needs.
          </p>
          <button className="w-full sm:w-auto bg-white text-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors font-semibold">
            Get Started for Free
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Mail className="w-6 h-6" />
              <span className="text-xl font-bold text-white">MailEasy</span>
            </div>
            <div className="text-sm text-center sm:text-right">
              © {new Date().getFullYear()} MailEasy. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;