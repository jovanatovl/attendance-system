import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import GlobalContext from '../context/GlobalContext';

const ViewMenu = ({ setView, view }) => {
  const navigate = useNavigate();
  const { loggedInUserData } = useContext(GlobalContext);

  return (
    <div className='mt-5'>
      <ul
        className='py-2 text-sm text-gray-500 font-bold'
        aria-labelledby='dropdownLargeButton'
      >
        <li
          onClick={() => setView('month')}
          className={`cursor-pointer block px-4 py-2 rounded hover:bg-gray-300 ${
            view === 'month' && 'bg-gray-200'
          }`}
        >
          Calendar
        </li>
        {loggedInUserData?.role === 'admin' && (
          <li
            onClick={() => setView('admin')}
            className={`cursor-pointer block px-4 py-2 rounded hover:bg-gray-300 ${
              view === 'admin' && 'bg-gray-200'
            }`}
          >
            Admin Dashboard
          </li>
        )}

        <li
          onClick={() => navigate('/profile')}
          className={`cursor-pointer block px-4 py-2 rounded hover:bg-gray-300 `}
        >
          Profile
        </li>
      </ul>
    </div>
  );
};

export default ViewMenu;
