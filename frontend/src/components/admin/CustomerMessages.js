import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Phone, 
  User, 
  Calendar, 
  CheckCircle, 
  Clock,
  Search,
  ExternalLink
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CustomerMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ unreadCount: 0, totalCount: 0 });
  const [filters, setFilters] = useState({ status: '', search: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, [currentPage, filters]);

  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        ...filters
      });
      
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/messages?${params}`);
      setMessages(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/messages/unread`);
      setStats({ 
        unreadCount: response.data.data.unreadCount,
        totalCount: messages.length
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const markAsReplied = async (messageId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/messages/${messageId}/reply`);
      toast.success('Message marked as replied');
      fetchMessages();
      fetchStats();
    } catch (error) {
      toast.error('Failed to update message status');
    }
  };

  const openWhatsApp = (phoneNumber, message) => {
    const formattedNumber = phoneNumber.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(`Hi! Regarding your message: "${message}"`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customer Messages</h1>
        <p className="text-gray-600">Manage and respond to customer inquiries</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center gap-4">
            <Clock className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-sm text-gray-600">Unread Messages</p>
              <p className="text-2xl font-bold text-amber-600">{stats.unreadCount}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <MessageSquare className="h-8 w-8 text-primary-600" />
            <div>
              <p className="text-sm text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-10"
                placeholder="Search by name, phone, or message..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input-field"
            >
              <option value="">All Messages</option>
              <option value="unread">Unread Only</option>
              <option value="replied">Replied Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="card text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
            <p className="text-gray-600">No customer messages match your current filters.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message._id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900">{message.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{message.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{formatDate(message.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {message.status === 'unread' ? (
                        <Clock className="h-4 w-4 text-amber-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <span className={`text-sm ${message.status === 'unread' ? 'text-amber-600' : 'text-green-600'}`}>
                        {message.status === 'unread' ? 'Unread' : 'Replied'}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => openWhatsApp(message.phoneNumber, message.message)}
                    className="btn-secondary flex items-center gap-2 text-sm"
                    title="Reply on WhatsApp"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Reply
                  </button>
                  {message.status === 'unread' && (
                    <button
                      onClick={() => markAsReplied(message._id)}
                      className="btn-primary flex items-center gap-2 text-sm"
                      title="Mark as replied"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark Replied
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="btn-secondary text-sm"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="btn-secondary text-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerMessages;
