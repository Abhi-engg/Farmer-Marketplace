import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search...",
  onSubmit,
  className = ""
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-6 py-4 text-lg rounded-full border-2 border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 shadow-sm"
      />
      <button 
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors"
      >
        <MagnifyingGlassIcon className="w-6 h-6" />
      </button>
    </form>
  );
};

export default SearchBar; 