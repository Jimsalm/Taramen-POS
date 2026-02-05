import axiosInstance from '@/shared/lib/axios';


const fetchData = async () => {
  try {
    const response = await axiosInstance.get('/some-endpoint');

  } catch (error) {
    console.error('Request failed:', error);
  }
};