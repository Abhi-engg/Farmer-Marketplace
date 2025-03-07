import { useState, useEffect } from 'react';
import { Button } from '../common';

const ProfileManagement = () => {
  const [profile, setProfile] = useState({
    farmName: '',
    description: '',
    location: '',
    story: '',
    image: null,
    phone: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const hostname = window.location.hostname;
      const response = await fetch(`http://${hostname}:8000/api/farmer/profile/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(profile).forEach(key => {
        formData.append(key, profile[key]);
      });

      const hostname = window.location.hostname;
      const response = await fetch(`http://${hostname}:8000/api/farmer/profile/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
      }
    } catch (error) {
      setMessage('Failed to update profile');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Farm Profile</h1>
      
      {message && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Farm Name
          </label>
          <input
            type="text"
            name="farmName"
            value={profile.farmName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Farm Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={profile.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Farm Description
          </label>
          <textarea
            name="description"
            value={profile.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Your Story
          </label>
          <textarea
            name="story"
            value={profile.story}
            onChange={handleChange}
            rows={5}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="Share your farming journey..."
          />
        </div>

        <Button type="submit" variant="primary">
          Save Profile
        </Button>
      </form>
    </div>
  );
};

export default ProfileManagement; 