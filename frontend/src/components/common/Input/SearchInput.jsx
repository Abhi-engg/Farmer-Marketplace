import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

function SearchInput({ placeholder, onChange }) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        className="w-full pl-12 pr-4 py-3 rounded-lg border text-lg focus:outline-none focus:ring-2 focus:ring-green-600"
      />
      <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
    </div>
  );
}

export default SearchInput; 