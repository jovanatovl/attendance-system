import React, { useContext, useEffect, useState } from 'react';

import { getMonth } from '../utils/calendarUtils';
import GlobalContext from '../context/GlobalContext';
import CalendarHeader from '../components/calendar/CalendarHeader';
import Sidebar from '../components/Sidebar';
import Month from '../components/calendar/Month';
import AdminDashboard from '../components/admin/AdminDashboard';
import EventModal from '../components/events/EventModal';
import CategoryModal from '../components/category/CategoryModal';
import DeskModal from '../components/desk/DeskModal';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const [view, setView] = useState('month');

  const { monthIndex, showEventModal, showCategoriesModal, showDeskModal } =
    useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  return (
    <>
      <div className='h-screen flex flex-col bg-stone-50'>
        <CalendarHeader />
        <div className='flex flex-1'>
          <Sidebar setView={setView} view={view} />
          {view === 'month' && <Month month={currentMonth} />}
          {view === 'admin' && <AdminDashboard />}
        </div>
      </div>

      {showEventModal && <EventModal />}
      {showCategoriesModal && <CategoryModal />}
      {showDeskModal && <DeskModal />}
    </>
  );
};

export default Calendar;
