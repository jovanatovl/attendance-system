import React, { useContext } from 'react';

import CreateEventButton from './events/CreateEventButton';
import CreateCategoryButton from './category/CreateCategoryButton';
import SmallCalendar from './calendar/SmallCalendar';
import ViewMenu from './ViewMenu';
import GlobalContext from '../context/GlobalContext';

const Sidebar = ({ setView, view }) => {
  const { loggedInUserData } = useContext(GlobalContext);

  return (
    <aside className='border p-5 w-64'>
      <CreateEventButton />
      {loggedInUserData?.role === 'admin' && <CreateCategoryButton />}
      <SmallCalendar />
      <ViewMenu setView={setView} view={view} />
    </aside>
  );
};

export default Sidebar;
