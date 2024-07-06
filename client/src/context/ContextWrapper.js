import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

import GlobalContext from './GlobalContext';

import { getUsername } from '../utils/helpers';
import { getDesks } from '../api/deskRequests';
import { getCategories } from '../api/categoryRequests';
import { getAllEvents, getDeskEvents } from '../api/eventRequests';
import { getPublicHolidays } from '../utils/publicHolidays';

const ContextWrapper = (props) => {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [smallCalendarMonth, setSmallCalendarMonth] = useState(null);
  const [daySelected, setDaySelected] = useState(dayjs());
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showDeskModal, setShowDeskModal] = useState(false);
  const [loggedInUserData, setLoggedInUserData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [allDesks, setAllDesks] = useState([]);
  const [flag, setFlag] = useState(false);
  const [deskEvents, setDeskEvents] = useState([]);
  const [administrativeEvents, setAdministrativeEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [publicHolidays, setPublicHolidays] = useState([]);

  useEffect(() => {
    if (smallCalendarMonth !== null) {
      setMonthIndex(smallCalendarMonth);
    }
  }, [smallCalendarMonth]);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const { username } = await getUsername();
      const { data } = await axios.get(`/api/auth/user/${username}`);
      setLoggedInUserData(data);

      if (!data?.desk) {
        setShowDeskModal(true);
      } else {
        setShowDeskModal(false);
      }
    };

    const fetchDesks = async () => {
      const desksPromise = getDesks();

      desksPromise
        .then((desks) => {
          setAllDesks(desks);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const fetchAdministrativeEvents = async () => {
      const eventsPromise = getAllEvents();

      eventsPromise
        .then((data) => {
          setAllEvents(data);
          const administration = data.filter(
            (event) => event.desk.name === 'Administration'
          );
          setAdministrativeEvents(administration);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const fetchCategories = async () => {
      const categoriesPromise = getCategories();

      categoriesPromise
        .then((data) => {
          setCategories(data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchLoggedInUser();
    fetchDesks();
    fetchAdministrativeEvents();
    fetchCategories();
  }, [flag]);

  useEffect(() => {
    const fetchDeskEvents = () => {
      const desksPromise = getDeskEvents(loggedInUserData?.desk);

      desksPromise
        .then((desksEvents) => {
          setDeskEvents(desksEvents);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    if (loggedInUserData?.desk) {
      fetchDeskEvents();
    }
  }, [flag, loggedInUserData]);

  useEffect(() => {
    const getHolidays = async () => {
      const res = await getPublicHolidays();
      setPublicHolidays(res);
    };

    getHolidays();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        loggedInUserData,
        setLoggedInUserData,
        monthIndex,
        setMonthIndex,
        smallCalendarMonth,
        setSmallCalendarMonth,
        daySelected,
        setDaySelected,
        showEventModal,
        setShowEventModal,
        showCategoriesModal,
        setShowCategoriesModal,
        showDeskModal,
        setShowDeskModal,
        categories,
        setCategories,
        selectedEvent,
        setSelectedEvent,
        allDesks,
        setAllDesks,
        flag,
        setFlag,
        deskEvents,
        setDeskEvents,
        administrativeEvents,
        setAdministrativeEvents,
        allEvents,
        setAllEvents,
        publicHolidays,
        setPublicHolidays,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

export default ContextWrapper;
