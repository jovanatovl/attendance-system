import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';

import styles from '../../styles/Username.module.css';
import profileStyles from '../../styles/Profile.module.css';
import avatar from '../../assets/usercalendar.png';
import { profileValidate } from '../../utils/validate.js';
import { convertToBase64 } from '../../utils/convert.js';
import { useFetch } from '../../hooks/fetch.hook.js';
import { updateUser } from '../../api/authRequests.js';
import Loader from '../Loader';

const Profile = () => {
  const [file, setFile] = useState();
  const navigate = useNavigate();
  const [{ isLoading, apiData, serverError }] = useFetch();

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      username: apiData?.username || '',
      email: apiData?.email || '',
    },
    enableReinitialize: true,
    validate: profileValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = Object.assign(values, {
        profile: file || apiData?.profile || '',
      });
      let updatePromise = updateUser(values);
      toast.promise(updatePromise, {
        loading: 'Updating profile information...',
        success: <b>Updated profile information!</b>,
        error: <b>Something went wrong!</b>,
      });
    },
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  const onLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (serverError)
    return <h1 className='text-3xl text-red-500'>{serverError.message}</h1>;

  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center h-screen'>
        <div
          className={`${styles.glass} ${profileStyles.glass}`}
          style={{ width: '45%', paddingTop: '3em' }}
        >
          <div className='title flex flex-col items-center'>
            <h4 className='text-5xl font-bold'>Profile Settings</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Edit your Information
            </span>
          </div>

          {isLoading ? (
            <Loader />
          ) : (
            <form className='py-1' onSubmit={formik.handleSubmit}>
              <div className='profile flex justify-center py-4'>
                <label htmlFor='profile'>
                  <img
                    src={file || apiData?.profile || avatar}
                    alt='avatar'
                    className={`${styles.profile_img} ${profileStyles.profile_img}`}
                  />
                </label>
                <input
                  type='file'
                  id='profile'
                  name='profile'
                  onChange={onUpload}
                />
              </div>

              <div className='textbox flex flex-col items-center gap-6'>
                <div className='name flex w-3/4 gap-10'>
                  <input
                    type='text'
                    placeholder='First Name'
                    {...formik.getFieldProps('firstName')}
                    className={`${styles.textbox} ${profileStyles.textbox}`}
                  />
                  <input
                    type='text'
                    placeholder='Last Name'
                    {...formik.getFieldProps('lastName')}
                    className={`${styles.textbox} ${profileStyles.textbox}`}
                  />
                </div>
                <input
                  type='text'
                  placeholder='Email'
                  disabled
                  {...formik.getFieldProps('email')}
                  className={`${styles.textbox} ${profileStyles.textbox}`}
                />
                <input
                  type='text'
                  placeholder='Username'
                  disabled
                  {...formik.getFieldProps('username')}
                  className={`${styles.textbox} ${profileStyles.textbox}`}
                />

                <button type='submit' className={styles.btn}>
                  Update Details!
                </button>
              </div>

              <div className='text-center py-4'>
                <span className='text-gray-500'>
                  That's it for now?{' '}
                  <button onClick={onLogout} className='text-red-500'>
                    Logout
                  </button>
                </span>
              </div>
              <div className='text-center'>
                <span
                  onClick={() => navigate('/calendar')}
                  className='text-gray-500 cursor-pointer'
                >
                  Back to Calendar
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
