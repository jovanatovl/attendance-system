import React, { useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import avatar from '../../assets/logo.png';
import { useFetch } from '../../hooks/fetch.hook';
import Loader from '../Loader';
import { updateUser } from '../../api/authRequests';
import GlobalContext from '../../context/GlobalContext';

const SearchResults = ({ results, setShowDeskModal }) => {
  const [{ isLoading, serverError }] = useFetch();
  const { flag, setFlag } = useContext(GlobalContext);

  const handleDeskChoice = async (result) => {
    let updatePromise = updateUser({
      desk: result._id,
    });

    toast.promise(updatePromise, {
      loading: 'Choosing the desk',
      success: <b>Desk saved Successfully!</b>,
      error: <b>Something went wrong!</b>,
    });
    updatePromise
      .then(() => {
        setShowDeskModal(false);
        setFlag(!flag);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (serverError) return <h2>{serverError}</h2>;

  return (
    <div className='w-full flex flex-col shadow-lg rounded-lg mt-4 max-h[300px] overflow-y-scroll px-3 scrollbar scrollbar-thumb-white scrollbar-track-gray-200'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      {results.map((result, idx) => (
        <div
          key={idx}
          className='cursor-pointer rounded-lg flex items-center px-1 mb-1 hover:bg-gray-700 hover:text-white'
          onClick={() => handleDeskChoice(result)}
        >
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <img
                className='w-10 h-10 rounded'
                src={avatar}
                alt={result.name}
              />
              <p className='text-lg mt-1  py-2 px-1 rounded-lg'>
                {result.name}
              </p>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
