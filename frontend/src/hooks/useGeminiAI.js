import { useState } from 'react';
import axios from 'axios';

// Define the API key as a string constant with proper quotes
const GEMINI_API_KEY = "AIzaSyDmH87y4vu8tv-lBbQjdtEdZ7optTCR_t8";

// Add debug logging
console.log('API Key configured:', !!GEMINI_API_KEY);

export const useGeminiAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processImageWithGemini = async (imageFile) => {
    setIsProcessing(true);
    try {
      if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured');
      }

      console.log('Processing image:', {
        type: imageFile.type,
        size: imageFile.size,
        name: imageFile.name
      });

      const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent?key=${AIzaSyDmH87y4vu8tv-lBbQjdtEdZ7optTCR_t8}`;
      
      const base64Image = await fileToBase64(imageFile);

      const requestData = {
        contents: [{
          parts: [
            {
              text: `Analyze this product image and extract the following information in JSON format:
                {
                  "name": "product name",
                  "price": "price value",
                  "weight": "weight/quantity",
                  "category": "product category",
                  "description": "brief description"
                }`
            },
            {
              inline_data: {
                mime_type: imageFile.type || 'image/jpeg',
                data: base64Image.split(',')[1]
              }
            }
          ]
        }]
      };

      console.log('Sending request to Gemini...');
      const response = await axios.post(apiUrl, requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Received response from Gemini');

      if (response.status === 200 && response.data.candidates && response.data.candidates.length > 0) {
        const text = response.data.candidates[0].content.parts[0].text;
        console.log('Raw response:', text);

        try {
          const productData = JSON.parse(text);
          return productData;
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          throw new Error('Invalid response format from AI');
        }
      } else {
        throw new Error('Invalid response from Gemini API');
      }

    } catch (error) {
      console.error('Detailed error:', error.response?.data || error);
      throw new Error(error.response?.data?.error?.message || error.message || 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return {
    processImageWithGemini,
    isProcessing
  };
};
