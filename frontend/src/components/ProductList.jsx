import { useState } from 'react';
import { Star, ShoppingCart, Heart, Share2 } from 'lucide-react';

const ProductList = () => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [wishlist, setWishlist] = useState([]);

  const categories = [
    { id: 'all', label: '📦 All Products' },
    { id: 'vegetables', label: '🥬 Vegetables' },
    { id: 'fruits', label: '🍎 Fruits' },
    { id: 'grains', label: '🌾 Grains' },
    { id: 'dairy', label: '🥛 Dairy' },
    { id: 'spices', label: '🌶️ Spices' },
    { id: 'organic', label: '🌱 Organic' }
  ];

  const products = [
    {
      id: 1,
      name: "Fresh Red Tomatoes",
      price: 40,
      unit: "kg",
      rating: 4.5,
      reviews: 128,
      image_url: "/images/products/tomatoes.jpg",
      farmer_name: "Krishna Farms",
      category: "Vegetables"
    },
    {
      id: 2,
      name: "Organic Potatoes",
      price: 35,
      unit: "kg",
      rating: 4.4,
      reviews: 112,
      image_url: "/images/products/potatoes.jpg",
      farmer_name: "Himachal Farms",
      category: "Vegetables"
    },
    {
      id: 3,
      name: "Sweet Alphonso Mangoes",
      price: 400,
      unit: "dozen",
      rating: 4.8,
      reviews: 156,
      image_url: "/images/products/mangoes.jpg",
      farmer_name: "Ratnagiri Farms",
      category: "Fruits"
    },
    {
      id: 4,
      name: "Organic Brown Rice",
      price: 85,
      unit: "kg",
      rating: 4.6,
      reviews: 98,
      image_url: "/images/products/brown-rice.jpg",
      farmer_name: "Bengal Rice Co-op",
      category: "Grains"
    },
    {
      id: 5,
      name: "Fresh Cow Milk",
      price: 60,
      unit: "litre",
      rating: 4.7,
      reviews: 145,
      image_url: "/images/products/milk.jpg",
      farmer_name: "Punjab Dairy Farm",
      category: "Dairy"
    },
    {
      id: 6,
      name: "Kashmiri Red Chilli",
      price: 180,
      unit: "500g",
      rating: 4.9,
      reviews: 78,
      image_url: "/images/products/red-chilli.jpg",
      farmer_name: "Kashmir Spice Garden",
      category: "Spices"
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const shareProduct = (product) => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} from ${product.farmer_name}!`,
        url: window.location.href,
      });
    }
  };

  const filteredProducts = selectedCategory.toLowerCase() === 'all'
    ? products
    : products.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Category Filter */}
      <div className="flex overflow-x-auto pb-4 mb-6 gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Floating Action Buttons */}
              <div className={`absolute right-4 top-4 transition-opacity duration-300 ${
                hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  >
                    <Heart
                      size={20}
                      className={wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                    />
                  </button>
                  <button
                    onClick={() => shareProduct(product)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  >
                    <Share2 size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Category Badge */}
              <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 rounded-full text-sm font-medium text-gray-700">
                {product.category}
              </span>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500">by {product.farmer_name}</p>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-baseline">
                  <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                  <span className="text-sm text-gray-500 ml-1">/{product.unit}</span>
                </div>
                <div className="flex items-center">
                  <div className="flex mr-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.reviews})
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 group"
              >
                <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList; 