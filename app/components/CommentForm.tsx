"use client";

import { useState, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface Comment {
  id: number;
  author_name: string;
  comment: string;
  created_at: string;
}

interface CommentFormProps {
  articleId: number;
  onCommentSubmitted?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ articleId, onCommentSubmitted }) => {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
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

  // Poll to make sure grecaptcha is ready
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

        // Call parent callback to refresh sidebar and page comments
        if (onCommentSubmitted) onCommentSubmitted();
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong. Try again later.");
    }

    setSubmitting(false);
  };

  return (
    <div className="mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
      {/* Comments Display */}
      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Comments ({comments.length})</h3>
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="bg-white p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-semibold text-gray-800">{c.author_name}</p>
                  <span className="text-gray-400">•</span>
                  <p className="text-xs text-gray-500">
                    {new Date(c.created_at).toLocaleString()}
                  </p>
                </div>
                <p className="text-gray-700">{c.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
        )}
      </section>

      {/* Comment Form */}
      <h3 className="text-2xl font-semibold mb-4">Leave a Comment</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <textarea
          placeholder="Your Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          ref={recaptchaRef}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
        >
          {submitting ? "Submitting..." : "Post Comment"}
        </button>
      </form>

      {message && (
        <p className={`mt-4 text-center text-sm font-medium ${
          message.includes("✅") ? "text-green-600" : "text-red-600"
        }`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default CommentForm;