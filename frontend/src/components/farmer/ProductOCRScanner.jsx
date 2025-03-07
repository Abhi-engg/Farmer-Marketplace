import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { useGeminiAI } from '../../hooks/useGeminiAI';

const ProductOCRScanner = ({ onProductDetected }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const { processImageWithGemini } = useGeminiAI();

  const handleImageCapture = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsScanning(true);
    try {
      // Create preview
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);

      // Process image with Gemini AI
      const productData = await processImageWithGemini(file);
      onProductDetected(productData);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsScanning(false);
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

      {/* Camera/Upload Interface */}
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-64 mx-auto mb-4"
            />
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
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          capture="environment"
          onChange={handleImageCapture}
          className="hidden"
        />

        <div className="flex gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            disabled={isScanning}
          >
            {isScanning ? 'Processing...' : 'Take Photo'}
          </button>
          {previewImage && (
            <button
              onClick={() => {
                setPreviewImage(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="bg-gray-200 px-4 rounded-lg hover:bg-gray-300"
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