import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '../common';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const hostname = window.location.hostname;
      const response = await fetch(`http://${hostname}:8000/api/farmer/products/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(currentProduct).forEach(key => {
        formData.append(key, currentProduct[key]);
      });

      const hostname = window.location.hostname;
      const response = await fetch(`http://${hostname}:8000/api/farmer/products/`, {
        method: currentProduct.id ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        fetchProducts();
        setShowForm(false);
        setCurrentProduct({
          name: '',
          description: '',
          price: '',
          stock: '',
          category: '',
          image: null
        });
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const hostname = window.location.hostname;
        const response = await fetch(`http://${hostname}:8000/api/farmer/products/${productId}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          fetchProducts();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
          className="flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Product
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-6">
              {currentProduct.id ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form fields */}
              <Button type="submit" variant="primary">
                {currentProduct.id ? 'Update Product' : 'Add Product'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-green-600 font-semibold">
                ${product.price}
              </span>
              <span className="text-gray-500">
                Stock: {product.stock}
              </span>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setCurrentProduct(product);
                  setShowForm(true);
                }}
              >
                <PencilIcon className="w-5 h-5" />
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleDelete(product.id)}
              >
                <TrashIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement; 