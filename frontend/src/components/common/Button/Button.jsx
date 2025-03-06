

const Button = ({ children, variant = 'primary', type = 'button', onClick, className = '' }) => {
  const baseStyles = 'px-6 py-3 rounded-lg text-lg transition-colors';
  const variants = {
    primary: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'border-2 border-white text-white hover:bg-white hover:text-green-600',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button; 