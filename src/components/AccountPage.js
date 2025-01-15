import React, { useState, useEffect } from "react";
import axios from "axios";

function AccountPage() {
  const [name, setName] = useState(null);
  const [password, setPassword] = useState(null);
  const [phone, setPhone] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
  });

  useEffect(() => {
    const senderEmail = localStorage.getItem("userEmail");
    if (senderEmail) {
      setFormData((prevState) => ({
        ...prevState,
        email: senderEmail,
      }));

      const fetchUserDetails = async () => {
        console.log(process.env.REACT_APP_GETUSERDETAILS_URL);

        try {
          const response = await axios.get(
            `${process.env.REACT_APP_GETUSERDETAILS_URL}?email=${senderEmail}`
          );
          setName(response.data.name);
          setPassword(response.data.password);
          setPhone(response.data.phone);
        } catch (error) {
          console.error("Error user details", error);
        }
      };
      fetchUserDetails();
    }
    }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen items-center bg-white px-4">
      <div className="bg-white w-full max-w-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Phone
            </label>
            <input
              type="phone"
              name="phone"
              value={phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Card Information</h3>
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-semibold">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="expirationDate" className="block text-sm font-semibold">
              Expiration Date
            </label>
            <input
              type="text"
              id="expirationDate"
              name="expirationDate"
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="cvv" className="block text-sm font-semibold">
              CVV
            </label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}

export default AccountPage;
