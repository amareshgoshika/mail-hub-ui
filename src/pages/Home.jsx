import React from "react";
import { useNavigate } from "react-router-dom";

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

/* Position the bubble container behind everything */
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

/* Container utility */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  position: relative;
  z-index: 1;
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

/* HERO SECTION */
.hero-wrapper {
  padding-top: 40px;
  margin-bottom: 40px;
}
.hero-card {
  background: #fff;
  border-radius: 12px;
  padding: 40px 24px;
  box-shadow:
    0 4px 12px rgba(0,0,0,0.08),
    0 2px 4px rgba(0,0,0,0.06);
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 1s ease forwards;
}
.dark-body .hero-card {
  background: #2d3748;
  color: #f1f5f9;
}

/* Hero grid */
.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: center;
}
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
  }
}

/* Hero text */
.hero-text {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
}
.hero-title {
  font-size: 36px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}
.dark-body .hero-title {
  color: #fff;
}
.hero-subtitle {
  font-size: 16px;
  color: #697386;
  line-height: 1.6;
}
.dark-body .hero-subtitle {
  color: #cbd5e1;
}
.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 8px;
}
.hero-button {
  background-color: #5469d4;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s, transform 0.2s;
  box-shadow:
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
    #5469d4 0px 0px 0px 1px,
    rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;
}
.hero-button:hover {
  background-color: #4458b3;
  transform: translateY(-1px);
}

/* Hero image */
.hero-image {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  opacity: 0;
  transform: translateY(15px);
  animation: fadeInUp 1.2s ease forwards;
}

/* Fade in animation */
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* CARD SECTIONS (ABOUT, SERVICES, ETC.) */
.card-section {
  background: #fff;
  border-radius: 8px;
  padding: 40px 24px;
  margin-bottom: 40px;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.06);
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 1s ease forwards;
}

.dark-body,
.light-body {
  padding-bottom: 40px;  /* or whatever gap you want */
}
  
.dark-body .card-section {
  background: #2d3748;
  color: #f1f5f9;
}
.section-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #333;
}
.dark-body .section-title {
  color: #ffffff;
}
.card-section p {
  font-size: 16px;
  color: #697386;
  line-height: 1.6;
}
.dark-body .card-section p {
  color: #cbd5e1;
}

/* Services grid */
.services-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-top: 24px;
}
@media (min-width: 768px) {
  .services-list {
    grid-template-columns: repeat(3, 1fr);
  }
}
.service-item {
  background-color: #f9fafc;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.06);
}
.service-item:hover {
  transform: translateY(-3px);
  box-shadow:
    0 8px 12px rgba(0,0,0,0.08),
    0 4px 6px rgba(0,0,0,0.06);
}
.dark-body .service-item {
  background-color: #4a5568;
}
.service-item h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}
.dark-body .service-item h3 {
  color: #f1f5f9;
}
.service-item p {
  font-size: 14px;
  color: #697386;
}
.dark-body .service-item p {
  color: #cbd5e1;
}

/* PRICING CARDS */
.pricing-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-top: 24px;
}
@media (min-width: 768px) {
  .pricing-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}
.pricing-card {
  border: 1px solid #e3e8ee;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  background-color: #f9fafc;
  transition: transform 0.3s, box-shadow 0.3s;
}
.pricing-card:hover {
  transform: translateY(-3px);
  box-shadow:
    0 8px 12px rgba(0,0,0,0.08),
    0 4px 6px rgba(0,0,0,0.06);
}
.dark-body .pricing-card {
  border: 1px solid #4a5568;
  background-color: #4a5568;
}
.pricing-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}
.dark-body .pricing-card h3 {
  color: #f1f5f9;
}
.pricing-amount {
  font-size: 20px;
  font-weight: 700;
  color: #5469d4;
  margin-bottom: 16px;
}
.dark-body .pricing-amount {
  color: #9faafa;
}
.pricing-features {
  list-style-type: none;
  margin-bottom: 16px;
  padding-left: 0;
}
.pricing-features li {
  font-size: 14px;
  color: #697386;
  margin: 4px 0;
}
.dark-body .pricing-features li {
  color: #cbd5e1;
}
.pricing-button {
  background-color: #5469d4;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 16px;
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
.pricing-button:hover {
  background-color: #4458b3;
}

/* CONTACT DETAILS */
.contact-details {
  font-size: 14px;
  color: #697386;
  line-height: 1.6;
  margin-top: 16px;
}
.dark-body .contact-details {
  color: #cbd5e1;
}
.contact-details strong {
  color: #333;
}
.dark-body .contact-details strong {
  color: #ffffff;
}
`;

function WelcomePage() {
  const navigate = useNavigate();

  // Read from localStorage on component mount:
  const [darkMode, setDarkMode] = React.useState(() => {
    const storedTheme = localStorage.getItem("darkMode");
    // if storedTheme is "true", return true; else false
    return storedTheme === "true";
  });

  // Toggle dark mode and store in localStorage
  function toggleDarkMode() {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", (!prev).toString());
      return !prev;
    });
  }

  // Navigate to login or register
  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register");

  return (
    <>
      {/* Inject all styles */}
      <style>{inlineStyles}</style>

      {/* Top-level container: light-body or dark-body */}
      <div className={darkMode ? "dark-body" : "light-body"}>
        {/* Bubble container behind everything */}
        <div className="bubble-container">
          <div className="bubble bubble1" />
          <div className="bubble bubble2" />
          <div className="bubble bubble3" />
          <div className="bubble bubble4" />
          <div className="bubble bubble5" />
        </div>

        {/* Dark/Light Mode Toggle Button */}
        <button className="darkmode-toggle" onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        {/* HERO */}
        <section className="hero-wrapper">
          <div className="container hero-card">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Welcome to the Project</h1>
                <p className="hero-subtitle">
                  A modern platform that makes it easy to manage your emails,
                  credentials, and more. Sign up or log in to get started!
                </p>
                <div className="hero-buttons">
                  <button className="hero-button" onClick={handleLogin}>
                    Login
                  </button>
                  <button className="hero-button" onClick={handleRegister}>
                    Register
                  </button>
                </div>
              </div>

              <img
                src="https://images.pexels.com/photos/30101199/pexels-photo-30101199/free-photo-of-creative-sticker-collection-emerging-from-envelope.jpeg"
                alt="Hero"
                className="hero-image"
              />
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="container card-section">
          <h2 className="section-title">What We Do</h2>
          <p>
            We provide a secure and reliable platform to handle all your email
            sending needs. Whether it’s single or bulk uploads through CSV
            files, attachments, or custom mail formats, our service streamlines
            your workflow so you can focus on what matters most.
          </p>
        </section>

        {/* SERVICES */}
        <section className="container card-section">
          <h2 className="section-title">Services</h2>
          <div className="services-list">
            <div className="service-item">
              <h3>Email Management</h3>
              <p>
                Effortlessly manage your email recipients, bulk CSV imports, and
                attachments.
              </p>
            </div>
            <div className="service-item">
              <h3>Credential Security</h3>
              <p>
                Upload and store your credentials securely, ensuring seamless
                authentication.
              </p>
            </div>
            <div className="service-item">
              <h3>Custom Mail Formats</h3>
              <p>
                Create and maintain multiple reusable mail templates tailored to
                your business.
              </p>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="container card-section">
          <h2 className="section-title">Pricing</h2>
          <div className="pricing-cards">
            <div className="pricing-card">
              <h3>Basic</h3>
              <div className="pricing-amount">$0 / month</div>
              <ul className="pricing-features">
                <li>Up to 100 emails/day</li>
                <li>Limited mail formats</li>
                <li>Basic support</li>
              </ul>
              <button className="pricing-button">Get Started</button>
            </div>
            <div className="pricing-card">
              <h3>Pro</h3>
              <div className="pricing-amount">$29 / month</div>
              <ul className="pricing-features">
                <li>Up to 1,000 emails/day</li>
                <li>Unlimited mail formats</li>
                <li>Priority support</li>
              </ul>
              <button className="pricing-button">Choose Pro</button>
            </div>
            <div className="pricing-card">
              <h3>Enterprise</h3>
              <div className="pricing-amount">Custom</div>
              <ul className="pricing-features">
                <li>Unlimited emails</li>
                <li>Dedicated account manager</li>
                <li>24/7 support</li>
              </ul>
              <button className="pricing-button">Contact Sales</button>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="container card-section">
          <h2 className="section-title">Contact Us</h2>
          <p>If you have any questions or concerns, feel free to reach out:</p>
          <div className="contact-details">
            <p>
              Email: <strong>support@myproject.com</strong> <br />
              Phone: <strong>+1 (123) 456-7890</strong>
            </p>
            <p>We’re here to help you streamline your email workflow!</p>
          </div>
        </section>
      </div>
    </>
  );
}

export default WelcomePage;
