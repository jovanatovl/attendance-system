import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';

// Create Event
export const createEvent = async (eventData) => {
  try {
    const {
      data: { message },
      status,
    } = await axios.post('/api/events', eventData);

    if (status === 201) {
      await axios.post('/api/auth/icsMail', {
        username: eventData.username,
        userEmail: eventData.userEmail,
        attachmentName: eventData.attachmentName,
        attachmentContent: eventData.attachmentContent,
      });
    }

    return Promise.resolve(message);
  } catch (error) {
    return Promise.reject({ error });
  }
};

// Get Events
export const getEvents = async (query) => {
  const { creator, date } = query;

  try {
    const { data, status } = await axios.get(
      `/api/events?creator=${creator}&date=${date}`
    );

    if (status === 200) {
      return data;
    } else {
      return [];
    }
  } catch (error) {
    return Promise.reject({ error });
  }
};

// Get All Events
export const getAllEvents = async (desk) => {
  try {
    const { data, status } = await axios.get(`/api/events/all`);

    if (status === 200) {
      return data;
    } else {
      return [];
    }
  } catch (error) {
    return Promise.reject({ error });
  }
};

// Get Desk Events
export const getDeskEvents = async (desk) => {
  try {
    const { data, status } = await axios.get(`/api/events/desk?desk=${desk}`);

    if (status === 200) {
      return data;
    } else {
      return [];
    }
  } catch (error) {
    return Promise.reject({ error });
  }
};

// Get Event
export const getEvent = async (id) => {
  try {
    const { data, status } = await axios.get(`/api/events/${id}`);

    if (status === 200) {
      return data;
    }
  } catch (error) {
    return Promise.reject({ error });
  }
};

// Update Event
export const updateEvent = async (id, updateData) => {
  try {
    const data = await axios.put(`/api/events/${id}`, updateData);

    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: 'Could not update the event.' });
  }
};

// Delete Event
export const deleteEvent = async (id) => {
  try {
    const data = await axios.delete(`/api/events/${id}`);

    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: 'Could not delete the event.' });
  }
};
