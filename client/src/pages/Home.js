import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../styles/Homepage.module.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className='container mx-auto'>
      <div className='flex justify-center items-center h-screen flex-col'>
        <h1 className='text-3xl font-bold'>Welcome to Attendance System</h1>
        <button
          className={`${styles.btn} bg-indigo-500 text-white font-bold py-2 px-4 rounded mt-5`}
          onClick={() => navigate('/username')}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
