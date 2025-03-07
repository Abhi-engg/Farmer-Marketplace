import PropTypes from 'prop-types';

const SectionHeader = ({ 
  title, 
  subtitle,
  action,
  className = '' 
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-gray-600">{subtitle}</p>
          )}
        </div>
        {action && (
          <div>{action}</div>
        )}
      </div>
    </div>
  );
};

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  action: PropTypes.node,
  className: PropTypes.string
};

export default SectionHeader;
