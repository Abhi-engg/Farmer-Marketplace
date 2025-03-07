import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import ProductOCRScanner from './ProductOCRScanner';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [imagePreview, setImagePreview] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [],
    delivery_time: '',
    unit: 'kg',
    minimum_order: '1',
    organic: false,
    seasonal: false,
    harvest_date: '',
    expiry_date: '',
    storage_instructions: '',
    nutritional_info: '',
    discount: {
      amount: 0,
      type: 'percentage', // or 'fixed'
      valid_until: null
    }
  });
  const [showScanner, setShowScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: 'vegetables', label: '🥬 Vegetables' },
    { id: 'fruits', label: '🍎 Fruits' },
    { id: 'grains', label: '🌾 Grains' },
    { id: 'dairy', label: '🥛 Dairy' },
    { id: 'meat', label: '🥩 Meat' },
    { id: 'herbs', label: '🌿 Herbs' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/farmer/products/');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'images') {
      const selectedFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        images: selectedFiles
      }));
      const previews = selectedFiles.map(file => URL.createObjectURL(file));
      setImagePreview(previews);
    } else if (type === 'date') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          formData.images.forEach(image => {
            data.append('images', image);
          });
        } else if (key === 'discount') {
          data.append('discount', JSON.stringify(formData.discount));
        } else {
          data.append(key, formData[key]);
        }
      });

      if (editingProduct) {
        await axios.put(`/api/farmer/products/${editingProduct.id}/`, data);
      } else {
        await axios.post('/api/farmer/products/', data);
      }

      fetchProducts();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      delivery_time: product.delivery_time,
      images: [],
      unit: product.unit,
      minimum_order: product.minimum_order,
      organic: product.organic,
      seasonal: product.seasonal,
      harvest_date: product.harvest_date,
      expiry_date: product.expiry_date,
      storage_instructions: product.storage_instructions,
      nutritional_info: product.nutritional_info,
      discount: product.discount
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/farmer/products/${productId}/`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      images: [],
      delivery_time: '',
      unit: 'kg',
      minimum_order: '1',
      organic: false,
      seasonal: false,
      harvest_date: '',
      expiry_date: '',
      storage_instructions: '',
      nutritional_info: '',
      discount: {
        amount: 0,
        type: 'percentage',
        valid_until: null
      }
    });
    setImagePreview([]);
    setEditingProduct(null);
  };

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === 'all' || product.category === selectedCategory)
    );

  const handleProductDetected = async (productData) => {
    setIsLoading(true);
    try {
      // Add the detected product to your products list
      const response = await axios.post('/api/farmer/products/', productData);
      setProducts([...products, response.data]);
      setShowScanner(false);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Product Management</h2>
        <button
          onClick={() => setShowScanner(!showScanner)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          {showScanner ? 'Close Scanner' : '📸 Add Product with Scanner'}
        </button>
      </div>

      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖️
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Unit
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                      min="0"
                      step="0.01"
                    />
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="border rounded-lg px-3 py-2"
                    >
                      <option value="kg">per kg</option>
                      <option value="piece">per piece</option>
                      <option value="dozen">per dozen</option>
                      <option value="bundle">per bundle</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Available
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    rows="4"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="organic"
                        checked={formData.organic}
                        onChange={handleInputChange}
                        className="rounded text-green-600"
                      />
                      <span>Organic 🌱</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="seasonal"
                        checked={formData.seasonal}
                        onChange={handleInputChange}
                        className="rounded text-green-600"
                      />
                      <span>Seasonal 🗓️</span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images
                  </label>
                  <input
                    type="file"
                    name="images"
                    onChange={handleInputChange}
                    className="w-full"
                    multiple
                    accept="image/*"
                    required={!editingProduct}
                  />
                  {imagePreview.length > 0 && (
                    <div className="mt-2 flex space-x-2 overflow-x-auto">
                      {imagePreview.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <span className="flex items-center space-x-2">
                      <div className="animate-spin">⌛</div>
                      <span>Saving...</span>
                    </span>
                  ) : (
                    editingProduct ? 'Update Product' : 'Add Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showScanner && (
        <div className="bg-white rounded-lg shadow-md">
          <ProductOCRScanner 
            onProductDetected={handleProductDetected}
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {product.discount?.amount > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                    {product.discount.type === 'percentage' 
                      ? `${product.discount.amount}% OFF`
                      : `$${product.discount.amount} OFF`}
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-gray-600">
                      ${product.price}/{product.unit}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                <p className="text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <div className="space-x-2">
                    {product.organic && <span title="Organic">🌱</span>}
                    {product.seasonal && <span title="Seasonal">🗓️</span>}
                    {product.harvest_date && <span title={`Harvested: ${product.harvest_date}`}>🌾</span>}
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <p className="text-lg">Processing product...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement; 