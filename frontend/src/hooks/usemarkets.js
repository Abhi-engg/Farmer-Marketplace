import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const fetchMarkets = async () => {
  try {
    const response = await fetch('/api/markets');
    if (!response.ok) {
      throw new Error('Failed to fetch markets');
    }
    return response.json();
  } catch (error) {
    toast.error('Error loading markets');
    throw error;
  }
};

export const useMarkets = () => {
  const {
    data: markets,
    isLoading: loading,
    error
  } = useQuery({
    queryKey: ['markets'],
    queryFn: fetchMarkets,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    onError: (error) => {
      console.error('Markets fetch error:', error);
      toast.error('Failed to load markets');
    }
  });

  return {
    markets: markets || [],
    loading,
    error: error?.message
  };
};
