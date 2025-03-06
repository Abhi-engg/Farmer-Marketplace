import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css';

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user/', {
          withCredentials: true
        });
        console.log('User data:', response.data); // Debug log
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="home-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <div className="home-container">
          <p>Error loading user data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="home-container">
        <h2 className="welcome-title">Welcome, {user.username}! 👋</h2>
        <p className="email-text">Email: {user.email}</p>
        {/* Add any additional user details you want to display */}
      </div>
    </div>
  );
};

export default Home; 