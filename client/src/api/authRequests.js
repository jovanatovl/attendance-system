import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';

// Authenticate
export const authenticate = async (username) => {
  try {
    return await axios.post('/api/auth/authenticate', {
      username,
    });
  } catch (error) {
    return { error: 'Username does not exist!' };
  }
};

// Get All Users
export const getUsers = async () => {
  try {
    const { data } = await axios.get('/api/auth/user');
    return { data };
  } catch (error) {
    return { error: 'No users found!' };
  }
};

// Get User Details
export const getUser = async ({ username }) => {
  try {
    const { data } = await axios.get(`/api/auth/user/${username}`);
    return { data };
  } catch (error) {
    return { error: 'Password does not match!' };
  }
};

// Register User
export const registerUser = async (credentials) => {
  try {
    const {
      data: { message },
      status,
    } = await axios.post('/api/auth/register', credentials);

    let { username, email } = credentials;
    if (status === 201) {
      await axios.post('/api/auth/registerMail', {
        username: username,
        userEmail: email,
        text: message,
      });
    }

    return Promise.resolve(message);
  } catch (error) {
    return Promise.reject({ error });
  }
};

// Login User
export const loginUser = async ({ username, password }) => {
  try {
    if (username) {
      const { data } = await axios.post('/api/auth/login', {
        username: username,
        password: password,
      });
      return Promise.resolve({ data });
    }
  } catch (error) {
    return Promise.reject({ error });
  }
};

// Update User
export const updateUser = async (response) => {
  try {
    const token = localStorage.getItem('token');
    const data = await axios.put(`/api/auth/updateUser`, response, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: 'Could not update the user.' });
  }
};

// Generate OTP
export const generateOTP = async (username) => {
  try {
    const {
      data: { code },
      status,
    } = await axios.get('/api/auth/generateOTP', {
      params: { username },
    });

    if (status === 201) {
      let {
        data: { email },
      } = await getUser({ username });

      let text = `Your Password Recovery OTP: ${code}. Verify and recover your password!`;
      await axios.post('/api/auth/registerMail', {
        username,
        userEmail: email,
        text,
        subject: 'Password Recovery',
      });
    }

    return Promise.resolve({ code });
  } catch (error) {
    return Promise.reject({ error });
  }
};

// Verify OTP
export const verifyOTP = async ({ username, code }) => {
  try {
    const { data, status } = await axios.get('/api/auth/verifyOTP', {
      params: { username, code },
    });
    return { data, status };
  } catch (error) {
    return Promise.reject({ error });
  }
};

// Reset Password
export const restartPassword = async ({ username, password }) => {
  try {
    const { data, status } = await axios.put('/api/auth/resetPassword', {
      username,
      password,
    });

    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({ error });
  }
};
