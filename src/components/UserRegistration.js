import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * Inline CSS with bubble background, dark mode, and
 * form styling to match the rest of your UI.
 */
const inlineStyles = `
/* RESET & BASE */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
    "Helvetica Neue", Ubuntu, sans-serif;
}

/* Light vs. Dark containers */
.light-body,
.dark-body {
  min-height: 100vh;
  position: relative;
  width: 100%;
}

/* Light background vs. Dark background */
.light-body {
  background: linear-gradient(to right, #f3f4f6, #e9ecf3);
}
.dark-body {
  background: #1f2937;
}

/* Bubbles behind the form */
.bubble-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}
.bubble {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
}
.bubble1 {
  width: 350px;
  height: 350px;
  background-color: #98c1d9;
  top: -120px;
  left: -120px;
}
.bubble2 {
  width: 200px;
  height: 200px;
  background-color: #f2cc8f;
  bottom: -60px;
  right: -60px;
}
.bubble3 {
  width: 300px;
  height: 300px;
  background-color: #dad7cd;
  top: 30%;
  left: 80%;
  transform: translate(-50%, -50%);
}
.bubble4 {
  width: 300px;
  height: 300px;
  background-color: #bbd0ff;
  bottom: 20%;
  left: -100px;
}
.bubble5 {
  width: 250px;
  height: 250px;
  background-color: #f9c6d4;
  top: 65%;
  right: 10%;
  transform: translateY(-50%);
}

/* Dark mode toggle button */
.darkmode-toggle {
  position: fixed;
  top: 16px;
  right: 16px;
  background-color: #5469d4;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow:
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
    #5469d4 0px 0px 0px 1px,
    rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;
  transition: background-color 0.2s ease-in-out, transform 0.3s ease;
  z-index: 999;
}
.darkmode-toggle:hover {
  background-color: #4458b3;
  transform: scale(1.05);
}

/* Registration wrapper */
.registration-wrapper {
  position: relative;
  z-index: 1; /* so it's above the bubbles */
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding-top: 40px;
  padding-bottom: 40px;
}

/* Registration container (card) */
.registration-container {
  width: 100%;
  max-width: 450px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.06);
  padding: 24px;
}
.dark-body .registration-container {
  background-color: #2d3748; 
  color: #f1f5f9;
  border: 1px solid #5e6672; /* a visible border in dark mode */
}

/* Registration title */
.registration-title {
  text-align: center;
  margin-bottom: 24px;
}
.registration-title h2 {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}
.dark-body .registration-title h2 {
  color: #fff;
}

/* Form fields */
.field {
  margin-bottom: 16px;
}
.field label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}
.dark-body .field label {
  color: #cbd5e1;
}
.field input[type="text"],
.field input[type="email"],
.field input[type="tel"],
.field input[type="password"] {
  width: 100%;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid #e3e8ee;
  outline-color: rgba(84, 105, 212, 0.5);
  background-color: #fff;
  color: #333;
  font-size: 14px;
}
.dark-body .field input[type="text"],
.dark-body .field input[type="email"],
.dark-body .field input[type="tel"],
.dark-body .field input[type="password"] {
  background-color: #4a5568;
  border: 1px solid #5e6672;
  color: #f1f5f9;
}

/* Submit button */
.submit-button {
  background-color: #5469d4;
  color: #fff;
  width: 100%;
  font-size: 14px;
  font-weight: 600;
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s ease-in-out;
  box-shadow:
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
    #5469d4 0px 0px 0px 1px,
    rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;
}
.submit-button:hover {
  background-color: #4458b3;
}
`;

function UserRegistration() {
  const navigate = useNavigate();

  // ======================
  // THEME (DARK/LIGHT)
  // ======================
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize from localStorage
    const storedTheme = localStorage.getItem("darkMode");
    return storedTheme === "true";
  });

  // Toggle and persist in localStorage
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", (!prev).toString());
      return !prev;
    });
  };

  // ======================
  // FORM FIELDS
  // ======================
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    try {
      await axios.post(process.env.REACT_APP_REGISTER_URL, dataToSubmit, {
        headers: { "Content-Type": "application/json" },
      });
      // Persist userEmail in localStorage
      localStorage.setItem("userEmail", formData.email);
      // Navigate to next page
      navigate("/credentialGenerate");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message || "User already registered.");
      } else {
        alert("An error occurred during registration. " + error.message);
      }
    }
  };

  return (
    <>
      <style>{inlineStyles}</style>
      <div className={darkMode ? "dark-body" : "light-body"}>
        {/* Dark/Light Mode Toggle Button */}
        <button className="darkmode-toggle" onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        {/* Bubble container */}
        <div className="bubble-container">
          <div className="bubble bubble1" />
          <div className="bubble bubble2" />
          <div className="bubble bubble3" />
          <div className="bubble bubble4" />
          <div className="bubble bubble5" />
        </div>

        {/* Main wrapper */}
        <div className="registration-wrapper">
          <div className="registration-container">
            <div className="registration-title">
              <h2>User Registration</h2>
            </div>
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="field">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Phone */}
              <div className="field">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Submit */}
              <button type="submit" className="submit-button">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserRegistration;
