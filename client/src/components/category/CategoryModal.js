import React, { useContext, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import GlobalContext from '../../context/GlobalContext';
import { createCategory } from '../../api/categoryRequests';

const CategoryModal = () => {
  const [name, setName] = useState('');
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isIconOpen, setIsIconOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('bg-indigo-500');
  const [selectedIcon, setSelectedIcon] = useState('check');
  const colorDropdownItems = ['indigo', 'green', 'red', 'pink', 'teal'];
  const iconDropdownItems = [
    'add_circle_outlined',
    'grading',
    'check',
    'settings',
  ];

  const toggleColorDropdown = () => {
    setIsColorOpen(!isColorOpen);
  };

  const toggleIconDropdown = () => {
    setIsIconOpen(!isIconOpen);
  };

  const { setShowCategoriesModal, flag, setFlag } = useContext(GlobalContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let categoryData = {
      name: name,
      bgClass: selectedColor,
      iconTag: selectedIcon,
    };

    let createPromise = createCategory(categoryData);

    toast.promise(createPromise, {
      loading: 'Creating Category...',
      success: <b>Created Successfully!</b>,
      error: <b>Something went wrong!</b>,
    });
    createPromise
      .then(() => {
        setTimeout(() => {
          setShowCategoriesModal(false);
          setFlag(!flag);
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className='bg-black/50 h-screen w-full fixed left-0 top-0 flex justify-center items-center'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <form
        className='bg-white rounded-lg shadow-2xl w-1/2'
        onSubmit={handleSubmit}
      >
        <header className='bg-gray-100 px-4 py-2 flex justify-between items-center'>
          <span className='material-icons-outlined text-gray-500'>
            drag_handle
          </span>
          <button
            type='button'
            onClick={() => {
              setShowCategoriesModal(false);
            }}
          >
            <span className='bg-red-500'></span>
            <span className='bg-teal-500'></span>
            <span className='material-icons-outlined text-red-500'>close</span>
          </button>
        </header>
        <div className='p-3'>
          <div className='grid grid-cols-1/5 items-end gap-y-7'>
            <div></div>
            <input
              type='text'
              name='name'
              placeholder='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='pt-3 border-0 text-gray-600 font-semibold text-lg pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-indigo-600'
            />
            <span className='material-icons-outlined text-gray-400 mb-2 ml-10'>
              palette
            </span>
            <div className='relative'>
              <button
                className={`${selectedColor} text-white hover:bg-gray-300  font-bold py-2 px-4 rounded inline-flex items-center`}
                onClick={toggleColorDropdown}
                type='button'
              >
                Color
              </button>
              <ul
                className={`absolute ${
                  isColorOpen ? 'block' : 'hidden'
                }  text-gray-800 pt-1 `}
              >
                {colorDropdownItems.map((item, index) => (
                  <li
                    key={index}
                    className={`bg-${item}-500 cursor-pointer text-white hover:bg-gray-200 py-2 px-4`}
                    onClick={() => {
                      setSelectedColor(`bg-${item}-500`);
                      setIsColorOpen(false);
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <button
                className={`bg-gray-500 ml-2 text-white hover:bg-gray-300 font-bold py-2 px-4 rounded inline-flex items-center`}
                onClick={toggleIconDropdown}
                type='button'
              >
                <span className='material-icons-outlined text-xs pr-2'>
                  {selectedIcon}
                </span>
                Icon
              </button>
              <ul
                className={`absolute ${
                  isIconOpen ? 'block' : 'hidden'
                }  text-gray-800 pt-1 ml-20`}
              >
                {iconDropdownItems.map((item, index) => (
                  <li
                    key={index}
                    className={`bg-gray-400 cursor-pointer text-white hover:bg-gray-200 py-2 pl-2`}
                    onClick={() => {
                      setSelectedIcon(item);
                      setIsIconOpen(false);
                    }}
                  >
                    <span className='material-icons-outlined'>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <footer className='flex justify-end w-100 border-t p-3 mt-5'>
          <button
            type='submit'
            className='bg-indigo-600 px-6 py-2 rounded text-white hover:bg-indigo-200'
          >
            Create
          </button>
        </footer>
      </form>
    </div>
  );
};

export default CategoryModal;
