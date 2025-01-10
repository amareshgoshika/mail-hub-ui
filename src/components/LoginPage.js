import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * Inline styles with bubble background
 */
const inlineStyles = `
/* Reset default browser margins/padding */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
}

/* Light vs. Dark top-level containers */
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

/* Bubble container (same as WelcomePage) */
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

/* Bubble styling */
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

/* Dark mode toggle button (same style) */
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

/* Login container */
.login-container {
  position: relative;
  z-index: 1; /* Make sure it’s above the bubbles */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* Login card styling */
.login-card {
  background: #ffffff;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  padding: 32px;
  box-shadow:
    0 4px 12px rgba(0,0,0,0.08),
    0 2px 4px rgba(0,0,0,0.06);
}
.dark-body .login-card {
  background: #2d3748; /* Dark form container */
  color: #f1f5f9;
}

/* Form headings */
.login-card h2 {
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  color: #333;
}
.dark-body .login-card h2 {
  color: #fff;
}

/* Labels */
.login-card label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
}
.dark-body .login-card label {
  color: #cbd5e1;
}

/* Inputs */
.login-card input[type="email"],
.login-card input[type="password"] {
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  outline-color: rgba(84, 105, 212, 0.5);
  background-color: #fff;
  box-shadow: rgba(60, 66, 87, 0.16) 0px 0px 0px 1px;
}
.dark-body .login-card input[type="email"],
.dark-body .login-card input[type="password"] {
  background-color: #4a5568;
  color: #f1f5f9;
  box-shadow: none;
}

/* Submit button */
.login-card button[type="submit"] {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background-color: #5469d4;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  box-shadow:
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
    #5469d4 0px 0px 0px 1px,
    rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;
}
.login-card button[type="submit"]:hover {
  background-color: #4458b3;
}

/* Additional links */
.links-container {
  margin-top: 16px;
  text-align: center;
}
.links-container a {
  color: #5469d4;
  text-decoration: none;
  font-size: 14px;
}
.dark-body .links-container a {
  color: #9faafa;
}
.links-container a:hover {
  text-decoration: underline;
}
`;

function LoginPage() {
  const navigate = useNavigate();

  // Read theme from localStorage on mount:
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("darkMode");
    return storedTheme === "true";
  });

  const [formData, setFormData] = useState({ email: "", password: "" });

  // Toggle dark mode + store in localStorage
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", (!prev).toString());
      return !prev;
    });
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      // Replace with your actual login endpoint
      const response = await axios.post(process.env.REACT_APP_LOGIN_URL, {
        email,
        password,
      });

      if (response.data.message === "Login successful") {
        localStorage.setItem("userEmail", response.data.user.email);
        navigate("/sendEmail");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      if (error.response) {
        alert("Error: " + (error.response.data.message || error.message));
      } else if (error.request) {
        alert("No response from server. Please try again later.");
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  // Forgot password
  const handleForgotPassword = () => {
    alert("Forgot password flow goes here.");
  };

  // Handle sign up
  const handleSignUp = () => {
    navigate("/register");
  };

  return (
    <>
      {/* Inject bubble and form styles */}
      <style>{inlineStyles}</style>

      <div className={darkMode ? "dark-body" : "light-body"}>
        {/* Dark/Light Mode Toggle Button */}
        <button className="darkmode-toggle" onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        {/* Bubble container behind everything */}
        <div className="bubble-container">
          <div className="bubble bubble1" />
          <div className="bubble bubble2" />
          <div className="bubble bubble3" />
          <div className="bubble bubble4" />
          <div className="bubble bubble5" />
        </div>

        {/* Main login area */}
        <div className="login-container">
          <div className="login-card">
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button type="submit">Log In</button>
            </form>

            <div className="links-container">
              <p>
                <a href="#!" onClick={handleForgotPassword}>
                  Forgot your password?
                </a>
              </p>
              <p>
                Don’t have an account?{" "}
                <a href="#!" onClick={handleSignUp}>
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
