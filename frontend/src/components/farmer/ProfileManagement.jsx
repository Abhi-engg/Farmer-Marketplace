import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from '../../utils/axios';

const inputGuides = {
  farmer_name: {
    title: "Your Full Name",
    guide: "Enter your legal first and last name as it appears on official documents"
  },
  farm_name: {
    title: "Farm Name",
    guide: "Enter your farm's business name. This will be visible to customers"
  },
  phone_number: {
    title: "Contact Number",
    guide: "Enter a phone number where customers can reach you during business hours"
  },
  location: {
    title: "Farm Location",
    guide: "Enter your farm's address or general area for delivery planning"
  },
  farm_type: {
    title: "Type of Farm",
    guide: "Select the category that best describes your farming practices"
  },
  description: {
    title: "Farm Description",
    guide: "Tell your story! Share your farming philosophy, special practices, and what makes your farm unique"
  },
  delivery_radius: {
    title: "Delivery Range",
    guide: "Enter the maximum distance (in kilometers) you're willing to deliver your products"
  },
  certifications: {
    title: "Certifications",
    guide: "Select any certifications or standards your farm follows"
  }
};

const ProfileManagement = ({ farmerData, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    farmer_name: '',
    farm_name: '',
    phone_number: '',
    location: '',
    profile_image: null,
    farm_type: '',
    description: '',
    delivery_radius: '',
    preferred_payment: [],
    certifications: []
  });

  useEffect(() => {
    if (farmerData) {
      setFormData(prev => ({
        ...prev,
        ...farmerData
      }));
    }
  }, [farmerData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'profile_image') {
          if (formData.profile_image) {
            data.append('profile_image', formData.profile_image);
          }
        } else {
          data.append(key, formData[key]);
        }
      });

      await axios.post('/api/farmer/profile/update/', data);
      onUpdate();
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showTooltip = (fieldName) => {
    setActiveTooltip(fieldName);
  };

  const hideTooltip = () => {
    setActiveTooltip(null);
  };

  const ProfileDisplay = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Hero Banner */}
        <div className="relative h-48 bg-gradient-to-r from-emerald-600 to-green-500">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        {/* Profile Info Section */}
        <div className="relative px-8 pb-8">
          {/* Profile Image */}
          <div className="relative -mt-20 mb-4">
            <img
              src={formData.profile_image ? URL.createObjectURL(formData.profile_image) : '/default-avatar.png'}
              alt="Profile"
              className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-xl"
            />
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
          </div>

          {/* Farm Name and Basic Info */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{formData.farm_name}</h1>
            <p className="text-lg text-emerald-600">{formData.farmer_name}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <span className="text-2xl mb-1 block">🌾</span>
              <h3 className="font-semibold text-emerald-800">{formData.farm_type}</h3>
              <p className="text-sm text-emerald-600">Farm Type</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <span className="text-2xl mb-1 block">🚚</span>
              <h3 className="font-semibold text-emerald-800">{formData.delivery_radius}km</h3>
              <p className="text-sm text-emerald-600">Delivery Range</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <span className="text-2xl mb-1 block">✅</span>
              <h3 className="font-semibold text-emerald-800">{formData.certifications.length}</h3>
              <p className="text-sm text-emerald-600">Certifications</p>
            </div>
          </div>

          {/* Contact and Location */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-emerald-100 p-6">
              <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                <span className="text-emerald-500 mr-2">📞</span> Contact Details
              </h3>
              <div className="space-y-3">
                <p className="flex items-center text-gray-600">
                  <span className="w-20 text-gray-500">Phone:</span>
                  <span className="font-medium">{formData.phone_number}</span>
                </p>
                <p className="flex items-center text-gray-600">
                  <span className="w-20 text-gray-500">Location:</span>
                  <span className="font-medium">{formData.location}</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-emerald-100 p-6">
              <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                <span className="text-emerald-500 mr-2">🏆</span> Certifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {formData.certifications.map((cert, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Farm Description */}
          <div className="bg-white rounded-xl border border-emerald-100 p-6 mb-8">
            <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
              <span className="text-emerald-500 mr-2">📝</span> About Our Farm
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {formData.description || "No description provided yet."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors duration-200 flex items-center"
            >
              <span className="mr-2">✏️</span> Edit Profile
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-3 border border-emerald-600 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors duration-200 flex items-center"
            >
              <span className="mr-2">📄</span> Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Additional Features */}
      <div className="mt-8 grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-emerald-100">
          <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
            <span className="text-emerald-500 mr-2">📊</span> Profile Completion
          </h3>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-emerald-100">
              <div 
                style={{ width: "80%" }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
              ></div>
            </div>
            <div className="flex justify-between text-sm text-emerald-600">
              <span>80% Complete</span>
              <span>4/5 Sections Filled</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-emerald-100">
          <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
            <span className="text-emerald-500 mr-2">⭐</span> Profile Status
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-emerald-600">Verified Farmer</span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isEditing) {
    return (
      <>
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg text-center">
            {successMessage}
          </div>
        )}
        <ProfileDisplay />
      </>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg text-center">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Image */}
        <div className="flex justify-center">
          <div className="relative">
            <img
              src={formData.profile_image ? URL.createObjectURL(formData.profile_image) : '/default-avatar.png'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-emerald-100"
            />
            <label className="absolute bottom-0 right-0 bg-emerald-500 text-white p-2 rounded-full cursor-pointer hover:bg-emerald-600 transition-colors">
              📷
              <input
                type="file"
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  profile_image: e.target.files[0]
                }))}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold text-emerald-800 mb-6">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Farmer Name Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {inputGuides.farmer_name.title}
                <span 
                  className="ml-2 text-emerald-600 cursor-pointer"
                  onMouseEnter={() => showTooltip('farmer_name')}
                  onMouseLeave={hideTooltip}
                >
                  ℹ️
                </span>
              </label>
              {activeTooltip === 'farmer_name' && (
                <div className="absolute z-10 bg-emerald-800 text-white p-3 rounded-lg text-sm w-64 shadow-lg -top-12">
                  {inputGuides.farmer_name.guide}
                  <div className="absolute bottom-[-8px] left-4 w-4 h-4 bg-emerald-800 transform rotate-45"></div>
                </div>
              )}
              <input
                type="text"
                value={formData.farmer_name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  farmer_name: e.target.value
                }))}
                onFocus={() => showTooltip('farmer_name')}
                onBlur={hideTooltip}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter your name"
              />
            </div>

            {/* Farm Name Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {inputGuides.farm_name.title}
                <span 
                  className="ml-2 text-emerald-600 cursor-pointer"
                  onMouseEnter={() => showTooltip('farm_name')}
                  onMouseLeave={hideTooltip}
                >
                  ℹ️
                </span>
              </label>
              {activeTooltip === 'farm_name' && (
                <div className="absolute z-10 bg-emerald-800 text-white p-3 rounded-lg text-sm w-64 shadow-lg -top-12">
                  {inputGuides.farm_name.guide}
                  <div className="absolute bottom-[-8px] left-4 w-4 h-4 bg-emerald-800 transform rotate-45"></div>
                </div>
              )}
              <input
                type="text"
                value={formData.farm_name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  farm_name: e.target.value
                }))}
                onFocus={() => showTooltip('farm_name')}
                onBlur={hideTooltip}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter your farm name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  phone_number: e.target.value
                }))}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="Your contact number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: e.target.value
                }))}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="Your farm location"
              />
            </div>
          </div>
        </div>

        {/* Farm Details */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold text-emerald-800 mb-6">Farm Details</h3>
          
          <div className="space-y-6">
            {/* Farm Type Select */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {inputGuides.farm_type.title}
                <span 
                  className="ml-2 text-emerald-600 cursor-pointer"
                  onMouseEnter={() => showTooltip('farm_type')}
                  onMouseLeave={hideTooltip}
                >
                  ℹ️
                </span>
              </label>
              {activeTooltip === 'farm_type' && (
                <div className="absolute z-10 bg-emerald-800 text-white p-3 rounded-lg text-sm w-64 shadow-lg -top-12">
                  {inputGuides.farm_type.guide}
                  <div className="absolute bottom-[-8px] left-4 w-4 h-4 bg-emerald-800 transform rotate-45"></div>
                </div>
              )}
              <select
                value={formData.farm_type}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  farm_type: e.target.value
                }))}
                onFocus={() => showTooltip('farm_type')}
                onBlur={hideTooltip}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select farm type</option>
                <option value="organic">Organic Farm</option>
                <option value="conventional">Conventional Farm</option>
                <option value="hydroponic">Hydroponic Farm</option>
                <option value="mixed">Mixed Farming</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">About Your Farm</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                rows={4}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="Tell customers about your farm and products..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Range (km)</label>
              <input
                type="number"
                value={formData.delivery_radius}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  delivery_radius: e.target.value
                }))}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="How far can you deliver?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Certifications</label>
              <div className="grid grid-cols-2 gap-3">
                {['Organic', 'Non-GMO', 'Fair Trade', 'Sustainable'].map(cert => (
                  <label key={cert} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-emerald-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.certifications.includes(cert)}
                      onChange={(e) => {
                        const updatedCerts = e.target.checked
                          ? [...formData.certifications, cert]
                          : formData.certifications.filter(c => c !== cert);
                        setFormData(prev => ({
                          ...prev,
                          certifications: updatedCerts
                        }));
                      }}
                      className="h-4 w-4 text-emerald-600 rounded"
                    />
                    <span className="ml-2">{cert}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Add Cancel Button next to Submit */}
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-8 py-3 rounded-lg text-emerald-600 font-medium border border-emerald-600 hover:bg-emerald-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`
              px-8 py-3 rounded-lg text-white font-medium
              ${loading ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700'}
              transition-colors duration-200
            `}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

ProfileManagement.propTypes = {
  farmerData: PropTypes.object,
  onUpdate: PropTypes.func.isRequired
};

export default ProfileManagement; 