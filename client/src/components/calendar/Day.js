import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';

import GlobalContext from '../../context/GlobalContext';
import { getEvents } from '../../api/eventRequests';
import { useFetch } from '../../hooks/fetch.hook';
import Loader from '../Loader';

const Day = ({ day, rowIdx }) => {
  const [dayEvents, setDayEvents] = useState([]);

  const getCurrentDayClass = () => {
    return day.format('DD-MM-YY') === dayjs().format('DD-MM-YY')
      ? 'bg-indigo-600 text-white rounded-full w-7'
      : '';
  };

  const {
    setDaySelected,
    setShowEventModal,
    categories,
    showEventModal,
    setSelectedEvent,
    deskEvents,
    administrativeEvents,
    allEvents,
    loggedInUserData,
    publicHolidays,
  } = useContext(GlobalContext);
  const [{ isLoading, apiData, serverError }] = useFetch();

  useEffect(() => {
    var date = new Date(day);
    const eventsPromise = getEvents({
      creator: apiData?._id,
      date: date.toLocaleDateString(),
    });

    eventsPromise
      .then((data) => {
        setDayEvents(data);
      })
      .catch((error) => {
        //console.log(error);
      });
  }, [apiData, day, showEventModal]);

  if (serverError) return <h2>{serverError}</h2>;

  return (
    <div className='border border-gray-200 flex flex-col overflow-x-auto overflow-y-scroll scrollbar-none h-[150px]'>
      <header className='flex flex-col items-center'>
        {rowIdx === 0 && (
          <p className='text-sm mt-1'>{day.format('ddd').toUpperCase()}</p>
        )}
        <p className={`text-sm p-1 my-1 text-center ${getCurrentDayClass()}`}>
          {day.format('DD')}
        </p>
      </header>

      <div
        className='flex-1 cursor-pointer'
        onClick={() => {
          setDaySelected(day);
          setShowEventModal(true);
        }}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            {dayEvents.map((dayEvent, i) => (
              <div
                key={i}
                onClick={() => setSelectedEvent(dayEvent)}
                className={`${
                  categories.filter(
                    (categ) => categ.name === dayEvent.category.name
                  )[0].bgClass
                } text-white max-h- rounded p-1 text-sm mb-1 truncate hover:bg-opacity-50`}
              >
                {dayEvent.slot} {dayEvent.title}
              </div>
            ))}
          </div>
        )}
      </div>
      {publicHolidays?.map((holiday, i) => (
        <React.Fragment>
          {day.format('DD-MM-YY') ===
            dayjs(holiday?.date).format('DD-MM-YY') && (
            <div
              key={i}
              className='bg-green-900 text-white rounded p-1 text-sm mb-1 truncate hover:bg-opacity-50'
            >
              {holiday?.name}
            </div>
          )}
        </React.Fragment>
      ))}
      <span className='bg-green-500'></span>
      {administrativeEvents?.map((event, i) => (
        <div key={i}>
          {event.date === new Date(day).toLocaleDateString() &&
            event.creator?._id !== loggedInUserData?._id && (
              <div
                key={i}
                className={`flex items-center bg-gray-900 text-white rounded py-2 pl-1 text-sm mb-1 truncate hover:bg-opacity-50`}
              >
                <span>
                  {event.slot} - {event.title}
                </span>
              </div>
            )}
        </div>
      ))}
      {deskEvents?.map((event, i) => (
        <div key={i}>
          {event.date === new Date(day).toLocaleDateString() &&
            event.creator?._id !== loggedInUserData?._id && (
              <div
                className={`flex items-center bg-gray-400 text-white rounded py-2 pl-1 text-sm mb-1 truncate hover:bg-opacity-50`}
              >
                <span>
                  {event.slot} {event.creator.username} - {event.title}
                </span>
              </div>
            )}
        </div>
      ))}
      {loggedInUserData?.role === 'admin' &&
        allEvents.map((event, i) => (
          <div key={i}>
            {event.date === new Date(day).toLocaleDateString() &&
              event.creator?._id !== loggedInUserData?._id && (
                <div
                  className={`flex items-center bg-gray-400 text-white rounded py-2 pl-1 text-sm mb-1 truncate hover:bg-opacity-50`}
                >
                  <span>
                    {event.slot} {event.creator.username} - {event.title}
                  </span>
                </div>
              )}
          </div>
        ))}
    </div>
  );
};

export default Day;
