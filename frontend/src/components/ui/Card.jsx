import PropTypes from 'prop-types';

const Card = ({ 
  children, 
  className = '',
  hover = true,
  ...props 
}) => {
  return (
    <div 
      className={`
        bg-white rounded-lg overflow-hidden shadow-sm
        ${hover ? 'hover:shadow-md transition-shadow' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool
};

export default Card;
