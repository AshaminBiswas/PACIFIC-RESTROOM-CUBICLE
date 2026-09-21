import { useState } from "react";
import { motion } from "motion/react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "./Button";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string;

interface ContactFormProps {
  onClose?: () => void;
  isModal?: boolean;
}

export function ContactForm({ onClose, isModal = false }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    requirement: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      company: formData.company || "N/A",
      requirement: formData.requirement || "Not specified",
      message: formData.message || "No additional details provided.",
    };

    try {
      // 1. Save to Supabase database (non-fatal — skipped in demo mode)
      if (isSupabaseConfigured()) {
        const { error: dbError } = await supabase
          .from('contact_queries')
          .insert([{
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company || null,
            requirement: formData.requirement || null,
            message: formData.message || null,
          }]);

        if (dbError) {
          // Log but don't block the user — EmailJS can still deliver the message
          console.error("Supabase insert error:", dbError);
        }
      } else {
        console.warn("Supabase not configured — skipping database save.");
      }

      // 2. Send Email Notification via Web3Forms (Non-fatal if it fails)
      try {
        if (!WEB3FORMS_ACCESS_KEY) {
          console.warn("Web3Forms access key is missing. Skipping email send.");
        } else {
          await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              access_key: WEB3FORMS_ACCESS_KEY,
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              company: formData.company || "N/A",
              requirement: formData.requirement || "Not specified",
              message: formData.message || "No additional details provided.",
              subject: `New Website Query from ${formData.name}`,
              from_name: "Pacific Products Website",
              replyTo: formData.email,
              // Web3Forms automatically sends this exact message back to the customer!
              autoresponse: `Hi ${formData.name},\n\nThank you for reaching out to Pacific Products and Solutions!\n\nWe have received your inquiry regarding ${formData.requirement || 'our services'}. One of our team members will review your details and get back to you shortly.\n\nBest regards,\nThe Pacific Products Team`,
            }),
          });
        }
      } catch (emailErr) {
        console.error("Web3Forms notification failed:", emailErr);
      }

      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          requirement: "",
          message: "",
        });
        if (onClose) onClose();
      }, 3000);
    } catch (err: any) {
      console.error("Submission error:", err);
      setError("Something went wrong while sending your inquiry. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[#030213] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#7FB706] focus:ring-1 focus:ring-[#7FB706] transition-colors";
  const labelClasses = "block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300";

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isModal && (
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-white/10 pb-4">
          <h3 className="text-2xl font-bold text-[#030213] dark:text-white">Get a Quote</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className={labelClasses}>Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className={inputClasses}
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClasses}>Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={inputClasses}
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelClasses}>Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            minLength={7}
            maxLength={15}
            pattern="[+\d\s\-().]{7,15}"
            title="Please enter a valid phone number (7–15 digits, may include +, spaces, or dashes)"
            value={formData.phone}
            onChange={handleChange}
            className={inputClasses}
            placeholder="+91 98765 43210"
          />
        </div>

        <div>
          <label htmlFor="company" className={labelClasses}>Company Name</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Your Company"
          />
        </div>
      </div>

      <div>
        <label htmlFor="requirement" className={labelClasses}>Product/Service Required</label>
        <select
          id="requirement"
          name="requirement"
          value={formData.requirement}
          onChange={handleChange}
          className={`${inputClasses} appearance-none [&>option]:bg-white [&>option]:dark:bg-[#0a0a1a] [&>option]:text-black [&>option]:dark:text-white`}
        >
          <option value="">Select a product/service</option>
          <option value="restroom-cubicles">Restroom Cubicles</option>
          <option value="toilet-partitions">Toilet Partitions</option>
          <option value="exterior-cladding">Exterior Cladding</option>
          <option value="interior-paneling">Interior Paneling</option>
          <option value="cubicle-hardware">Cubicle Hardware</option>
          <option value="acrylic-surface">Acrylic Solid Surface</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className={labelClasses}>Project Details</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className={`${inputClasses} resize-none`}
          placeholder="Tell us about your project requirements..."
        />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 text-red-600 dark:text-red-400 text-sm font-medium"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </motion.div>
      )}

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#E9FDBF] dark:bg-[#7FB706]/10 border border-[#7FB706]/30 rounded-xl p-6 text-center"
        >
          <div className="w-16 h-16 bg-[#7FB706] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#7FB706]/20">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-xl font-bold text-[#030213] dark:text-white mb-2">Thank You!</h4>
          <p className="text-gray-700 dark:text-gray-300">Your inquiry has been sent successfully. We'll be in touch shortly.</p>
        </motion.div>
      ) : (
        <Button 
          type="submit" 
          size="lg" 
          className="w-full text-base font-semibold tracking-wide" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting Inquiry..." : "Submit Inquiry"}
        </Button>
      )}
    </form>
  );

  if (isModal) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {formContent}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl transition-colors">
      {formContent}
    </div>
  );
}