import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Send, Image, Users, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const MassMessaging = () => {
  const [isSending, setIsSending] = useState(false);
  const [customerStats, setCustomerStats] = useState({
    totalCustomers: 0,
    verifiedCustomers: 0,
    unverifiedCustomers: 0
  });
  const [sendResult, setSendResult] = useState(null);
  const [sendToVerifiedOnly, setSendToVerifiedOnly] = useState(true);
  
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const message = watch('message', '');

  useEffect(() => {
    fetchCustomerCount();
  }, []);

  const fetchCustomerCount = async () => {
    try {
      const response = await axios.get('/messages/stats');
      if (response.data.success) {
        setCustomerStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch customer stats:', error);
      toast.error('Failed to fetch customer statistics');
    }
  };

  const onSubmit = async (data) => {
    setIsSending(true);
    setSendResult(null);
    
    try {
      const response = await axios.post('/messages/send', {
        message: data.message,
        sendToVerifiedOnly: sendToVerifiedOnly
      });

      setSendResult(response.data.data);
      toast.success(`Message sent successfully to ${response.data.data.totalRecipients} recipients!`);
      reset();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send messages';
      toast.error(message);
      setSendResult({ 
        totalRecipients: sendToVerifiedOnly ? customerStats.verifiedCustomers : customerStats.totalCustomers,
        successful: 0,
        failed: sendToVerifiedOnly ? customerStats.verifiedCustomers : customerStats.totalCustomers,
        errors: [{ error: message }]
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mass Messaging</h1>
        <p className="text-gray-600">Send WhatsApp messages to all your customers</p>
      </div>

      {/* Customer Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-4">
            <Users className="h-8 w-8 text-primary-600" />
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customerStats.totalCustomers}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Verified Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customerStats.verifiedCustomers}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <XCircle className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Unverified Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customerStats.unverifiedCustomers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Message Form */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              {...register('message', { 
                required: 'Message is required',
                minLength: { value: 1, message: 'Message cannot be empty' },
                maxLength: { value: 1000, message: 'Message must be less than 1000 characters' }
              })}
              rows="4"
              className="input-field"
              placeholder="Enter your message to send to all customers..."
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              {message.length}/1000 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL (Optional)
            </label>
            <div className="flex items-center gap-2">
              <Image className="h-5 w-5 text-gray-400" />
              <input
                type="url"
                {...register('imageUrl', {
                  pattern: {
                    value: /^https?:\/\/.+/, 
                    message: 'Please enter a valid URL starting with http:// or https://'
                  }
                })}
                className="input-field"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {errors.imageUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Add an image URL to send with your message
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sendToVerifiedOnly"
              checked={sendToVerifiedOnly}
              onChange={(e) => setSendToVerifiedOnly(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="sendToVerifiedOnly" className="text-sm text-gray-700">
              Send only to verified customers
            </label>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSending || (sendToVerifiedOnly ? customerStats.verifiedCustomers === 0 : customerStats.totalCustomers === 0)}
              className="btn-primary flex items-center gap-2"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send to {sendToVerifiedOnly ? 'Verified' : 'All'} Customers ({sendToVerifiedOnly ? customerStats.verifiedCustomers : customerStats.totalCustomers})
                </>
              )}
            </button>
            {(sendToVerifiedOnly ? customerStats.verifiedCustomers === 0 : customerStats.totalCustomers === 0) && (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">No {sendToVerifiedOnly ? 'verified ' : ''}customers found</span>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Send Results */}
      {sendResult && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Send Results</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">Total Recipients</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{sendResult.totalRecipients}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-600">Successful</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{sendResult.successful || sendResult.totalRecipients}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm text-gray-600">Failed</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{sendResult.failed || 0}</p>
            </div>
          </div>

          {sendResult.errors && sendResult.errors.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Errors:</h4>
              <div className="space-y-2">
                {sendResult.errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error.phoneNumber}: {error.error}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MassMessaging;
