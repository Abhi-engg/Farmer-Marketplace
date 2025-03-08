import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import FarmerProductCard from './FarmerProductCard';
import { Search, Filter, Grid, List, RefreshCw } from 'lucide-react';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price', 'stock'

  const categories = [
    { id: 'all', label: '📦 All Products' },
    { id: 'vegetables', label: '🥬 Vegetables' },
    { id: 'fruits', label: '🍎 Fruits' },
    { id: 'grains', label: '🌾 Grains' },
    { id: 'dairy', label: '🥛 Dairy' },
    { id: 'herbs', label: '🌿 Herbs' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' },
    { value: 'stock-asc', label: 'Stock (Low to High)' },
    { value: 'stock-desc', label: 'Stock (High to Low)' }
  ];

  // Sample products data with units
  const sampleProducts = [
    {
      id: 1,
      name: "Fresh Red Tomatoes",
      price: 40,
      stock: 100,
      category: "Vegetables",
      unit: "kg",
      image: "/images/products/tomatoes.jpg"
    },
    {
      id: 2,
      name: "Organic Potatoes",
      price: 35,
      stock: 8,
      category: "Vegetables",
      unit: "kg",
      image: "/images/products/potatoes.jpg"
    },
    {
      id: 3,
      name: "Sweet Mangoes",
      price: 80,
      stock: 50,
      category: "Fruits",
      unit: "dozen",
      image: "/images/products/mangoes.jpg"
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // First try to get products from localStorage
      const savedProducts = localStorage.getItem('farmerProducts');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        // If no saved products, use sample data
        setProducts(sampleProducts);
        localStorage.setItem('farmerProducts', JSON.stringify(sampleProducts));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (newProduct) => {
    try {
      const createdProduct = {
        ...newProduct,
        id: Date.now(), // Use timestamp as ID
        published: false // Add published status
      };
      const updatedProducts = [...products, createdProduct];
      setProducts(updatedProducts);
      localStorage.setItem('farmerProducts', JSON.stringify(updatedProducts));
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleProductUpdate = async (updatedProduct) => {
    try {
      const updatedProducts = products.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      );
      setProducts(updatedProducts);
      localStorage.setItem('farmerProducts', JSON.stringify(updatedProducts));
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleProductDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const updatedProducts = products.filter(p => p.id !== productId);
        setProducts(updatedProducts);
        localStorage.setItem('farmerProducts', JSON.stringify(updatedProducts));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handlePublishToggle = async (productId) => {
    try {
      const updatedProducts = products.map(p => 
        p.id === productId ? { ...p, published: !p.published } : p
      );
      setProducts(updatedProducts);
      localStorage.setItem('farmerProducts', JSON.stringify(updatedProducts));
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  const handleImageUpload = async (file, productId) => {
    try {
      // For testing, update locally with file reader
      const reader = new FileReader();
      reader.onloadend = () => {
        setProducts(products.map(p => 
          p.id === productId ? { ...p, image: reader.result } : p
        ));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const sortProducts = (products) => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'stock-asc':
          return a.stock - b.stock;
        case 'stock-desc':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });
  };

  const filteredProducts = sortProducts(
    products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || 
        product.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    })
  );

  const renderProductCard = (product) => (
    <div key={product.id} className="relative">
      <FarmerProductCard
        product={product}
        onUpdate={handleProductUpdate}
        onDelete={handleProductDelete}
        onImageUpload={(file) => handleImageUpload(file, product.id)}
      />
      <button
        onClick={() => handlePublishToggle(product.id)}
        className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium ${
          product.published 
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {product.published ? 'Published' : 'Draft'}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
              <p className="text-gray-500">Manage your product inventory</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Toggle view mode"
              >
                {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
              </button>
              <button
                onClick={fetchProducts}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh products"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Display */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading your products...</p>
          </div>
        ) : (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }
          `}>
            <FarmerProductCard
              isNew={true}
              onCreate={handleCreateProduct}
            />
            {filteredProducts.map(renderProductCard)}
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="mb-4">🌱</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Products Found</h3>
            <p className="text-gray-500">
              {searchQuery || selectedCategory !== 'all' 
                ? "Try adjusting your search or filter settings"
                : "Start by adding your first product!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement; 