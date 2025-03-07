import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from '../utils/axios';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import Spinner from './ui/Spinner';
import SectionHeader from './ui/SectionHeader';

const Home = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchHomeData();
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

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?search=${searchQuery}`);
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <section className="relative h-[calc(100vh-80px)] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('public/images/Backgroundimage.jpg')",
            transform: "translateZ(-1px) scale(2)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        <div className="relative h-full flex flex-col justify-center items-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-6 max-w-5xl animate-fade-in">
            Fresh from Local Farmers
          </h1>
          <p className="text-xl md:text-2xl text-center mb-12 max-w-2xl animate-fade-in-delay">
            Support local farmers and get fresh produce delivered to your doorstep
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl mb-8 animate-fade-in-delay">
            <div className="flex gap-2">
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for fresh produce..."
                className="bg-white/90 backdrop-blur-sm text-gray-800"
              />
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Search
              </Button>
            </div>
          </form>

          <div className="flex flex-col md:flex-row gap-4 animate-fade-in-delay-2">
            <Button
              onClick={() => navigate('/products')}
              className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3"
            >
              Browse Products
            </Button>
            <Button
              onClick={() => navigate('/farmer/dashboard')}
              variant="secondary"
              className="bg-white text-green-600 hover:bg-green-50 text-lg px-8 py-3"
            >
              Sell as Farmer
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Browse Categories" 
            subtitle="Find what you need"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`
                  cursor-pointer transform transition-all duration-300
                  ${activeCategory === category.id ? 'ring-2 ring-green-500 scale-105' : 'hover:scale-105'}
                `}
                onClick={() => {
                  setActiveCategory(category.id);
                  navigate(`/products?category=${category.slug}`);
                }}
              >
                <div className="p-4 text-center">
                  <div className="w-16 h-16 mx-auto mb-3">
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="font-medium text-gray-800">{category.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{category.product_count} items</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Featured Products" 
            subtitle="Hand-picked fresh items"
            action={
              <Button
                onClick={() => navigate('/products')}
                variant="outline"
                className="hidden md:block"
              >
                View All
              </Button>
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link 
                key={product.id}
                to={`/products/${product.id}`}
                className="transform transition-all duration-300 hover:scale-105"
              >
                <Card>
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.discount > 0 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.farmer_name}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-bold">${product.price}</span>
                        {product.original_price && (
                          <span className="text-sm text-gray-400 line-through">
                            ${product.original_price}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-yellow-400">
                        <span>★</span>
                        <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Button
              onClick={() => navigate('/products')}
              variant="outline"
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Find Local Markets" 
            subtitle="Discover farmers near you"
          />
          <div className="h-[600px] rounded-xl overflow-hidden shadow-xl">
            <MapContainer 
              center={[51.505, -0.09]} 
              zoom={13} 
              className="h-full w-full"
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {farmers.map((farmer) => (
                <Marker key={farmer.id} position={[farmer.lat, farmer.lng]}>
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-medium">{farmer.name}</h3>
                      <p className="text-sm text-gray-600">{farmer.farm}</p>
                      <Link 
                        to={`/farmer/${farmer.id}`}
                        className="text-green-600 hover:text-green-700 text-sm mt-2 block"
                      >
                        View Profile →
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Why Choose Us" 
            subtitle="The benefits of shopping with local farmers"
            className="text-center"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {[
              {
                icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
                title: "Fresh & Local",
                description: "Direct from local farms to your table within 24 hours"
              },
              {
                icon: "M9 12l2 2 4-4",
                title: "Quality Guaranteed",
                description: "All products are carefully selected and quality-checked"
              },
              {
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
                title: "Fast Delivery",
                description: "Same-day delivery available for orders before 2 PM"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-6 text-center transform hover:scale-105 transition-transform duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <svg 
                    className="w-8 h-8 text-green-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d={feature.icon}
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Stay Updated" 
            subtitle="Get exclusive offers and updates!"
            className="text-center"
          />
          <form onSubmit={handleSubscribe} className="max-w-3xl mx-auto flex gap-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1"
              required
            />
            <Button type="submit">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home; 