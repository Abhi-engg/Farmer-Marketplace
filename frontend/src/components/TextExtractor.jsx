import { useState } from 'react';
import axios from 'axios';

const TextExtractor = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    const [processingInfo, setProcessingInfo] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: 'success' });
        }, 3000);
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                showNotification('File size should not exceed 5MB', 'error');
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setExtractedText('');
            setProcessingInfo(null);
        }
    };

    const handleExtractText = async () => {
        if (!selectedFile) {
            showNotification('Please select an image first', 'error');
            return;
        }

        setIsLoading(true);
        setProcessingInfo(null);
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await axios.post('http://localhost:8000/api/extract-text/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 60000, // 60 second timeout
            });

            if (response.data.extracted_text) {
                setExtractedText(response.data.extracted_text);
                showNotification('Text extracted successfully!');
                
                // Show processing info if using fallback
                if (response.data.note) {
                    setProcessingInfo({
                        message: 'Used alternative processing method',
                        type: 'info'
                    });
                }
            } else {
                showNotification('No text could be extracted from the image', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            let errorMessage = 'Failed to extract text';
            
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timed out. Please try again with a smaller image.';
            }
            
            showNotification(errorMessage, 'error');
            setProcessingInfo({
                message: 'Try using a clearer image or different format',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyText = () => {
        if (extractedText) {
            navigator.clipboard.writeText(extractedText);
            showNotification('Text copied to clipboard!');
        }
    };

    const handleClear = () => {
        setSelectedFile(null);
        setExtractedText('');
        setPreviewUrl(null);
        setProcessingInfo(null);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Text Extractor</h2>
            
            <div className="mb-6">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="imageInput"
                />
                <label
                    htmlFor="imageInput"
                    className="block w-full p-4 text-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition duration-300"
                >
                    {previewUrl ? 'Change Image' : 'Select Image'}
                </label>
                <p className="mt-2 text-sm text-gray-500 text-center">
                    Maximum file size: 5MB
                </p>
            </div>

            {previewUrl && (
                <div className="mb-6">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-96 mx-auto rounded-lg shadow-md"
                    />
                </div>
            )}

            <div className="flex gap-4 mb-6">
                <button
                    onClick={handleExtractText}
                    disabled={!selectedFile || isLoading}
                    className="flex-1 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Extracting...
                        </span>
                    ) : 'Extract Text'}
                </button>
                
                <button 
                    onClick={handleClear}
                    disabled={!selectedFile && !extractedText}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300"
                >
                    Clear
                </button>
            </div>

            {processingInfo && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                    processingInfo.type === 'info' 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'bg-yellow-50 text-yellow-700'
                }`}>
                    {processingInfo.message}
                </div>
            )}

            {extractedText && (
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">Extracted Text:</h3>
                        <button
                            onClick={handleCopyText}
                            className="text-blue-500 hover:text-blue-600"
                        >
                            Copy to Clipboard
                        </button>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                        {extractedText}
                    </div>
                </div>
            )}

            {/* Notification */}
            {notification.show && (
                <div className={`
                    fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg
                    ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} 
                    text-white transition-opacity duration-300
                `}>
                    {notification.message}
                </div>
            )}
        </div>
    );
};

export default TextExtractor; 