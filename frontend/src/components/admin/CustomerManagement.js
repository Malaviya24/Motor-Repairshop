import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Phone,
  User,
  Search,
  Download
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    isVerified: false,
    notes: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, searchTerm, filterStatus]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        search: searchTerm,
        status: filterStatus !== 'all' ? filterStatus : ''
      });

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/customers?${params}`);
      setCustomers(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.phoneNumber.trim()) {
      toast.error('Phone number is required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingCustomer) {
        await axios.put(`${process.env.REACT_APP_API_URL}/customers/${editingCustomer._id}`, formData);
        toast.success('Customer updated successfully!');
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/customers`, formData);
        toast.success('Customer added successfully!');
      }
      
      setShowAddForm(false);
      setEditingCustomer(null);
      resetForm();
      fetchCustomers();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save customer';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name || '',
      phoneNumber: customer.phoneNumber || '',
      isVerified: customer.isVerified || false,
      notes: customer.notes || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/customers/${customerId}`);
      toast.success('Customer deleted successfully!');
      fetchCustomers();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete customer';
      toast.error(message);
    }
  };

  const toggleVerification = async (customerId, currentStatus) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/customers/${customerId}/verify`, {
        isVerified: !currentStatus
      });
      toast.success(`Customer ${!currentStatus ? 'verified' : 'unverified'} successfully!`);
      fetchCustomers();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update verification status';
      toast.error(message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phoneNumber: '',
      isVerified: false,
      notes: ''
    });
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingCustomer(null);
    resetForm();
  };

  const exportCustomers = () => {
    const csvContent = [
      ['Name', 'Phone Number', 'Verified', 'Notes', 'Created Date'],
      ...customers.map(customer => [
        customer.name || '',
        customer.phoneNumber || '',
        customer.isVerified ? 'Yes' : 'No',
        customer.notes || '',
        new Date(customer.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Customers exported successfully!');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Customer Management</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Manage your customer database for WhatsApp messaging</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={exportCustomers}
            className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Customer</span>
            <span className="sm:hidden">Add Customer</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field w-full sm:w-auto"
            >
              <option value="all">All Customers</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="card p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Customer name"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  placeholder="+1234567890"
                  className="input-field w-full"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional notes about this customer"
                rows="3"
                className="input-field w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isVerified"
                checked={formData.isVerified}
                onChange={(e) => setFormData({...formData, isVerified: e.target.checked})}
                className="rounded border-gray-300"
              />
              <label htmlFor="isVerified" className="text-sm text-gray-700 dark:text-gray-300">
                Mark as verified customer
              </label>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="hidden sm:inline">Saving...</span>
                    <span className="sm:hidden">Saving</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">{editingCustomer ? 'Update' : 'Add'} Customer</span>
                    <span className="sm:hidden">{editingCustomer ? 'Update' : 'Add'}</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Customers List */}
      <div className="card p-4 sm:p-6">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No customers found</h3>
            <p className="text-gray-600 dark:text-gray-300">Start by adding your first customer</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {customer.name || 'No Name'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {customer.phoneNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleVerification(customer._id, customer.isVerified)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.isVerified
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}
                      >
                        {customer.isVerified ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Unverified
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                        {customer.notes || '-'}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(customer)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(customer._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="btn-secondary px-3 py-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="btn-secondary px-3 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;

