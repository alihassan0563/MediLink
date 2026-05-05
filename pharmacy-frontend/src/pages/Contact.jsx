import React, { useState } from "react";
import Header from "../component/Header";
import contactImage from "../assets/logo.jpg";
import "./Contact.css";
import API_BASE_URL from "../api";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });

    if (!name || !email || !subject || !message) {
      setStatus({ type: "error", text: "Please fill in all fields." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const contentType = response.headers.get("content-type") || "";
      let payload;
      try {
        if (contentType.includes("application/json")) {
          payload = await response.json();
        } else {
          const text = await response.text();
          payload = { message: text };
        }
      } catch (parseErr) {
        const text = await response.text().catch(() => "");
        payload = { message: text };
      }

      if (!response.ok) {
        throw new Error(
          payload.error || payload.message || "Submission failed",
        );
      }

      setStatus({
        type: "success",
        text: payload.message || "Thanks! Your message has been sent.",
      });
      resetForm();
    } catch (err) {
      setStatus({
        type: "error",
        text: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <Header />

      <section className="contact-hero-section">
        <div className="contact-hero-container">
          <div className="contact-hero-right">
            <h1 className="contact-hero-title">
              Get in Touch with <span className="highlight">Our Team</span>
            </h1>
            <p className="contact-hero-subtitle">
              Have questions, feedback, or need assistance with your medicine
              requests? Our dedicated team at MediLink is always ready to
              support you. We're committed to providing exceptional customer
              service and ensuring your healthcare needs are met with care and
              professionalism.
            </p>
            <div className="contact-hero-features">
              <div className="contact-feature">
                <div className="contact-feature-icon">
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <span>24/7 Customer Support</span>
              </div>
              <div className="contact-feature">
                <div className="contact-feature-icon">
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <span>Quick Response Time</span>
              </div>
              <div className="contact-feature">
                <div className="contact-feature-icon">
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <span>Expert Healthcare Guidance</span>
              </div>
            </div>
          </div>
          <div className="contact-hero-left">
            <div className="contact-hero-image">
              <img
                src="/contact image.jpg"
                alt="Professional customer service team"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="contact-grid full-width-section">
        <div className="contact-card">
          <div className="icon-circle" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="#fff"
                d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 18V8.236l7.386 6.275a1 1 0 001.228 0L20 8.236V18H4z"
              />
            </svg>
          </div>
          <h3>Email</h3>
          <a className="value-link" href="mailto:alihassan940210@gmail.com">
            alihassan940210@gmail.com
          </a>
        </div>

        <div className="contact-card">
          <div className="icon-circle" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="#fff"
                d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1 17 17 0 01-17-17 1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z"
              />
            </svg>
          </div>
          <h3>Phone</h3>
          <a className="value-link" href="tel:+923462240103">
            +92 3462240103
          </a>
        </div>

        <div className="contact-card">
          <div className="icon-circle" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="#fff"
                d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
              />
            </svg>
          </div>
          <h3>Office</h3>
          <p>Govt.Jinnah Islamia College Sialkot</p>
          <p className="muted">Mon–Fri, 9:00 AM – 6:00 PM</p>
        </div>
      </section>

      <section
        id="contact-form"
        className="contact-form-section full-width-section"
      >
        <div className="form-wrapper">
          <div className="form-visual">
            <img src="/contant image.jpg" alt="Contact" />
          </div>
          <div className="form-content">
            <p className="form-subtitle">
              Fill the form below and our team will get back to you shortly.
            </p>

            {status.text && (
              <div className={`form-status ${status.type}`}>{status.text}</div>
            )}

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  type="text"
                  placeholder="How can we help?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Message</label>
                <textarea
                  id="message"
                  rows="5"
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button
                className="submit-button"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
