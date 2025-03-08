import { useState } from 'react';
import { Star, ShoppingCart } from 'lucide-react';

const products = [
  // Vegetables Category
  {
    id: 1,
    name: "Fresh Red Tomatoes",
    price: 40,
    unit: "kg",
    rating: 4.5,
    reviews: 128,
    image: "/images/products/tomatoes.jpg",
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
    image: "/images/products/potatoes.jpg",
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
    image: "/images/products/onions.jpg",
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
    image: "/images/products/bananas.jpg",
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
    image: "/images/products/pomegranate.jpg",
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
    image: "/images/products/butter.jpg",
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
    image: "/images/products/curd.jpg",
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
    image: "/images/products/quinoa.jpg",
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
    image: "/images/products/brown-rice.jpg",
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
    image: "/images/products/saffron.jpg",
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
    image: "/images/products/cinnamon.jpg",
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
    image: "/images/products/yellow-dal.jpg",
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
    image: "/images/products/urad-dal.jpg",
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
    image: "/images/products/walnuts.jpg",
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
    image: "/images/products/cashews.jpg",
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
    image: "/images/products/moringa.jpg",
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
    image: "/images/products/amla.jpg",
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
    image: "/images/products/apples.jpg",
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
    image: "/images/products/eggs.jpg",
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
    image: "/images/products/milk.jpg",
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
    image: "/images/products/honey.jpg",
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
    image: "/images/products/rice.jpg",
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
    image: "/images/products/spinach.jpg",
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
    image: "/images/products/mangoes.jpg",
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
    image: "/images/products/paneer.jpg",
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
    image: "/images/products/cauliflower.jpg",
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
    image: "/images/products/litchi.jpg",
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
    image: "/images/products/ghee.jpg",
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
    image: "/images/products/wheat.jpg",
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
    image: "/images/products/peas.jpg",
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
    image: "/images/products/jowar.jpg",
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
    image: "/images/products/turmeric.jpg",
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
    image: "/images/products/pepper.jpg",
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
    image: "/images/products/tea.jpg",
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
    image: "/images/products/cardamom.jpg",
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
    image: "/images/products/darjeeling-tea.jpg",
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
    image: "/images/products/coconut.jpg",
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
    image: "/images/products/ginger.jpg",
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
    image: "/images/products/jaggery.jpg",
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
    image: "/images/products/garlic.jpg",
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
    image: "/images/products/palm-jaggery.jpg",
    farmer: "Tamil Palm Farmers",
    location: "Pollachi, Tamil Nadu",
    category: "Sweeteners"
  }
];

const ProductGrid = ({ selectedCategory, onAddToCart }) => {
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Filter products based on selected category from props
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

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

  return (
    <div className="space-y-6">
      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            {/* Product Image */}
            <div className="relative h-48 rounded-t-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {hoveredProduct === product.id && (
                <button 
                  className="absolute bottom-4 right-4 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                  onClick={() => onAddToCart(product)}
                >
                  <ShoppingCart size={20} />
                </button>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mb-1">
                by {product.farmer}
              </p>
              <p className="text-xs text-gray-400 mb-2">
                {product.location}
              </p>
              
              {/* Price */}
              <div className="flex items-baseline mb-2">
                <span className="text-lg font-bold text-gray-900">
                  ₹{product.price}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  /{product.unit}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center">
                <div className="flex mr-2">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-gray-500">
                  ({product.reviews})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
