import { useEffect, useState } from 'react';
import axios from 'axios';
import { getUsername } from '../utils/helpers';

axios.defaults.baseURL = 'http://localhost:8000';

export const useFetch = (query) => {
  const [fetchData, setFetchData] = useState({
    isLoading: false,
    apiData: undefined,
    status: null,
    serverError: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchData((prev) => ({ ...prev, isLoading: true }));

        const { username } = !query ? await getUsername() : '';
        const { data, status } = !query
          ? await axios.get(`/api/auth/user/${username}`)
          : await axios.get(`/api/${query}`);

        if (status === 200 || status === 201) {
          setFetchData((prev) => ({
            ...prev,
            isLoading: false,
            apiData: data,
            status: status,
          }));
        }
      } catch (error) {
        setFetchData((prev) => ({
          ...prev,
          isLoading: false,
          serverError: error,
        }));
      }
    };

    fetchData();
  }, [query]);

  return [fetchData, setFetchData];
};
