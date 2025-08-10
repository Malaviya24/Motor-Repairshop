import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Wrench, 
  Download,
  MessageCircle,
  Send,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ThemeToggle from './ThemeToggle';

const LandingPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/contact`, data);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setIsSubmitted(true);
      reset();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send message';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Universal Electric Motor Rewinding
ORG:Professional Motor Rewinding Services
TEL:+919879825692
EMAIL:info@universalmotorrewinding.com
ADR:;;123 Main Street;City;State;12345;USA
URL:https://universalmotorrewinding.com
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'motor-repair-shop.vcf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Contact card downloaded!');
  };

  const openWhatsApp = () => {
    const phoneNumber = '+919879825692'; // Main business number
    const message = 'Hi! I\'m interested in your motor repair services.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
             {/* Header */}
       <header className="bg-white dark:bg-[#1E1E1E] shadow-sm transition-colors duration-200">
         <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
           <div className="flex justify-between items-center py-4 sm:py-6">
             <div className="flex items-center flex-1 min-w-0">
               <div className="text-2xl sm:text-3xl mr-2 sm:mr-3 flex-shrink-0">⚡</div>
               <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white leading-tight break-words">
                 Universal Electric Motor Rewinding
               </h1>
             </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <ThemeToggle />
              <Link 
                to="/login" 
                className="bg-slate-800 hover:bg-slate-700 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg border border-slate-600 text-sm sm:text-base whitespace-nowrap"
              >
                <span className="hidden sm:inline">👨‍💼 </span>
                <span className="sm:hidden">👨‍💼</span>
                <span className="hidden sm:inline">Admin Login</span>
                <span className="sm:hidden">Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-16 sm:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-4xl sm:text-5xl mb-4 sm:mb-6 opacity-90">⚡</div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 sm:mb-8 leading-tight px-2">
            Professional Motor Repair Services
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-12 text-slate-200 max-w-4xl mx-auto leading-relaxed px-4">
            We specialize in repairing and servicing a wide range of electric motors to keep your machines running smoothly
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
            <button 
              onClick={openWhatsApp}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-lg font-semibold flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 shadow-xl hover:shadow-2xl text-sm sm:text-base"
            >
              <span className="text-lg sm:text-xl">💬</span>
              <span className="whitespace-nowrap">Chat on WhatsApp</span>
            </button>
            <button 
              onClick={downloadVCard}
              className="bg-white hover:bg-slate-50 text-slate-800 px-6 sm:px-10 py-3 sm:py-4 rounded-lg font-semibold flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 shadow-xl hover:shadow-2xl border border-slate-200 text-sm sm:text-base"
            >
              <span className="text-lg sm:text-xl">📱</span>
              <span className="whitespace-nowrap">Save Contact</span>
            </button>
          </div>
        </div>
      </section>

             {/* Services Section */}
       <section className="py-12 sm:py-16 bg-gray-50 dark:bg-[#1E1E1E]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 sm:mb-12 text-slate-900 dark:text-white transition-colors duration-200 px-2">
             Motor Repair Services We Offer
           </h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
             <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-600">
               <div className="text-2xl sm:text-3xl mb-4 sm:mb-6 opacity-80">💧</div>
               <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-slate-900 dark:text-white">Water Pump Motors</h3>
               <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">Quick repairs and servicing to restore water flow and prevent downtime</p>
             </div>
             <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-600">
               <div className="text-2xl sm:text-3xl mb-4 sm:mb-6 opacity-80">❄️</div>
               <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-slate-900 dark:text-white">Air Conditioner Motors</h3>
               <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">Fixing cooling fans and compressor motors for optimal performance</p>
             </div>
             <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-600">
               <div className="text-2xl sm:text-3xl mb-4 sm:mb-6 opacity-80">🏭</div>
               <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-slate-900 dark:text-white">Industrial Motors</h3>
               <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">Maintenance and repair for heavy-duty machinery motors in factories and workshops</p>
             </div>
             <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-600">
               <div className="text-2xl sm:text-3xl mb-4 sm:mb-6 opacity-80">💨</div>
               <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-slate-900 dark:text-white">Fan & Blower Motors</h3>
               <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">Balancing, rewinding, and restoring for quiet and efficient operation</p>
             </div>
             <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-600">
               <div className="text-2xl sm:text-3xl mb-4 sm:mb-6 opacity-80">🌊</div>
               <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-slate-900 dark:text-white">Submersible & Borewell Motors</h3>
               <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">Expert service to handle water supply needs without interruptions</p>
             </div>
             <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-600">
               <div className="text-2xl sm:text-3xl mb-4 sm:mb-6 opacity-80">🔧</div>
               <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-slate-900 dark:text-white">Custom Motor Repairs</h3>
               <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">Any type of single-phase or three-phase motor issues resolved with precision</p>
             </div>
           </div>
        </div>
      </section>

             {/* Why Choose Us Section */}
      <section className="py-12 sm:py-16 bg-white dark:bg-[#1E1E1E] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 sm:mb-12 text-slate-900 dark:text-white transition-colors duration-200 px-2">
            Why Choose Us?
          </h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
             <div className="text-center bg-gray-50 dark:bg-[#121212] rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-600 shadow-lg">
               <div className="text-2xl sm:text-3xl mb-4 sm:mb-6 opacity-80">👨‍🔧</div>
               <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-slate-900 dark:text-white">Skilled Technicians</h3>
               <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">Experienced professionals with years of motor repair expertise</p>
             </div>
             <div className="text-center bg-gray-50 dark:bg-[#121212] rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-600 shadow-lg">
               <div className="text-2xl sm:text-3xl mb-4 sm:mb-6 opacity-80">⭐</div>
               <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-slate-900 dark:text-white">Quality Parts</h3>
               <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">We use only high-quality, genuine parts for all repairs</p>
             </div>
             <div className="text-center bg-gray-50 dark:bg-[#121212] rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-600 shadow-lg">
               <div className="text-2xl sm:text-3xl mb-4 sm:mb-6 opacity-80">⚡</div>
               <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-slate-900 dark:text-white">Quick Turnaround</h3>
               <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">Fast and efficient service to minimize your downtime</p>
             </div>
             <div className="text-center bg-gray-50 dark:bg-[#121212] rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-600 shadow-lg">
               <div className="text-2xl sm:text-3xl mb-4 sm:mb-6 opacity-80">💰</div>
               <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-slate-900 dark:text-white">Affordable Pricing</h3>
               <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">Competitive rates without compromising on quality</p>
             </div>
           </div>
        </div>
      </section>

             {/* Contact Form Section */}
      <section className="py-16 bg-gray-50 dark:bg-[#1E1E1E] transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-white transition-colors duration-200 px-2">
              Get In Touch
            </h2>
            <p className="text-slate-600 dark:text-slate-300 transition-colors duration-200 px-2">
              Send us a message and we'll get back to you as soon as possible
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-8 border border-slate-200 dark:border-slate-600 text-center shadow-lg">
              <div className="text-5xl mb-6 opacity-80">✅</div>
              <h3 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">Message Sent!</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">Thank you for contacting us. We'll get back to you soon.</p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg"
              >
                Send Another Message
              </button>
            </div>
          ) : (
                         <form onSubmit={handleSubmit(onSubmit)} className="card bg-white dark:bg-[#1E1E1E] dark:border-slate-600 transition-colors duration-200">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                    Full Name *
                  </label>
                                     <input
                     type="text"
                     {...register('name', { 
                       required: 'Name is required',
                       minLength: { value: 2, message: 'Name must be at least 2 characters' }
                     })}
                     className="input-field dark:bg-[#121212] dark:border-slate-600 dark:text-white dark:placeholder-[#888888] transition-colors duration-200"
                     placeholder="Enter your full name"
                   />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                    Phone Number *
                  </label>
                                     <input
                     type="tel"
                     {...register('phoneNumber', { 
                       required: 'Phone number is required',
                       validate: {
                         minLength: (value) => {
                           const cleanNumber = value.replace(/[\s\-\(\)]/g, '');
                           if (cleanNumber.length < 10) {
                             return 'Please enter full phone number (minimum 10 digits)';
                           }
                           return true;
                         },
                         validFormat: (value) => {
                           const cleanNumber = value.replace(/[\s\-\(\)]/g, '');
                           if (!/^\+?[1-9]\d{9,14}$/.test(cleanNumber)) {
                             return 'Please enter a valid phone number format';
                           }
                           return true;
                         },
                         validCountryCode: (value) => {
                           const cleanNumber = value.replace(/[\s\-\(\)]/g, '');
                           if (cleanNumber.startsWith('+') && cleanNumber.length < 12) {
                             return 'Please enter complete number with country code';
                           }
                           return true;
                         }
                       }
                     })}
                     className="input-field dark:bg-[#121212] dark:border-slate-600 dark:text-white dark:placeholder-[#888888] transition-colors duration-200"
                     placeholder="+919879825692"
                   />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
                  )}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                  Message *
                </label>
                                 <textarea
                   {...register('message', { 
                     required: 'Message is required',
                     minLength: { value: 10, message: 'Message must be at least 10 characters' }
                   })}
                   rows="4"
                   className="input-field dark:bg-[#121212] dark:border-slate-600 dark:text-white dark:placeholder-[#888888] transition-colors duration-200"
                   placeholder="Tell us about your motor issue and what service you need..."
                 />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>
                             <button
                 type="submit"
                 disabled={isSubmitting}
                                   className="bg-emerald-600 hover:bg-emerald-700 text-white w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {isSubmitting ? (
                   <>
                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                     Sending...
                   </>
                 ) : (
                   <>
                     <span className="text-xl">📤</span>
                     Send Message
                   </>
                 )}
               </button>
            </form>
          )}
        </div>
      </section>

             {/* Contact Info Section */}
       <section className="py-16 bg-white dark:bg-[#1E1E1E] transition-colors duration-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid md:grid-cols-3 gap-8">
             <div className="text-center bg-gray-50 dark:bg-[#121212] rounded-xl p-8 border border-slate-200 dark:border-slate-600 shadow-lg">
               <div className="text-3xl mb-6 opacity-80">📞</div>
               <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Phone</h3>
                               <p className="text-slate-600 dark:text-slate-300">+919879825692</p>
             </div>
             <div className="text-center bg-gray-50 dark:bg-[#121212] rounded-xl p-8 border border-slate-200 dark:border-slate-600 shadow-lg">
               <div className="text-3xl mb-6 opacity-80">📧</div>
               <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Email</h3>
               <p className="text-slate-600 dark:text-slate-300">info@universalmotorrewinding.com</p>
             </div>
             <div className="text-center bg-gray-50 dark:bg-[#121212] rounded-xl p-8 border border-slate-200 dark:border-slate-600 shadow-lg">
               <div className="text-3xl mb-6 opacity-80">📍</div>
               <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Address</h3>
               <p className="text-slate-600 dark:text-slate-300">123 Main Street, City, State 12345</p>
             </div>
           </div>
        </div>
      </section>

             {/* Footer */}
       <footer className="bg-slate-900 dark:bg-slate-950 text-white py-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Universal Electric Motor Rewinding. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
