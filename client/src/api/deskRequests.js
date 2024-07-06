import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';

// Create Desk
export const createDesk = async (deskData) => {
  try {
    const {
      data: { message },
    } = await axios.post('/api/desks', deskData);

    return Promise.resolve(message);
  } catch (error) {
    return Promise.reject({ error });
  }
};

// Get Desks
export const getDesks = async () => {
  try {
    const { data, status } = await axios.get('/api/desks');

    if (status === 200) {
      return data;
    }
  } catch (error) {
    return Promise.reject({ error });
  }
};
