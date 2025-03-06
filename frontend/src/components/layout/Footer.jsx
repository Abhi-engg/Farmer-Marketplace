import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    about: [
      { name: 'About Us', href: '/about' },
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'Sustainability', href: '/sustainability' },
      { name: 'Press', href: '/press' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
    vendors: [
      { name: 'Become a Vendor', href: '/vendor-signup' },
      { name: 'Vendor Guidelines', href: '/vendor-guidelines' },
      { name: 'Success Stories', href: '/success-stories' },
    ],
    social: [
      { name: 'Facebook', href: '#', icon: 'facebook' },
      { name: 'Twitter', href: '#', icon: 'twitter' },
      { name: 'Instagram', href: '#', icon: 'instagram' },
    ],
  };

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              {footerSections.about.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-gray-600 hover:text-green-600">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerSections.support.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-gray-600 hover:text-green-600">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vendors Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">For Vendors</h3>
            <ul className="space-y-2">
              {footerSections.vendors.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-gray-600 hover:text-green-600">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <div className="flex space-x-4 mb-6">
              {footerSections.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-green-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" />
                  </svg>
                </a>
              ))}
            </div>

            {/* Newsletter Signup */}
            <form className="mt-4">
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="flex">
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500">
            © {currentYear} LocalMarket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
