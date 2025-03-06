import Button from '../Button/Button';
import Rating from '../Rating/Rating';

function FarmerCard({ farmer }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
      <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
        <img 
          src={`/images/farmer-${farmer.id}.jpg`} 
          alt={`${farmer.name}'s farm`}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/images/placeholder-farm.jpg'
          }}
        />
      </div>
      <h3 className="text-2xl font-semibold mb-2">{farmer.name}</h3>
      <p className="text-gray-600 text-lg mb-4">{farmer.farm}</p>
      <Rating rating={farmer.rating} />
      <div className="flex gap-4">
        <Button
          variant="primary"
          onClick={() => window.location.href = `/farmer/${farmer.id}`}
        >
          View Profile
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.href = `/shop/${farmer.id}`}
        >
          Shop Now
        </Button>
      </div>
    </div>
  );
}

export default FarmerCard; 