import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from '../../utils/axios';

const ProfileManagement = ({ farmerData, onUpdate }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    farmer_name: '',
    farm_name: '',
    phone_number: '',
    location: '',
    profile_image: null,
    farm_type: '',
    description: '',
    story: '',
    certifications: [],
    farm_photos: [],
    delivery_radius: '',
    preferred_payment: [],
    social_media: {
      facebook: '',
      instagram: '',
      twitter: ''
    }
  });

  useEffect(() => {
    if (farmerData) {
      setFormData(prev => ({
        ...prev,
        ...farmerData
      }));
    }
  }, [farmerData]);

  const steps = [
    { title: 'Basic Info', icon: '👤' },
    { title: 'Farm Details', icon: '🏡' },
    { title: 'Photos', icon: '📸' },
    { title: 'Business', icon: '💼' },
    { title: 'Review', icon: '✅' }
  ];

  const handleVoiceInput = async (fieldName) => {
    try {
      setIsRecording(true);
      // Voice recognition logic here
      const recognition = new window.webkitSpeechRecognition();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setFormData(prev => ({
          ...prev,
          [fieldName]: transcript
        }));
      };
      recognition.start();
    } catch (error) {
      console.error('Voice input error:', error);
    } finally {
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'farm_photos') {
          formData.farm_photos.forEach(photo => {
            data.append('farm_photos', photo);
          });
        } else if (key === 'social_media') {
          data.append('social_media', JSON.stringify(formData.social_media));
        } else {
          data.append(key, formData[key]);
        }
      });

      await axios.post('/api/farmer/profile/update/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUpdate();
      setSuccessMessage('Profile updated successfully!');
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={formData.profile_image ? URL.createObjectURL(formData.profile_image) : '/default-avatar.png'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-green-100"
                />
                <label className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700">
                  📷
                  <input
                    type="file"
                    name="profile_image"
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
            
            {/* Basic Info Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Farmer Name
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="farmer_name"
                    value={formData.farmer_name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      farmer_name: e.target.value
                    }))}
                    className="flex-1 rounded-l-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleVoiceInput('farmer_name')}
                    className={`px-3 py-2 rounded-r-md border border-l-0 ${
                      isRecording ? 'bg-red-500' : 'bg-green-600'
                    } text-white`}
                  >
                    🎤
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Farm Name</label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={formData.farm_name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      farm_name: e.target.value
                    }))}
                    className="w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                    placeholder="Your farm's name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="mt-1">
                  <input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      phone_number: e.target.value
                    }))}
                    className="w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: e.target.value
                    }))}
                    className="flex-1 rounded-l-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                    placeholder="Farm address"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMap(true)}
                    className="px-3 py-2 rounded-r-md border border-l-0 bg-green-600 text-white hover:bg-green-700"
                  >
                    📍
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Farm Type</label>
              <select
                value={formData.farm_type}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  farm_type: e.target.value
                }))}
                className="mt-1 w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
              >
                <option value="">Select farm type</option>
                <option value="organic">Organic Farm</option>
                <option value="conventional">Conventional Farm</option>
                <option value="hydroponic">Hydroponic Farm</option>
                <option value="aquaponic">Aquaponic Farm</option>
                <option value="mixed">Mixed Farming</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <div className="mt-1">
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  rows={3}
                  className="w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                  placeholder="Brief description of your farm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Your Story</label>
              <div className="mt-1">
                <textarea
                  value={formData.story}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    story: e.target.value
                  }))}
                  rows={5}
                  className="w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                  placeholder="Share your farming journey"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Certifications</label>
              <div className="mt-2 space-y-2">
                {['Organic', 'Non-GMO', 'Fair Trade', 'Sustainable'].map(cert => (
                  <label key={cert} className="inline-flex items-center mr-4">
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
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2">{cert}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Farm Photos</label>
              <div className="mt-2">
                <div className="flex items-center justify-center w-full">
                  <label className="w-full h-32 flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <span className="text-2xl mb-2">📸</span>
                      <p className="text-sm text-gray-600">Click to upload farm photos</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        setFormData(prev => ({
                          ...prev,
                          farm_photos: [...prev.farm_photos, ...files]
                        }));
                      }}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>
            </div>

            {formData.farm_photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {formData.farm_photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Farm photo ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          farm_photos: prev.farm_photos.filter((_, i) => i !== index)
                        }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Delivery Radius (km)</label>
              <div className="mt-1">
                <input
                  type="number"
                  value={formData.delivery_radius}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    delivery_radius: e.target.value
                  }))}
                  className="w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                  placeholder="Maximum delivery distance"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Payment Methods</label>
              <div className="mt-2 space-y-2">
                {['Cash', 'Credit Card', 'Bank Transfer', 'Mobile Payment'].map(method => (
                  <label key={method} className="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      checked={formData.preferred_payment.includes(method)}
                      onChange={(e) => {
                        const updatedMethods = e.target.checked
                          ? [...formData.preferred_payment, method]
                          : formData.preferred_payment.filter(m => m !== method);
                        setFormData(prev => ({
                          ...prev,
                          preferred_payment: updatedMethods
                        }));
                      }}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Social Media</label>
              <div className="space-y-4 mt-2">
                <div>
                  <label className="inline-flex items-center">
                    <span className="mr-2">📘</span> Facebook
                  </label>
                  <input
                    type="text"
                    value={formData.social_media.facebook}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      social_media: {
                        ...prev.social_media,
                        facebook: e.target.value
                      }
                    }))}
                    className="mt-1 w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                    placeholder="Facebook profile URL"
                  />
                </div>
                
                <div>
                  <label className="inline-flex items-center">
                    <span className="mr-2">📸</span> Instagram
                  </label>
                  <input
                    type="text"
                    value={formData.social_media.instagram}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      social_media: {
                        ...prev.social_media,
                        instagram: e.target.value
                      }
                    }))}
                    className="mt-1 w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                    placeholder="Instagram profile URL"
                  />
                </div>

                <div>
                  <label className="inline-flex items-center">
                    <span className="mr-2">🐦</span> Twitter
                  </label>
                  <input
                    type="text"
                    value={formData.social_media.twitter}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      social_media: {
                        ...prev.social_media,
                        twitter: e.target.value
                      }
                    }))}
                    className="mt-1 w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                    placeholder="Twitter profile URL"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Review Your Information</h3>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries({
                  'Farm Name': formData.farm_name,
                  'Farmer Name': formData.farmer_name,
                  'Phone': formData.phone_number,
                  'Location': formData.location,
                  'Farm Type': formData.farm_type,
                  'Delivery Radius': `${formData.delivery_radius} km`,
                  'Certifications': formData.certifications.join(', ') || 'None',
                  'Description': formData.description
                }).map(([key, value]) => (
                  <div key={key} className={key === 'Description' ? 'col-span-2' : ''}>
                    <dt className="text-sm font-medium text-gray-500">{key}</dt>
                    <dd className="mt-1 text-sm text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderProfile = () => {
    return (
      <div className="max-w-4xl mx-auto">
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex justify-between items-center">
            {successMessage}
            <button onClick={() => setSuccessMessage('')}>✕</button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-green-600">
            <div className="absolute -bottom-16 left-8">
              <img
                src={formData.profile_image ? URL.createObjectURL(formData.profile_image) : '/default-avatar.png'}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            {/* Basic Info Section */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{formData.farm_name}</h1>
                <p className="text-gray-600">{formData.farmer_name}</p>
              </div>
              <button
                onClick={() => setIsEditMode(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                ✏️ Edit Profile
              </button>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h2 className="text-lg font-semibold mb-3">Contact Information</h2>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <span className="mr-2">📞</span> {formData.phone_number}
                  </p>
                  <p className="flex items-center">
                    <span className="mr-2">📍</span> {formData.location}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-3">Farm Details</h2>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <span className="mr-2">🌾</span> {formData.farm_type}
                  </p>
                  <p className="flex items-center">
                    <span className="mr-2">🚚</span> Delivers within {formData.delivery_radius} km
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">About the Farm</h2>
              <p className="text-gray-600">{formData.description}</p>
            </div>

            {/* Certifications */}
            {formData.certifications.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3">Certifications</h2>
                <div className="flex flex-wrap gap-2">
                  {formData.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      ✅ {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Farm Photos */}
            {formData.farm_photos.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3">Farm Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.farm_photos.map((photo, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(photo)}
                      alt={`Farm photo ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Social Media */}
            {Object.values(formData.social_media).some(value => value) && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Connect With Us</h2>
                <div className="flex space-x-4">
                  {formData.social_media.facebook && (
                    <a
                      href={formData.social_media.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      📘 Facebook
                    </a>
                  )}
                  {formData.social_media.instagram && (
                    <a
                      href={formData.social_media.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700"
                    >
                      📸 Instagram
                    </a>
                  )}
                  {formData.social_media.twitter && (
                    <a
                      href={formData.social_media.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-500"
                    >
                      🐦 Twitter
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!isEditMode) {
    return renderProfile();
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center ${
              index < steps.length - 1 ? 'flex-1' : ''
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index <= currentStep ? 'bg-green-600 text-white' : 'bg-gray-200'
              }`}
            >
              {step.icon}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 ${
                  index < currentStep ? 'bg-green-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            ⬅️ Back
          </button>
        )}
        <button
          onClick={currentStep === steps.length - 1 ? handleSubmit : () => setCurrentStep(prev => prev + 1)}
          disabled={loading}
          className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <span className="flex items-center">
              <div className="animate-spin mr-2">⌛</div>
              Saving...
            </span>
          ) : currentStep === steps.length - 1 ? (
            'Save Profile ✅'
          ) : (
            'Next ➡️'
          )}
        </button>
      </div>

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">Select Location</h3>
              <button onClick={() => setShowMap(false)}>✕</button>
            </div>
            <div className="h-96">
              {/* Add map component here */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ProfileManagement.propTypes = {
  farmerData: PropTypes.object,
  onUpdate: PropTypes.func.isRequired
};

export default ProfileManagement; 