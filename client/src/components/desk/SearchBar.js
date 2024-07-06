import React, { useContext } from 'react';
import { FaSearch } from 'react-icons/fa';

import GlobalContext from '../../context/GlobalContext';

const SearchBar = ({ setResults }) => {
  const { allDesks } = useContext(GlobalContext);

  const handleChange = (value) => {
    const result = allDesks?.filter((desk) => {
      return desk.name.toLowerCase().includes(value);
    });

    setResults(result);
  };

  return (
    <div className='w-full rounded-lg h-[12] p-4 shadow-lg flex items-center'>
      <FaSearch className='text-gray-400 cursor-pointer' />
      <input
        type='text'
        placeholder='Find your desk'
        onChange={(e) => handleChange(e.target.value)}
        className='bg-transparent border-0 border-b-2 outline-none text-xl ml-1 placeholder:text-gray-600  w-full'
      />
    </div>
  );
};

export default SearchBar;
