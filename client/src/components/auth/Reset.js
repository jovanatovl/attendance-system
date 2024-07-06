import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';

import styles from '../../styles/Username.module.css';
import { resetPasswordValidate } from '../../utils/validate.js';
import { useAuthStore } from '../../store/store.js';
import { useFetch } from '../../hooks/fetch.hook.js';
import { restartPassword } from '../../api/authRequests.js';
import Loader from '../Loader';

const Reset = () => {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  const [{ isLoading, apiData, status, serverError }] = useFetch(
    'auth/createResetSession'
  );

  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_pwd: '',
    },
    validate: resetPasswordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let resetPromise = restartPassword({
        username,
        password: values.password,
      });

      toast.promise(resetPromise, {
        loading: 'Updating your Password...',
        success: <b>Password updated Successfully!</b>,
        error: <b>Something went wrong!</b>,
      });

      resetPromise
        .then(() => {
          navigate('/password');
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });

  useEffect(() => {
    console.log(apiData);
  }, [apiData]);

  if (serverError)
    return <h1 className='text-3xl text-red-500'>{serverError.message}</h1>;

  if (status && status !== 201)
    return <Navigate to={'/password'} replace={true} />;

  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass} style={{ width: '50%' }}>
          <div className='title flex flex-col items-center'>
            <h4 className='text-5xl font-bold'>Reset your Password</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Enter new password.
            </span>
          </div>

          {isLoading ? (
            <Loader />
          ) : (
            <form className='pt-20' onSubmit={formik.handleSubmit}>
              <div className='textbox flex flex-col items-center gap-6'>
                <input
                  type='password'
                  placeholder='New password'
                  {...formik.getFieldProps('password')}
                  className={styles.textbox}
                />
                <input
                  type='password'
                  placeholder='Confirm password'
                  {...formik.getFieldProps('confirm_pwd')}
                  className={styles.textbox}
                />
                <button type='submit' className={styles.btn}>
                  Reset Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reset;
