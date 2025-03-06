import { 
  ShoppingCartIcon, 
  UserIcon, 
  MagnifyingGlassIcon, 
  ChevronDownIcon 
} from '@heroicons/react/24/outline';

function Navbar({ cartCount = 0 }) {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md w-full h-[80px]">
      <div className="w-full h-full px-8">
        <div className="max-w-[2000px] mx-auto h-full flex items-center justify-between">
          <a href="/" className="flex items-center flex-shrink-0">
            <img src="/logo.svg" alt="Farmers' Marketplace" className="h-12" />
            <span className="ml-3 text-2xl font-bold text-green-600">Farmers' Marketplace</span>
          </a>

          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products, farmers, or markets..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border text-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            </div>
          </div>

          <div className="hidden md:flex items-center mx-8 flex-shrink-0">
            <button className="flex items-center space-x-2 text-lg text-gray-700 hover:text-green-600">
              <span>Categories</span>
              <ChevronDownIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-6 flex-shrink-0">
            <button className="text-gray-700 hover:text-green-600">
              <UserIcon className="w-8 h-8" />
            </button>
            <button className="relative text-gray-700 hover:text-green-600">
              <ShoppingCartIcon className="w-8 h-8" />
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 