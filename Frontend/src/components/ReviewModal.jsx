import { useState } from "react";
import { Star, X } from "lucide-react";
import toast from "react-hot-toast";
import { createReview } from "../services/reviewServices";

export default function ReviewModal({
  swap,
  reviewedUserName,
  onClose,
  onSubmitted,
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      setSubmitting(true);

      const response = await createReview({
        swapRequestId: swap.id,
        rating,
        comment,
      });

      if (response.data.success) {
        toast.success("Review submitted successfully");

        onSubmitted?.(response.data);

        onClose();
      }
    } catch (error) {
      console.error("SUBMIT REVIEW ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to submit review"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Rate Your Swap
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              How was your experience with{" "}
              <span className="font-semibold text-slate-700">
                {reviewedUserName}
              </span>
              ?
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-5"
        >

          {/* Rating */}
          <div>
            <p className="mb-3 text-sm font-bold text-slate-700">
              Your Rating
            </p>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const active =
                  star <= (hoverRating || rating);

                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() =>
                      setHoverRating(star)
                    }
                    onMouseLeave={() =>
                      setHoverRating(0)
                    }
                    onClick={() =>
                      setRating(star)
                    }
                    className="rounded-lg p-1 transition hover:scale-110"
                  >
                    <Star
                      size={34}
                      className={
                        active
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }
                    />
                  </button>
                );
              })}
            </div>

            {rating > 0 && (
              <p className="mt-2 text-sm font-semibold text-slate-500">
                {rating === 1 && "Poor"}
                {rating === 2 && "Needs improvement"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label
              htmlFor="review-comment"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              Comment
              <span className="ml-1 font-normal text-slate-400">
                (optional)
              </span>
            </label>

            <textarea
              id="review-comment"
              value={comment}
              onChange={(event) =>
                setComment(event.target.value)
              }
              rows={4}
              maxLength={500}
              placeholder="Share your experience with this swap..."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {comment.length}/500
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Submitting..."
                : "Submit Review"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}