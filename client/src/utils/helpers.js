import { jwtDecode } from 'jwt-decode';

// Get Username From Token
export const getUsername = async () => {
  const token = localStorage.getItem('token');
  if (!token) return Promise.reject('No Token!');

  let decode = jwtDecode(token);
  return decode; // { id: ..., username: ...}
};
