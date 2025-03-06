import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const ProductCard = ({ product, onFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!product.inStock) return;
    
    setIsLoading(true);
    try {
      await product.onAddToCart(product.id);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(`Failed to add to cart: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transform transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        
        {/* Overlay Actions */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={(e) => {
              e.preventDefault();
              onFavorite(product.id);
            }}
            className="p-3 rounded-full bg-white/90 hover:bg-white transition-colors"
            aria-label={product.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              className={`w-5 h-5 ${product.isFavorite ? 'text-red-500 fill-current' : 'text-gray-700'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <Link
            to={`/products/${product.id}`}
            className="p-3 rounded-full bg-white/90 hover:bg-white transition-colors"
            aria-label="View product details"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Link>
        </div>

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {!product.inStock && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              Out of Stock
            </span>
          )}
          {product.inStock && product.stock <= 5 && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
              Only {product.stock} left
            </span>
          )}
          {product.isNew && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              New
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category & Vendor */}
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-gray-500">{product.category}</span>
          <Link 
            to={`/vendors/${product.vendorId}`}
            className="text-gray-600 hover:text-green-600 transition-colors"
          >
            {product.vendorName}
          </Link>
        </div>

        {/* Product Name */}
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating & Price */}
        <div className="mt-3 flex items-center justify-between">
          {product.rating ? (
            <div className="flex items-center">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'stroke-current'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-1 text-sm text-gray-500">
                ({product.reviewCount})
              </span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">No ratings yet</span>
          )}
          <div className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
            {product.unit && (
              <span className="text-sm text-gray-500 font-normal">
                /{product.unit}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isLoading}
          className={`mt-4 w-full py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300
            ${product.inStock
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            } ${isLoading ? 'opacity-75 cursor-wait' : ''}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Adding...
            </span>
          ) : product.inStock ? (
            'Add to Cart'
          ) : (
            'Out of Stock'
          )}
        </button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    unit: PropTypes.string,
    stock: PropTypes.number.isRequired,
    inStock: PropTypes.bool.isRequired,
    isNew: PropTypes.bool,
    rating: PropTypes.number,
    reviewCount: PropTypes.number,
    vendorId: PropTypes.string.isRequired,
    vendorName: PropTypes.string.isRequired,
    isFavorite: PropTypes.bool.isRequired,
    onAddToCart: PropTypes.func.isRequired,
  }).isRequired,
  onFavorite: PropTypes.func.isRequired,
};

export default ProductCard;
