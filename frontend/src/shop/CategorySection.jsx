import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const categories = [
    { id: 1, name: 'Vegetables', icon: '🥬' },
    { id: 2, name: 'Fruits', icon: '🍎' },
    { id: 3, name: 'Grains', icon: '🌾' },
    { id: 4, name: 'Dairy', icon: '🥛' },
    { id: 5, name: 'Honey', icon: '🍯' },
    { id: 6, name: 'Eggs', icon: '🥚' },
  ];
  
  const CategorySection = ({ onCategorySelect, selectedCategory = 'All' }) => {
    const navigate = useNavigate();

    const handleCategoryClick = (categoryName) => {
      onCategorySelect(categoryName);
      // Update URL with category parameter
      navigate(`/shop?category=${categoryName.toLowerCase()}`);
    };

    return (
      <section className="my-8">
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <button
            key="all"
            onClick={() => handleCategoryClick('All')}
            className={`flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
              selectedCategory === 'All' ? 'ring-2 ring-green-500' : ''
            }`}
          >
            <span className="text-3xl mb-2">🏪</span>
            <span className="text-sm font-medium">All</span>
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className={`flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                selectedCategory === category.name ? 'ring-2 ring-green-500' : ''
              }`}
            >
              <span className="text-3xl mb-2">{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </section>
    );
  };
  
  CategorySection.propTypes = {
    onCategorySelect: PropTypes.func.isRequired,
    selectedCategory: PropTypes.string
  };
  
  export default CategorySection;