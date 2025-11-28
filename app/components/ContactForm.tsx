"use client";

import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function ContactForm() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    // get recaptcha token
    const token = recaptchaRef.current?.getValue();

    if (!token) {
      setStatus("⚠️ Please complete the reCAPTCHA!");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          message,
          token,
        }),
      });

      const data = await res.json();
      console.log("Received data:", { name, email, message, token });

      if (!res.ok) {
        setStatus("❌ Something went wrong. Try again.");
      } else {
        setStatus("✅ Message sent successfully!");
        setFirstName("");
        setLastName("");
        setEmail("");
        setMessage("");
        recaptchaRef.current?.reset();
      }

      console.log("reCAPTCHA response:", data);

    } catch (err) {
      console.error(err);
      setStatus("❌ Server error.");
    }

    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto">

        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full p-3 border rounded-lg"
            />

            {/* Last Name */}
            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full p-3 border rounded-lg"
            />
        </div>


      {/* Email */}
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-3 border rounded-lg"
      />

      {/* Message */}
      <textarea
        placeholder="Your Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        className="w-full p-3 h-32 border rounded-lg"
      />

      {/* reCAPTCHA */}
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        ref={recaptchaRef}
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {submitting ? "Sending..." : "Send Message"}
      </button>

      {/* Status message */}
      {status && (
        <p
          className={`text-center font-medium ${
            status.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {status}
        </p>
      )}
    </form>
  );
}
