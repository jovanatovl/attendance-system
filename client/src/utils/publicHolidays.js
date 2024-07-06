import axios from 'axios';
import dayjs from 'dayjs';

export const getPublicHolidays = async () => {
  const currentYear = dayjs().year();

  const holidaysOptions = {
    method: 'GET',
    url: `https://public-holiday.p.rapidapi.com/${currentYear}/RS`,
    headers: {
      'X-RapidAPI-Key': 'fa3797adbbmsh87a0912c708974bp1ab663jsn4a8b90f8756f',
      'X-RapidAPI-Host': 'public-holiday.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(holidaysOptions);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
