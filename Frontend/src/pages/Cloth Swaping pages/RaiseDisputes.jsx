import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/DashbaordLayout";
import { createDispute } from "../../services/disputeServices";

const RaiseDispute = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const swap = location.state?.swap;

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    clothing_id: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!swap) {
      toast.error("Swap information not found");
      navigate("/swap-history");
    }
  }, [swap, navigate]);

  if (!swap) {
    return null;
  }

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const currentUserId = Number(currentUser.id);

  const senderId = Number(swap.sender_id);
  const receiverId = Number(swap.reciever_id);

  const againstUserId = senderId === currentUserId ? receiverId : senderId;

  const againstUserName =
    senderId === currentUserId ? swap.reciever_name : swap.sender_name;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please describe the problem");
      return;
    }

    try {
      setSubmitting(true);

      const response = await createDispute({
        swap_request_id: swap.id,
        against_user: againstUserId,
        clothing_id: formData.clothing_id ? Number(formData.clothing_id) : null,
        subject: formData.subject.trim(),
        description: formData.description.trim(),
      });

      toast.success(response.data.message || "Dispute created successfully");

      navigate(`/disputes/${response.data.dispute.id}`);
    } catch (error) {
      console.error("CREATE DISPUTE ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to create dispute");
    } finally {
      setSubmitting(false);
    }
  };
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return (
    <DashboardLayout user={user} showNavbar={true}>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-200">
              <h1 className="text-2xl font-bold text-slate-900">
                Raise a Dispute
              </h1>

              <p className="text-slate-500 mt-1">
                Report an issue with your completed swap.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Swap information */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h2 className="font-semibold text-slate-900 mb-3">
                  Swap Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Swap ID</p>

                    <p className="font-medium">#{swap.id}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Dispute Against</p>

                    <p className="font-medium">
                      {againstUserName || "Other Swapper"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Example: Item arrived damaged"
                  maxLength={255}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              {/* Clothing */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Item involved
                </label>

                <select
                  name="clothing_id"
                  value={formData.clothing_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <option value="">General swap issue</option>

                  {swap.sender_item_id && (
                    <option value={swap.sender_item_id}>
                      Item #{swap.sender_item_id}
                    </option>
                  )}

                  {swap.reciever_item_id && (
                    <option value={swap.reciever_item_id}>
                      Item #{swap.reciever_item_id}
                    </option>
                  )}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Describe the problem
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={7}
                  placeholder="Explain what happened in detail..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              {/* Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  Please provide accurate information. Your complaint will be
                  visible to the other swapper and may be reviewed by an
                  administrator.
                </p>
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={17} />

                  {submitting ? "Submitting..." : "Submit Dispute"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RaiseDispute;
