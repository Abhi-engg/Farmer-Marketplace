import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, LogOut } from 'lucide-react';
import axios from '../utils/axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:8000/api/logout/', {
        withCredentials: true
      });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/login';
    }
  };

  return (
    <nav 
      className={`
        fixed top-0 w-full z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-lg' 
          : 'bg-gradient-to-r from-green-600/80 to-emerald-600/80 backdrop-blur-sm'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button 
            onClick={() => navigate('/')} 
            className={`
              text-2xl font-bold transition-all duration-300
              flex items-center space-x-3 group
              ${isScrolled ? 'text-green-600' : 'text-white'}
            `}
          >
            <div className="relative">
              <img 
                src="/logo.svg" 
                alt="Farmer's Market" 
                className={`
                  h-10 w-10 transition-transform duration-300
                  group-hover:scale-110
                `}
              />
              <div className={`
                absolute -inset-2 rounded-full 
                group-hover:bg-white/20 transition-all duration-300
                ${isScrolled ? 'group-hover:bg-green-100' : ''}
              `} />
            </div>
            <span className={`
              hidden sm:block font-display tracking-wide
              transition-all duration-300
              ${isScrolled 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600' 
                : 'text-white'
              }
            `}>
              Farmer's Market
            </span>
          </button>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate('/shop')}
              className={`
                px-6 py-2.5 rounded-full font-medium
                transition-all duration-300 flex items-center space-x-2
                ${isScrolled 
                  ? 'text-green-600 hover:bg-green-50 hover:text-green-700' 
                  : 'text-white hover:bg-white/20'
                }
              `}
            >
              <ShoppingBag 
                size={20} 
                className={`transition-transform group-hover:scale-110 ${
                  isScrolled ? 'text-green-600' : 'text-white'
                }`} 
              />
              <span>Shop Now</span>
            </button>

            <button
              onClick={handleLogout}
              className={`
                px-6 py-2.5 rounded-full font-medium
                transition-all duration-300
                flex items-center space-x-2
                ${isScrolled
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/25'
                  : 'bg-white/20 hover:bg-white/30 text-white'
                }
                shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
              `}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;