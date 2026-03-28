import Footer from "../../components/Footer";
import PageTransition from "../../components/PageTransition";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useState } from "react";
import Lottie from "lottie-react";
import mailAnimation from "../../animations/mail.json";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const key = import.meta.env.VITE_WEB3FORMS_KEY || "YOUR_ACCESS_KEY_HERE";
    
    if (key === "YOUR_ACCESS_KEY_HERE") {
      setStatus("error");
      setErrorMessage("Please set a valid Web3Forms Access Key in the .env file.");
      return;
    }

    const payload = {
      access_key: key,
      ...formData,
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (resData.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" }); // reset form
      } else {
        setStatus("error");
        setErrorMessage(resData.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Contact | Mustapha Osman</title>
        <meta name="description" content="Get in touch with Mustapha Osman." />
      </Helmet>
      
      <div className="min-h-screen bg-black text-[#e7dfc6] flex flex-col pt-32 relative">
        <div className="flex-1 flex flex-col lg:flex-row px-10 dee-only:px-4 max-w-7xl mx-auto w-full gap-16 lg:gap-8 pb-32">
          
          {/* Left Side: Header & Info */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-8"
          >
            <h1 className="text-[4rem] md:text-[6rem] font-extrabold leading-none tracking-tighter uppercase">
              Let's <br /> Connect
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-md">
              Have a project in mind, or just want to say hi? Fill out the form and I'll get back to you as soon as possible.
            </p>
            
            <div className="w-32 h-32 md:w-48 md:h-48 mt-8 opacity-80">
              <Lottie animationData={mailAnimation} loop={true} />
            </div>
          </motion.div>

          {/* Right Side: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 bg-[#111] p-8 md:p-12 rounded-3xl border border-[#e7dfc6]/10"
          >
            {status === "success" ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20"
              >
                <div className="w-20 h-20 bg-green-500/20 text-green-500 flex items-center justify-center rounded-full text-4xl mb-4">
                  ✓
                </div>
                <h3 className="text-3xl font-bold">Message Sent!</h3>
                <p className="text-gray-400">Thanks for reaching out. I'll respond shortly.</p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="mt-8 px-8 py-3 outline outline-1 outline-[#e7dfc6]/30 rounded-full hover:bg-[#e7dfc6] hover:text-black transition-all"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-8">
                {/* Error Banner */}
                {status === "error" && (
                  <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg text-sm">
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold uppercase tracking-wider text-gray-400">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b-2 border-gray-600 focus:border-[#e7dfc6] outline-none py-3 text-xl transition-colors placeholder:text-gray-700"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold uppercase tracking-wider text-gray-400">Your Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b-2 border-gray-600 focus:border-[#e7dfc6] outline-none py-3 text-xl transition-colors placeholder:text-gray-700"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-semibold uppercase tracking-wider text-gray-400">Your Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    required 
                    rows="4" 
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b-2 border-gray-600 focus:border-[#e7dfc6] outline-none py-3 text-xl transition-colors resize-none placeholder:text-gray-700"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={status === "loading"}
                  className="w-full bg-[#e7dfc6] text-black font-bold text-lg py-5 rounded-xl uppercase tracking-wider hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>
          
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Contact;
