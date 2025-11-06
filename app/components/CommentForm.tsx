"use client";

import { useState, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";


console.log("Client RECAPTCHA SITE KEY:", process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);
interface Comment {
  id: number;
  name: string;
  comment: string;
  created_at: string;
}

interface CommentFormProps {
  articleId: number;
}

const CommentForm: React.FC<CommentFormProps> = ({ articleId }) => {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Fetch existing comments for this article
  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/get_comment?articleId=${articleId}`);
      const data = await res.json();
      if (res.ok) setComments(data.comments);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

    // Optional: poll to make sure grecaptcha is ready
    useEffect(() => {
    const interval = setInterval(() => {
        if ((window as any).grecaptcha && (window as any).grecaptcha.getResponse) {
        clearInterval(interval);
        }
    }, 100);

    return () => clearInterval(interval);
    }, []);


  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

   // Check grecaptcha
    if (!(window as any).grecaptcha || !(window as any).grecaptcha.getResponse) {
        setMessage("⚠️ reCAPTCHA not ready. Refresh the page and try again.");
        setSubmitting(false);
        return;
    }

    const token = recaptchaRef.current?.getValue();
    if (!token) {
        setMessage("⚠️ Please complete the CAPTCHA.");
        setSubmitting(false);
        return;
    }


    try {
      const res = await fetch("/api/submit_comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, name, comment, token }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.error || "Failed to submit comment."}`);
      } else {
        setMessage("✅ Comment submitted successfully!");
        setName("");
        setComment("");
        recaptchaRef.current?.reset();
        fetchComments(); // refresh comments list
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong. Try again later.");
    }

    setSubmitting(false);
  };

  return (
    <div className="mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4">Leave a Comment</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        />

        <textarea
          placeholder="Your Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32"
          required
        />

        <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            ref={recaptchaRef}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {submitting ? "Submitting..." : "Post Comment"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-sm">{message}</p>}

      {/* Comments List */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        {comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.id} className="mb-4 border-b pb-2">
              <p className="font-semibold text-gray-800">{c.name}</p>
              <p className="text-xs text-gray-500">
                {new Date(c.created_at).toLocaleString()}
              </p>
              <p className="mt-1 text-gray-700">{c.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No comments yet.</p>
        )}
      </section>
    </div>
  );
};

export default CommentForm;
