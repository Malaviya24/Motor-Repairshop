import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Wrench, 
  Car, 
  Download,
  MessageCircle,
  Send,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

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
TEL:+1234567890
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
    const phoneNumber = '+1234567890'; // Replace with actual number
    const message = 'Hi! I\'m interested in your motor repair services.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Wrench className="h-8 w-8 text-primary-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Universal Electric Motor Rewinding</h1>
            </div>
            <Link 
              to="/login" 
              className="btn-primary"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Professional Motor Repair Services
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            We specialize in repairing and servicing a wide range of electric motors to keep your machines running smoothly
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={openWhatsApp}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </button>
            <button 
              onClick={downloadVCard}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <Download className="h-5 w-5" />
              Save Contact
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Motor Repair Services We Offer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card card-hover text-center">
              <Wrench className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Water Pump Motors</h3>
              <p className="text-gray-600">Quick repairs and servicing to restore water flow and prevent downtime</p>
            </div>
            <div className="card card-hover text-center">
              <Wrench className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Air Conditioner Motors</h3>
              <p className="text-gray-600">Fixing cooling fans and compressor motors for optimal performance</p>
            </div>
            <div className="card card-hover text-center">
              <Wrench className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Industrial Motors</h3>
              <p className="text-gray-600">Maintenance and repair for heavy-duty machinery motors in factories and workshops</p>
            </div>
            <div className="card card-hover text-center">
              <Wrench className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fan & Blower Motors</h3>
              <p className="text-gray-600">Balancing, rewinding, and restoring for quiet and efficient operation</p>
            </div>
            <div className="card card-hover text-center">
              <Wrench className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Submersible & Borewell Motors</h3>
              <p className="text-gray-600">Expert service to handle water supply needs without interruptions</p>
            </div>
            <div className="card card-hover text-center">
              <Wrench className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Custom Motor Repairs</h3>
              <p className="text-gray-600">Any type of single-phase or three-phase motor issues resolved with precision</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Skilled Technicians</h3>
              <p className="text-gray-600">Experienced professionals with years of motor repair expertise</p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Parts</h3>
              <p className="text-gray-600">We use only high-quality, genuine parts for all repairs</p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quick Turnaround</h3>
              <p className="text-gray-600">Fast and efficient service to minimize your downtime</p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Affordable Pricing</h3>
              <p className="text-gray-600">Competitive rates without compromising on quality</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
            <p className="text-gray-600">Send us a message and we'll get back to you as soon as possible</p>
          </div>

          {isSubmitted ? (
            <div className="card text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Message Sent!</h3>
              <p className="text-gray-600 mb-6">Thank you for contacting us. We'll get back to you soon.</p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="btn-primary"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="card">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('name', { 
                      required: 'Name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' }
                    })}
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register('phoneNumber', { 
                      required: 'Phone number is required',
                      pattern: { 
                        value: /^\+?[\d\s\-()]+$/,
                        message: 'Please enter a valid phone number'
                      }
                    })}
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
                  )}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  {...register('message', { 
                    required: 'Message is required',
                    minLength: { value: 10, message: 'Message must be at least 10 characters' }
                  })}
                  rows="4"
                  className="input-field"
                  placeholder="Tell us about your motor issue and what service you need..."
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Phone className="h-8 w-8 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">+1 (234) 567-8900</p>
            </div>
                         <div className="text-center">
               <Mail className="h-8 w-8 text-primary-600 mx-auto mb-4" />
               <h3 className="text-lg font-semibold mb-2">Email</h3>
               <p className="text-gray-600">info@universalmotorrewinding.com</p>
             </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Address</h3>
              <p className="text-gray-600">123 Main Street, City, State 12345</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <p>&copy; 2024 Universal Electric Motor Rewinding. All rights reserved.</p>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
