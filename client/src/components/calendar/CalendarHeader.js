import React, { useContext } from 'react';
import dayjs from 'dayjs';

import calendar from '../../assets/logo.png';
import GlobalContext from '../../context/GlobalContext';

const CalendarHeader = () => {
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);

  const handlePrevMonth = () => {
    setMonthIndex(monthIndex - 1);
  };

  const handleNextMonth = () => {
    setMonthIndex(monthIndex + 1);
  };

  return (
    <header className='px-4 py-2 flex items-center'>
      <img src={calendar} alt='logo' className='mr-2 w-12 h-12' />
      <h1 className='mr-10 text-xl text-gray-700 font-bold'>
        Attendance System
      </h1>
      <button
        className='border rounded text-gray-600 py-2 px-4 mr-5'
        onClick={() => {
          setMonthIndex(dayjs().month());
        }}
      >
        Today
      </button>
      <button onClick={handlePrevMonth}>
        <span className='material-icons-outlined cursor-pointer text-gray-600 mx-2'>
          chevron_left
        </span>
      </button>
      <button onClick={handleNextMonth}>
        <span className='material-icons-outlined cursor-pointer text-gray-600 mx-2'>
          chevron_right
        </span>
      </button>
      <h2 className='ml-4 text-xl text-gray-600 font-bold'>
        {dayjs(new Date(dayjs().year(), monthIndex)).format('MMMM YYYY')}
      </h2>
    </header>
  );
};

export default CalendarHeader;
