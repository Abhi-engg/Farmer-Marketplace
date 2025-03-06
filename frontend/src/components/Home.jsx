import { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  MagnifyingGlassIcon, 
  ChevronDownIcon 
} from '@heroicons/react/24/outline';
import { Button, Rating } from './common/index';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonialIndex((prev) => 
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleAddToCart = useCallback((productId) => {
    setCartCount(prev => prev + 1);
    console.log(`Adding product ${productId} to cart`);
  }, []);

  const handleSubscribe = useCallback((e) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
  }, []);

  const farmers = [
    { id: 1, name: 'John Smith', farm: 'Green Acres Farm', rating: 4.8 },
    { id: 2, name: 'Sarah Johnson', farm: 'Sunny Valley Organics', rating: 4.9 },
    { id: 3, name: 'Mike Williams', farm: 'Fresh Fields Farm', rating: 4.7 },
    { id: 4, name: 'Emma Davis', farm: 'Harvest Moon Farm', rating: 4.8 }
  ];

  const features = [
    { icon: '🌱', title: 'Fresh & Organic', description: 'Direct from local farms to your table' },
    { icon: '💰', title: 'Affordable Prices', description: 'Fair prices for farmers and customers' },
    { icon: '🌍', title: 'Sustainable & Local', description: 'Support your local farming community' },
    { icon: '🚚', title: 'Fast Delivery', description: 'Same-day delivery available' }
  ];

  const products = [
    { id: 1, name: 'Fresh Organic Tomatoes', price: 4.99, rating: 4.8, image: '/images/products/tomatoes.jpg' },
    { id: 2, name: 'Farm Fresh Eggs', price: 6.99, rating: 4.9, image: '/images/products/eggs.jpg' },
    { id: 3, name: 'Organic Baby Spinach', price: 3.99, rating: 4.7, image: '/images/products/spinach.jpg' },
    { id: 4, name: 'Local Honey', price: 8.99, rating: 5.0, image: '/images/products/honey.jpg' }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Jane Cooper',
      rating: 5,
      comment: "The freshest produce I've ever had! Great service and quick delivery.",
      image: '/images/testimonials/jane.jpg'
    },
    {
      id: 2,
      name: 'John Smith',
      rating: 5,
      comment: 'Supporting local farmers while getting quality products. Win-win!',
      image: '/images/testimonials/john.jpg'
    }
  ];

  return (
    <div className="fixed inset-0 flex flex-col overflow-y-auto overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md w-full h-[80px]">
        <div className="w-full h-full px-8">
          <div className="max-w-[2000px] mx-auto h-full flex items-center justify-between">
            <a href="/" className="flex items-center flex-shrink-0">
              <img src="/logo.svg" alt="Farmers' Marketplace" className="h-12" />
              <span className="ml-3 text-2xl font-bold text-green-600">Farmers&apos; Marketplace</span>
            </a>

            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products, farmers, or markets..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg border text-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              </div>
            </div>

            <div className="hidden md:flex items-center mx-8 flex-shrink-0">
              <button className="flex items-center space-x-2 text-lg text-gray-700 hover:text-green-600">
                <span>Categories</span>
                <ChevronDownIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-6 flex-shrink-0">
              <button className="text-gray-700 hover:text-green-600">
                <UserIcon className="w-8 h-8" />
              </button>
              <button className="relative text-gray-700 hover:text-green-600">
                <ShoppingCartIcon className="w-8 h-8" />
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <section 
          className="relative h-[calc(100vh-80px)] bg-cover bg-center w-full flex-shrink-0" 
          style={{ backgroundImage: 'url("")' }}
          role="banner"
          aria-label="Homepage hero section"
        >
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          <img 
            src="/images/hero-banner.jpg" 
            alt="" 
            className="hidden" 
            onLoad={handleImageLoad}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="relative h-full flex flex-col justify-center items-center text-white px-8">
            <h1 className="text-7xl font-bold text-center mb-8 max-w-5xl">
              Fresh from the Farm, Delivered to You!
            </h1>
            <div className="flex gap-6">
              <Button 
                variant="primary"
                onClick={() => navigate('/products')}
              >
                Explore Products
              </Button>
              <Button 
                variant="secondary"
                onClick={() => navigate('/login')}
              >
                Sell as a Farmer
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Farmers Section */}
        <section className="py-24 bg-gray-50 w-full flex-shrink-0">
          <div className="max-w-[2000px] mx-auto px-8">
            <h2 className="text-4xl font-bold mb-12">Featured Farmers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {farmers.map((farmer) => (
                <div key={farmer.id} className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
                  <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
                    <img 
                      src={`/images/farmer-${farmer.id}.jpg`} 
                      alt={`${farmer.name}'s farm`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-farm.jpg'
                      }}
                    />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">{farmer.name}</h3>
                  <p className="text-gray-600 text-lg mb-4">{farmer.farm}</p>
                  <div className="flex items-center mb-6">
                    <Rating rating={farmer.rating} />
                  </div>
                  <div className="flex gap-4">
                    <button 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg transition-colors"
                      onClick={() => window.location.href = `/farmer/${farmer.id}`}
                    >
                      View Profile
                    </button>
                    <button 
                      className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-50 py-3 rounded-lg text-lg transition-colors"
                      onClick={() => window.location.href = `/shop/${farmer.id}`}
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 w-full flex-shrink-0">
          <div className="max-w-[2000px] mx-auto px-8">
            <h2 className="text-4xl font-bold mb-16 text-center">Why Shop With Us?</h2>
            <div className="grid grid-cols-4 gap-12">
              {features.map((feature) => (
                <div key={feature.title} className="text-center transform hover:scale-105 transition-transform duration-300">
                  <div className="text-6xl mb-6" role="img" aria-label={feature.title}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 text-lg">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-24 bg-gray-50 w-full flex-shrink-0">
          <div className="max-w-[2000px] mx-auto px-8">
            <h2 className="text-4xl font-bold mb-12">Popular Products</h2>
            <div className="grid grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-72 object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-product.jpg'
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-semibold text-green-600">
                      ${product.price}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{product.name}</h3>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <Rating rating={product.rating} showNumber={true} />
                      </div>
                    </div>
                    <button 
                      className="w-full bg-green-600 text-white py-3 rounded-lg text-lg hover:bg-green-700 transition-colors"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-24 w-full flex-shrink-0">
          <div className="max-w-[2000px] mx-auto px-8">
            <h2 className="text-4xl font-bold mb-12">Find Local Markets</h2>
            <div className="h-[600px] rounded-xl overflow-hidden shadow-lg">
              <MapContainer center={[51.505, -0.09]} zoom={13} className="h-full">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              </MapContainer>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-gray-50 w-full flex-shrink-0">
          <div className="max-w-[2000px] mx-auto px-8">
            <h2 className="text-4xl font-bold mb-16 text-center">What Our Customers Say</h2>
            <div className="flex overflow-hidden relative">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 transition-transform duration-500"
                  style={{ transform: `translateX(-${activeTestimonialIndex * 100}%)` }}
                >
                  <div className="max-w-4xl mx-auto text-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-32 h-32 rounded-full mx-auto mb-8 object-cover"
                    />
                    <p className="text-gray-600 text-2xl mb-8 italic">
                      &ldquo;{testimonial.comment}&rdquo;
                    </p>
                    <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                    <div className="flex justify-center mt-4">
                      <Rating rating={testimonial.rating} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-24 bg-green-50 w-full flex-shrink-0">
          <div className="max-w-[2000px] mx-auto px-8">
            <h2 className="text-4xl font-bold mb-6 text-center">Stay Updated</h2>
            <p className="text-gray-600 text-xl mb-12 text-center">Get exclusive offers & updates!</p>
            <form onSubmit={handleSubscribe} className="max-w-3xl mx-auto flex gap-6">
              <input
                type="email"
                placeholder="Enter your email"
                required
                aria-label="Email address"
                className="flex-1 px-6 py-4 rounded-lg text-lg border focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <Button 
                type="submit"
                variant="primary"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home; 