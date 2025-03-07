import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const useGeminiAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processImageWithGemini = async (imageFile) => {
    setIsProcessing(true);
    try {
      // Convert image to base64
      const imageBase64 = await fileToBase64(imageFile);

      // Create Gemini model instance
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

      // Prepare the prompt
      const prompt = `Extract product information from this image. 
        Please identify:
        - Product name
        - Price
        - Weight/Quantity
        - Category
        - Description
        - Any additional details like expiry date, storage instructions, etc.
        Format the response as a JSON object.`;

      // Process image with Gemini
      const result = await model.generateContent([prompt, imageBase64]);
      const response = await result.response;
      const text = response.text();

      // Parse the JSON response
      const productData = JSON.parse(text);

      return {
        ...productData,
        confidence_score: response.candidates[0]?.score || 1,
      };
    } catch (error) {
      console.error('Error processing with Gemini:', error);
      throw error;
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
