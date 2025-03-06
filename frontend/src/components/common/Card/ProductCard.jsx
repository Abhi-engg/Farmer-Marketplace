import Button from '../Button/Button';
import Rating from '../Rating/Rating';

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-72 object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/images/placeholder-product.jpg'
          }}
        />
        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-semibold text-green-600">
          ${product.price}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">{product.name}</h3>
        <Rating rating={product.rating} />
        <Button
          variant="primary"
          className="w-full"
          onClick={() => onAddToCart(product.id)}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

export default ProductCard; 