import React from 'react';
import ProductList from './ProductList';
import './styles.css';

const Home = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-green-800 mb-4">
          Welcome to Farmer Marketplace
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect directly with local farmers and get fresh produce delivered to your door
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Available Products</h2>
        <ProductList />
      </div>
    </div>
  );
};

export default Home; 