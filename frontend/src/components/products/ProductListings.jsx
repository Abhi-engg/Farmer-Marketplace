import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProductListings = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    location: ''
  });
  const [sortBy, setSortBy] = useState('popularity');
  const [showQuickView, setShowQuickView] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [filters, sortBy]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products/', {
        params: {
          ...filters,
          sort: sortBy
        }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const QuickViewModal = ({ product, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">{product.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-lg" />
          <div>
            <p className="text-lg font-bold text-green-600">${product.price}</p>
            <p className="text-gray-600 mt-2">{product.description}</p>
            <p className="text-sm text-gray-500 mt-2">Stock: {product.stock}</p>
            <Link
              to={`/products/${product.id}`}
              className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  QuickViewModal.propTypes = {
    product: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      stock: PropTypes.number.isRequired
    }).isRequired,
    onClose: PropTypes.func.isRequired
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters and Sort Section */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="border rounded-lg p-2"
        >
          <option value="">All Categories</option>
          <option value="vegetables">Vegetables</option>
          <option value="fruits">Fruits</option>
          <option value="dairy">Dairy</option>
          <option value="grains">Grains</option>
        </select>

        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleFilterChange}
          className="border rounded-lg p-2"
        />

        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          className="border rounded-lg p-2"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded-lg p-2"
        >
          <option value="popularity">Sort by Popularity</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest Arrivals</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-green-600 font-bold mt-2">${product.price}</p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setShowQuickView(product)}
                  className="text-green-600 hover:text-green-700"
                >
                  Quick View
                </button>
                <Link
                  to={`/products/${product.id}`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <QuickViewModal
          product={showQuickView}
          onClose={() => setShowQuickView(null)}
        />
      )}
    </div>
  );
};

export default ProductListings; 