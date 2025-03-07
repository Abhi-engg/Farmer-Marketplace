import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { useGeminiAI } from '../../hooks/useGeminiAI';

const ProductOCRScanner = ({ onProductDetected }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const { processImageWithGemini } = useGeminiAI();

  const handleImageCapture = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 4 * 1024 * 1024) { // 4MB limit
      setError('Image size should be less than 4MB');
      return;
    }

    setError(null);
    setIsScanning(true);
    try {
      // Create preview
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);

      // Process image with Gemini AI
      const productData = await processImageWithGemini(file);
      
      if (productData) {
        onProductDetected(productData);
      } else {
        throw new Error('Failed to extract product details');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setError(error.message || 'Failed to process image. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setPreviewImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Scan Product Details</h3>
        <p className="text-gray-600">
          Take a photo of your product label or handwritten notes
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Camera/Upload Interface */}
      <div className="space-y-4">
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${isScanning ? 'opacity-50' : 'hover:border-green-500'}`}
          onClick={() => !isScanning && fileInputRef.current?.click()}
        >
          {previewImage ? (
            <div className="relative">
              <img
                src={previewImage}
                alt="Preview"
                className="max-h-64 mx-auto mb-4 rounded-lg"
              />
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                  <div className="text-white text-center">
                    <svg className="animate-spin h-8 w-8 mx-auto mb-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <p>Processing image...</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500">
              <svg
                className="mx-auto h-12 w-12 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p>Click to capture or upload an image</p>
              <p className="text-sm text-gray-400 mt-2">
                Supported formats: JPG, PNG (max 4MB)
              </p>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/jpeg,image/png"
          capture="environment"
          onChange={handleImageCapture}
          className="hidden"
        />

        <div className="flex gap-4">
          <button
            onClick={() => !isScanning && fileInputRef.current?.click()}
            className={`flex-1 py-2 rounded-lg text-white
              ${isScanning 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'}`}
            disabled={isScanning}
          >
            {isScanning ? 'Processing...' : 'Take Photo'}
          </button>
          {previewImage && (
            <button
              onClick={handleReset}
              className="bg-gray-200 px-4 rounded-lg hover:bg-gray-300"
              disabled={isScanning}
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

ProductOCRScanner.propTypes = {
  onProductDetected: PropTypes.func.isRequired
};

export default ProductOCRScanner;