import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';

// Create Category
export const createCategory = async (categoryData) => {
  try {
    const {
      data: { message },
    } = await axios.post('/api/categories', categoryData);

    return Promise.resolve(message);
  } catch (error) {
    return Promise.reject({ error });
  }
};

// Get Categories
export const getCategories = async () => {
  try {
    const { data, status } = await axios.get('/api/categories');

    if (status === 200) {
      return data;
    }
  } catch (error) {
    return Promise.reject({ error });
  }
};
