import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ArrowRight, Leaf, Users, TrendingUp, Truck, Shield, Heart } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import axios from '../utils/axios';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import Spinner from './ui/Spinner';
import SectionHeader from './ui/SectionHeader';
import L from 'leaflet';

// Custom marker icon
const customIcon = L.icon({
  iconUrl: '/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: '/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const Home = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchHomeData();
    fetchFarmerLocations();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [productsRes, categoriesRes, farmersRes] = await Promise.all([
        axios.get('/api/products/featured/'),
        axios.get('/api/categories/'),
        axios.get('/api/farmers/locations/')
      ]);
      setFeaturedProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setFarmers(farmersRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching home data:', error);
      setLoading(false);
    }
  };

  const fetchFarmerLocations = async () => {
    try {
      const response = await axios.get('/api/farmers/locations/');
      setFarmers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching farmer locations:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/shop?search=${searchQuery}`);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/subscribe/', { email });
      alert('Successfully subscribed!');
      setEmail('');
    } catch (error) {
      alert('Subscription failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-emerald-600/90">
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/images/hero-bg.jpg')",
            zIndex: -1
          }}
        />
        <div className="container mx-auto px-4 relative z-10 text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Fresh from Farm <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">
              Direct to Your Table
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl text-gray-200">
            Connecting farmers directly with consumers. No middlemen, just fresh, local produce at fair prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-4 bg-white text-green-600 rounded-full font-semibold
                hover:bg-green-50 transition-all duration-300 text-lg
                flex items-center justify-center group"
            >
              Start Shopping
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/farmer/dashboard')}
              className="px-8 py-4 bg-transparent border-2 border-white rounded-full
                font-semibold hover:bg-white/10 transition-all duration-300 text-lg"
            >
              Become a Seller
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're revolutionizing the agricultural marketplace by connecting farmers directly with consumers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-12 h-12 text-green-600" />,
                title: "Direct Connection",
                description: "Connect directly with local farmers, eliminating middlemen and reducing costs"
              },
              {
                icon: <Leaf className="w-12 h-12 text-green-600" />,
                title: "Fresh Produce",
                description: "Get fresh, seasonal produce directly from farms to your doorstep"
              },
              {
                icon: <TrendingUp className="w-12 h-12 text-green-600" />,
                title: "Fair Prices",
                description: "Better prices for both farmers and consumers through direct trade"
              }
            ].map((feature, index) => (
              <div key={index} className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "01", title: "Browse", description: "Explore fresh produce from local farmers" },
              { number: "02", title: "Select", description: "Choose your favorite products" },
              { number: "03", title: "Order", description: "Place your order with secure payment" },
              { number: "04", title: "Receive", description: "Get fresh delivery to your doorstep" }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Benefits for Everyone</h2>
              <div className="space-y-6">
                {[
                  { icon: <Leaf />, title: "For Farmers", points: ["Better profit margins", "Direct market access", "Customer insights"] },
                  { icon: <Heart />, title: "For Consumers", points: ["Fresh produce", "Better prices", "Support local farmers"] }
                ].map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                      <ul className="space-y-2">
                        {benefit.points.map((point, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src="/images/benefits.jpg" 
                alt="Benefits" 
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <TrendingUp />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Savings</p>
                    <p className="text-2xl font-bold text-green-600">25%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Farmer Network */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Farmer Network</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover local farmers in your area and connect directly with them
            </p>
          </div>
          
          <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
              </div>
            ) : (
              <MapContainer 
                center={[20.5937, 78.9629]} // Center of India
                zoom={5} 
                className="h-full w-full"
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {farmers.map((farmer) => (
                  <Marker
                    key={farmer.id}
                    position={[farmer.latitude, farmer.longitude]}
                    icon={customIcon}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold text-lg text-green-600">
                          {farmer.farm_name}
                        </h3>
                        <p className="text-gray-600">{farmer.name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {farmer.location}
                        </p>
                        <div className="mt-2 flex gap-2">
                          <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                            {farmer.products_count} Products
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                            {farmer.rating} ★
                          </span>
                        </div>
                        <button
                          onClick={() => navigate(`/farmer/${farmer.id}`)}
                          className="mt-3 w-full px-3 py-1.5 bg-green-600 text-white rounded-lg
                            text-sm hover:bg-green-700 transition-colors"
                        >
                          View Profile
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Region Highlights */}
                <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
                  <h4 className="font-semibold text-green-600 mb-2">Regions</h4>
                  <div className="space-y-1">
                    {farmers.reduce((acc, farmer) => {
                      if (!acc.includes(farmer.region)) {
                        acc.push(farmer.region);
                      }
                      return acc;
                    }, []).map((region) => (
                      <div key={region} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-600">{region}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </MapContainer>
            )}

            {/* Map Stats */}
            <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Total Farmers</p>
                  <p className="text-2xl font-bold text-green-600">{farmers.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Regions</p>
                  <p className="text-2xl font-bold text-green-600">
                    {new Set(farmers.map(f => f.region)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Shield />, title: "Secure Payments", description: "100% secure transaction" },
              { icon: <Truck />, title: "Fast Delivery", description: "Same day delivery available" },
              { icon: <Users />, title: "Verified Farmers", description: "All farmers are verified" }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-green-100">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of farmers and consumers. Start buying or selling fresh produce today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-4 bg-green-600 text-white rounded-full font-semibold
                hover:bg-green-700 transition-all duration-300 text-lg"
            >
              Start Shopping
            </button>
            <button
              onClick={() => navigate('/farmer/register')}
              className="px-8 py-4 bg-white text-green-600 border-2 border-green-600 rounded-full
                font-semibold hover:bg-green-50 transition-all duration-300 text-lg"
            >
              Become a Seller
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 