import { useState, useEffect } from 'react';
import { Star, ShoppingCart, Heart, Share2, QrCode } from 'lucide-react';

const ProductGrid = ({ 
  selectedCategory = 'All', 
  onAddToCart, 
  searchQuery = '', 
  sortBy = 'relevance',
  isManagement = false, 
  onEdit, 
  onDelete 
}) => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const products = [
    // Vegetables Category
  {
    id: 1,
    name: "Fresh Red Tomatoes",
    price: 40,
    unit: "kg",
    rating: 4.5,
    reviews: 128,
    image: "/images/tomatos.jpg",
    farmer: "Krishna Farms",
    location: "Nashik, Maharashtra",
    category: "Vegetables"
  },
  {
    id: 26,
    name: "Organic Potatoes",
    price: 35,
    unit: "kg",
    rating: 4.4,
    reviews: 112,
    image: "/images/potatos.jpg",
    farmer: "Himachal Farms",
    location: "Shimla, Himachal Pradesh",
    category: "Vegetables"
  },
  {
    id: 27,
    name: "Fresh Onions",
    price: 45,
    unit: "kg",
    rating: 4.3,
    reviews: 98,
    image: "/images/FreshOnions.jpg",
    farmer: "Maharashtra Farmers Co-op",
    location: "Lasalgaon, Maharashtra",
    category: "Vegetables"
  },

  // Fruits Category
  {
    id: 28,
    name: "Sweet Bananas",
    price: 60,
    unit: "dozen",
    rating: 4.6,
    reviews: 145,
    image: "/images/banana.jpg",
    farmer: "Karnataka Fruit Farm",
    location: "Mysore, Karnataka",
    category: "Fruits"
  },
  {
    id: 29,
    name: "Fresh Pomegranate",
    price: 180,
    unit: "kg",
    rating: 4.7,
    reviews: 167,
    image: "/images/freshpomegranate.jpg",
    farmer: "Maharashtra Fruit Co-op",
    location: "Solapur, Maharashtra",
    category: "Fruits"
  },

  // Dairy Category
  {
    id: 30,
    name: "Organic Butter",
    price: 240,
    unit: "500g",
    rating: 4.8,
    reviews: 134,
    image: "/images/organic butter.jpg",
    farmer: "Punjab Dairy Co-op",
    location: "Amritsar, Punjab",
    category: "Dairy"
  },
  {
    id: 31,
    name: "Fresh Curd",
    price: 50,
    unit: "kg",
    rating: 4.5,
    reviews: 178,
    image: "/images/fresh curd.jpg",
    farmer: "Gujarat Dairy Farm",
    location: "Anand, Gujarat",
    category: "Dairy"
  },

  // Grains Category
  {
    id: 32,
    name: "Organic Quinoa",
    price: 450,
    unit: "kg",
    rating: 4.7,
    reviews: 89,
    image: "/images/Organic Quinoa.jpg",
    farmer: "Uttarakhand Organic",
    location: "Dehradun, Uttarakhand",
    category: "Grains"
  },
  {
    id: 33,
    name: "Brown Rice",
    price: 85,
    unit: "kg",
    rating: 4.6,
    reviews: 156,
    image: "/images/brown rice.jpg",
    farmer: "Bengal Rice Co-op",
    location: "Bardhaman, West Bengal",
    category: "Grains"
  },

  // Spices Category
  {
    id: 34,
    name: "Kashmiri Saffron",
    price: 750,
    unit: "10g",
    rating: 4.9,
    reviews: 203,
    image: "/images/Kashmiri Saffron.jpg",
    farmer: "Kashmir Valley Co-op",
    location: "Pampore, Kashmir",
    category: "Spices"
  },
  {
    id: 35,
    name: "Cinnamon Sticks",
    price: 280,
    unit: "100g",
    rating: 4.7,
    reviews: 145,
    image: "/images/Cinnamon Sticks.jpg",
    farmer: "Kerala Spice Garden",
    location: "Kochi, Kerala",
    category: "Spices"
  },

  // Pulses Category
  {
    id: 36,
    name: "Yellow Dal",
    price: 110,
    unit: "kg",
    rating: 4.5,
    reviews: 167,
    image: "/images/Yellow Dal.jpg",
    farmer: "MP Pulse Farmers",
    location: "Indore, Madhya Pradesh",
    category: "Pulses"
  },
  {
    id: 37,
    name: "Black Urad Dal",
    price: 140,
    unit: "kg",
    rating: 4.6,
    reviews: 134,
    image: "/images/Black Urad Dal.jpg",
    farmer: "Maharashtra Dal Mill",
    location: "Nagpur, Maharashtra",
    category: "Pulses"
  },

  // Nuts Category
  {
    id: 38,
    name: "Kashmiri Walnuts",
    price: 850,
    unit: "kg",
    rating: 4.8,
    reviews: 178,
    image: "/images/Kashmiri Walnuts.jpg",
    farmer: "Kashmir Nut Co-op",
    location: "Anantnag, Kashmir",
    category: "Nuts"
  },
  {
    id: 39,
    name: "Organic Cashews",
    price: 950,
    unit: "kg",
    rating: 4.7,
    reviews: 156,
    image: "/images/Organic Cashews.jpg",
    farmer: "Goa Cashew Farm",
    location: "Panaji, Goa",
    category: "Nuts"
  },

  // Organic Category
  {
    id: 40,
    name: "Organic Moringa Powder",
    price: 380,
    unit: "250g",
    rating: 4.8,
    reviews: 145,
    image: "/images/Organic Moringa Powder.jpg",
    farmer: "Tamil Organic Farm",
    location: "Coimbatore, Tamil Nadu",
    category: "Organic"
  },
  {
    id: 41,
    name: "Organic Amla",
    price: 120,
    unit: "kg",
    rating: 4.6,
    reviews: 123,
    image: "/images/Organic Amla.jpg",
    farmer: "UP Organic Co-op",
    location: "Pratapgarh, Uttar Pradesh",
    category: "Organic"
  },
  {
    id: 2,
    name: "Kashmir Apples",
    price: 180,
    unit: "kg",
    rating: 4.8,
    reviews: 95,
    image: "/images/Kashmir Apples.jpg",
    farmer: "Himalayan Orchards",
    location: "Sopore, Kashmir",
    category: "Fruits"
  },
  {
    id: 3,
    name: "Country Eggs",
    price: 90,
    unit: "dozen",
    rating: 4.9,
    reviews: 156,
    image: "/images/country egg.jpg",
    farmer: "Punjab Poultry Farm",
    location: "Ludhiana, Punjab",
    category: "Eggs"
  },
  {
    id: 4,
    name: "Fresh Buffalo Milk",
    price: 65,
    unit: "litre",
    rating: 4.7,
    reviews: 89,
    image: "/images/Fresh Buffalo Milk.jpg",
    farmer: "Amul Dairy Farm",
    location: "Amritsar, Punjab",
    category: "Dairy"
  },
  {
    id: 5,
    name: "Pure Forest Honey",
    price: 450,
    unit: "500g",
    rating: 5.0,
    reviews: 203,
    image: "/images/Pure Forest Honey.jpg",
    farmer: "Nilgiri Apiaries",
    location: "Nilgiris, Tamil Nadu",
    category: "Honey"
  },
  {
    id: 6,
    name: "Organic Basmati Rice",
    price: 160,
    unit: "kg",
    rating: 4.6,
    reviews: 75,
    image: "/images/Organic Basmati Rice.jpg",
    farmer: "Punjab Grain Co-op",
    location: "Ferozepur, Punjab",
    category: "Grains"
  },
  {
    id: 7,
    name: "Fresh Palak",
    price: 30,
    unit: "bunch",
    rating: 4.4,
    reviews: 112,
    image: "/images/Fresh Palak.jpg",
    farmer: "UP Green Farms",
    location: "Mirzapur, Uttar Pradesh",
    category: "Vegetables"
  },
  {
    id: 8,
    name: "Alphonso Mangoes",
    price: 400,
    unit: "dozen",
    rating: 4.9,
    reviews: 167,
    image: "/images/Alphonso Mangoes.jpg",
    farmer: "Ratnagiri Farms",
    location: "Ratnagiri, Maharashtra",
    category: "Fruits"
  },
  {
    id: 9,
    name: "Fresh Paneer",
    price: 320,
    unit: "kg",
    rating: 4.8,
    reviews: 143,
    image: "/images/Fresh Paneer.jpg",
    farmer: "Gujarat Dairy Co-op",
    location: "Ahmedabad, Gujarat",
    category: "Dairy"
  },
  {
    id: 10,
    name: "Organic Cauliflower",
    price: 45,
    unit: "piece",
    rating: 4.3,
    reviews: 98,
    image: "/images/Organic Cauliflower.jpg",
    farmer: "Himachal Farms",
    location: "Shimla, Himachal Pradesh",
    category: "Vegetables"
  },
  {
    id: 11,
    name: "Sweet Litchi",
    price: 200,
    unit: "kg",
    rating: 4.9,
    reviews: 178,
    image: "/images/Sweet Litchi.jpg",
    farmer: "Bihar Orchards",
    location: "Patna, Bihar",
    category: "Fruits"
  },
  {
    id: 12,
    name: "Pure Desi Ghee",
    price: 850,
    unit: "litre",
    rating: 4.7,
    reviews: 88,
    image: "/images/Pure Desi Ghee.jpg",
    farmer: "Rajasthan Dairy",
    location: "Jodhpur, Rajasthan",
    category: "Dairy"
  },
  {
    id: 13,
    name: "Organic Wheat",
    price: 45,
    unit: "kg",
    rating: 4.5,
    reviews: 156,
    image: "/images/Organic Wheat.jpg",
    farmer: "MP Grain Farmers",
    location: "Bhopal, Madhya Pradesh",
    category: "Grains"
  },
  {
    id: 14,
    name: "Fresh Green Peas",
    price: 80,
    unit: "kg",
    rating: 4.4,
    reviews: 92,
    image: "/images/Fresh Green Peas.jpg",
    farmer: "UP Green Farms",
    location: "Lucknow, Uttar Pradesh",
    category: "Vegetables"
  },
  {
    id: 15,
    name: "Organic Jowar",
    price: 60,
    unit: "kg",
    rating: 4.6,
    reviews: 67,
    image: "/images/Organic Jowar.jpg",
    farmer: "Maharashtra Grains",
    location: "Pune, Maharashtra",
    category: "Grains"
  },
  {
    id: 16,
    name: "Organic Turmeric",
    price: 250,
    unit: "kg",
    rating: 4.7,
    reviews: 142,
    image: "/images/Organic Turmeric.jpg",
    farmer: "Salem Spice Gardens",
    location: "Salem, Tamil Nadu",
    category: "Spices"
  },
  {
    id: 17,
    name: "Black Pepper",
    price: 580,
    unit: "kg",
    rating: 4.8,
    reviews: 165,
    image: "/images/Black Pepper.jpg",
    farmer: "Wayanad Spice Co-op",
    location: "Wayanad, Kerala",
    category: "Spices"
  },
  {
    id: 18,
    name: "Assam Tea",
    price: 400,
    unit: "500g",
    rating: 4.9,
    reviews: 189,
    image: "/images/Assam Tea.jpg",
    farmer: "Dibrugarh Tea Estate",
    location: "Dibrugarh, Assam",
    category: "Tea"
  },
  {
    id: 19,
    name: "Organic Cardamom",
    price: 1200,
    unit: "kg",
    rating: 4.7,
    reviews: 92,
    image: "/images/Organic Cardamom.jpg",
    farmer: "Munnar Spice Gardens",
    location: "Munnar, Kerala",
    category: "Spices"
  },
  {
    id: 20,
    name: "Darjeeling Tea",
    price: 800,
    unit: "500g",
    rating: 4.9,
    reviews: 178,
    image: "/images/Darjeeling Tea.jpg",
    farmer: "Darjeeling Tea Estate",
    location: "Darjeeling, West Bengal",
    category: "Tea"
  },
  {
    id: 21,
    name: "Organic Coconut",
    price: 35,
    unit: "piece",
    rating: 4.4,
    reviews: 145,
    image: "/images/Organic Coconut.jpg",
    farmer: "Kerala Coconut Farm",
    location: "Kozhikode, Kerala",
    category: "Fruits"
  },
  {
    id: 22,
    name: "Fresh Ginger",
    price: 120,
    unit: "kg",
    rating: 4.6,
    reviews: 88,
    image: "/images/Fresh Ginger.jpg",
    farmer: "Northeast Organic Farm",
    location: "Sikkim",
    category: "Spices"
  },
  {
    id: 23,
    name: "Organic Jaggery",
    price: 85,
    unit: "kg",
    rating: 4.5,
    reviews: 156,
    image: "/images/Organic Jaggery.jpg",
    farmer: "Kolhapur Sugar Co-op",
    location: "Kolhapur, Maharashtra",
    category: "Sweeteners"
  },
  {
    id: 24,
    name: "Fresh Garlic",
    price: 160,
    unit: "kg",
    rating: 4.3,
    reviews: 112,
    image: "/images/Fresh Garlic.jpg",
    farmer: "MP Garlic Farms",
    location: "Mandsaur, Madhya Pradesh",
    category: "Vegetables"
  },
  {
    id: 25,
    name: "Pure Palm Jaggery",
    price: 220,
    unit: "kg",
    rating: 4.7,
    reviews: 94,
    image: "/images/Pure Palm Jaggery.jpg",
    farmer: "Tamil Palm Farmers",
    location: "Pollachi, Tamil Nadu",
    category: "Sweeteners"
  }
  ];

  // Filter and sort products when dependencies change
  useEffect(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory && selectedCategory.toLowerCase() !== 'all') {
      result = result.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.farmer.toLowerCase().includes(query) ||
        product.location.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Sort products
    result = sortProducts(result, sortBy);
    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, sortBy]);

  const sortProducts = (products, sortType) => {
    switch (sortType) {
      case 'price-asc':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...products].sort((a, b) => b.price - a.price);
      case 'name-asc':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...products].sort((a, b) => b.name.localeCompare(a.name));
      case 'rating-desc':
        return [...products].sort((a, b) => b.rating - a.rating);
      case 'newest':
        return [...products].sort((a, b) => b.id - a.id);
      default: // 'relevance'
        return products;
    }
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
        text: `Check out ${product.name} from ${product.farmer}!`,
        url: window.location.href,
      });
    }
  };

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

  const handleScanQR = (product) => {
    // Implement QR code scanning functionality
    console.log('Scanning QR for product:', product.name);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group relative bg-white rounded-xl shadow-sm hover:shadow-md 
              transition-all duration-300 overflow-hidden"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 
                  transition-transform duration-300"
              />
              
              {/* Action Buttons */}
              <div className={`absolute right-4 top-4 transition-opacity duration-300 
                ${hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'}`}
              >
                <div className="flex flex-col gap-2">
                  {isManagement ? (
                    <>
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 
                          transition-colors"
                        title="Edit Product"
                      >
                        <span className="text-blue-600">✏️</span>
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 
                          transition-colors"
                        title="Delete Product"
                      >
                        <span className="text-red-600">🗑️</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 
                          transition-colors"
                        title="Add to Wishlist"
                      >
                        <Heart
                          size={20}
                          className={wishlist.includes(product.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-600'}
                        />
                      </button>
                      <button
                        onClick={() => shareProduct(product)}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 
                          transition-colors"
                        title="Share Product"
                      >
                        <Share2 size={20} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleScanQR(product)}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 
                          transition-colors"
                        title="Scan QR Code"
                      >
                        <QrCode size={20} className="text-gray-600" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Category Badge */}
              <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 
                rounded-full text-sm font-medium text-gray-700">
                {product.category}
              </span>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 
                  line-clamp-1 hover:line-clamp-none">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500">by {product.farmer}</p>
                <p className="text-xs text-gray-400">{product.location}</p>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-baseline">
                  <span className="text-xl font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    /{product.unit}
                  </span>
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

              {/* Action Button */}
              <button
                onClick={() => onAddToCart && onAddToCart(product)}
                className="w-full bg-emerald-600 text-white py-2 rounded-lg 
                  hover:bg-emerald-700 transition-colors flex items-center 
                  justify-center gap-2 group"
              >
                <ShoppingCart 
                  size={20} 
                  className="group-hover:scale-110 transition-transform" 
                />
                {isManagement ? 'Update Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <div className="mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Products Found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter settings
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
