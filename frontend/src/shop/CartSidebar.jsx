import PropTypes from 'prop-types';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';

const CartSidebar = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, cartTotal, itemCount }) => {
  const getQuantityStep = (unit) => {
    switch(unit.toLowerCase()) {
      case 'kg':
        return 0.5; // Allow half kg increments
      case 'dozen':
        return 1; // Full dozen increments
      case 'litre':
        return 0.5; // Half litre increments
      case '500g':
        return 1; // Single pack increments
      case 'piece':
        return 1; // Single piece increments
      default:
        return 1;
    }
  };

  const formatQuantity = (quantity, unit) => {
    switch(unit.toLowerCase()) {
      case 'kg':
        return `${quantity} kg`;
      case 'dozen':
        return `${quantity} dozen`;
      case 'litre':
        return `${quantity} L`;
      case '500g':
        return `${quantity} pack`;
      case 'piece':
        return `${quantity} pc`;
      default:
        return quantity;
    }
  };

  return (
    <div
      className={`fixed right-0 top-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-xl font-semibold">Shopping Cart</h2>
          <p className="text-sm text-gray-500">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X size={20} />
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <ShoppingBag size={48} className="mb-4" />
            <p>Your cart is empty</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-1">
                  by {item.farmer}
                </p>
                <p className="text-xs text-gray-400 mb-2">
                  {item.location}
                </p>
                <div className="flex items-baseline mb-2">
                  <span className="text-gray-600">₹{item.price.toFixed(2)}</span>
                  <span className="text-sm text-gray-500 ml-1">/{item.unit}</span>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <button 
                    className="p-1 hover:bg-gray-200 rounded"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - getQuantityStep(item.unit))}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="min-w-[60px] text-center">
                    {formatQuantity(item.quantity, item.unit)}
                  </span>
                  <button 
                    className="p-1 hover:bg-gray-200 rounded"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + getQuantityStep(item.unit))}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <p className="text-sm font-medium text-gray-600 mt-1">
                  Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <button 
                onClick={() => onRemoveItem(item.id)}
                className="p-2 hover:bg-gray-200 rounded-full"
              >
                <X size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {cartItems.length > 0 && (
        <div className="border-t p-4 bg-white">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="font-medium">Total</span>
            <span className="font-bold">₹{cartTotal.toFixed(2)}</span>
          </div>
          <button className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors">
            Proceed to Checkout ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </button>
        </div>
      )}
    </div>
  );
};

CartSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cartItems: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    farmer: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired
  })).isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  cartTotal: PropTypes.number.isRequired,
  itemCount: PropTypes.number.isRequired
};

export default CartSidebar;
