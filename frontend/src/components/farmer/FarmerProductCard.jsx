import { useState, useEffect } from 'react';
import { Edit2, Trash2, Camera, Package, DollarSign, ShoppingBag, Plus } from 'lucide-react';

const FarmerProductCard = ({ 
  product = null, // Make product optional for new card creation
  onUpdate,
  onDelete,
  onImageUpload,
  onCreate, // New prop for handling card creation
  isNew = false // Flag to indicate if this is a new card
}) => {
  const defaultProduct = {
    name: '',
    price: '',
    stock: '',
    category: 'Vegetables',
    unit: 'kg', // Add default unit
    image: null
  };

  const units = [
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'g', label: 'Gram (g)' },
    { value: 'mg', label: 'Milligram (mg)' },
    { value: 'dozen', label: 'Dozen' },
    { value: 'pieces', label: 'Pieces' }
  ];

  const categories = [
    { value: 'Vegetables', label: '🥬 Vegetables' },
    { value: 'Fruits', label: '🍎 Fruits' },
    { value: 'Grains', label: '🌾 Grains' },
    { value: 'Dairy', label: '🥛 Dairy' },
    { value: 'Herbs', label: '🌿 Herbs' }
  ];

  const [isEditing, setIsEditing] = useState(isNew);
  const [editedProduct, setEditedProduct] = useState(product || defaultProduct);
  const [imagePreview, setImagePreview] = useState(product?.image || null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setEditedProduct(product);
      setImagePreview(product.image);
    }
  }, [product]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        onImageUpload?.(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!editedProduct.name) newErrors.name = 'Name is required';
    if (!editedProduct.price) newErrors.price = 'Price is required';
    if (!editedProduct.stock) newErrors.stock = 'Stock is required';
    if (editedProduct.price < 0) newErrors.price = 'Price cannot be negative';
    if (editedProduct.stock < 0) newErrors.stock = 'Stock cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    if (isNew) {
      onCreate?.(editedProduct);
      setEditedProduct(defaultProduct);
      setImagePreview(null);
    } else {
      onUpdate?.(editedProduct);
      setIsEditing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // New Card Template
  if (isNew && !isEditing) {
    return (
      <div 
        onClick={() => setIsEditing(true)}
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center cursor-pointer min-h-[400px] border-2 border-dashed border-gray-300 hover:border-emerald-500"
      >
        <div className="text-center">
          <Plus className="h-12 w-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">Add New Product</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      {/* Product Image Section */}
      <div className="relative aspect-square overflow-hidden rounded-t-xl">
        <img
          src={imagePreview || '/placeholder-product.jpg'}
          alt={editedProduct.name || 'Product Image'}
          className="w-full h-full object-cover"
        />
        
        {/* Image Upload Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <label className="cursor-pointer p-3 bg-white rounded-full hover:bg-gray-100">
            <Camera className="h-6 w-6 text-gray-600" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Status Badge */}
        {!isNew && (
          <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
            editedProduct.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {editedProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        )}
      </div>

      {/* Product Details Section */}
      <div className="p-4">
        {(isEditing || isNew) ? (
          // Edit/Create Mode
          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                value={editedProduct.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                  errors.name ? 'border-red-500' : ''
                }`}
                placeholder="Product Name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select
                name="category"
                value={editedProduct.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                name="unit"
                value={editedProduct.unit}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                {units.map(unit => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="price"
                  value={editedProduct.price}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                    errors.price ? 'border-red-500' : ''
                  }`}
                  placeholder="Price"
                  min="0"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>
              
              <div className="relative">
                <Package className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="stock"
                  value={editedProduct.stock}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                    errors.stock ? 'border-red-500' : ''
                  }`}
                  placeholder={`Stock (${editedProduct.unit})`}
                  min="0"
                />
                {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  if (isNew) {
                    setEditedProduct(defaultProduct);
                    setImagePreview(null);
                  }
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                {isNew ? 'Create Product' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          // View Mode
          <>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{editedProduct.name}</h3>
                <p className="text-sm text-gray-500">Category: {editedProduct.category}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete?.(editedProduct.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-900">₹{editedProduct.price}</span>
                  <span className="text-sm text-gray-500 ml-1">/{editedProduct.unit}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <ShoppingBag className="h-5 w-5 mr-1" />
                  <span>{editedProduct.stock} {editedProduct.unit}</span>
                </div>
              </div>

              {editedProduct.stock < 10 && editedProduct.unit !== 'mg' && (
                <p className="text-sm text-orange-500">
                  Low stock alert! Only {editedProduct.stock} {editedProduct.unit} remaining
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FarmerProductCard; 