import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';

import styles from '../styles/Username.module.css';
import avatar from '../assets/usercalendar.png';
import { registerValidate } from '../utils/validate';
import { convertToBase64 } from '../utils/convert';
import { registerUser } from '../api/authRequests';

const Register = () => {
  const [file, setFile] = useState();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    validate: registerValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = Object.assign(values, { profile: file || '' });
      let registerPromise = registerUser(values);
      toast.promise(registerPromise, {
        loading: 'Signing up...',
        success: <b>Registered Successfully!</b>,
        error: <b>Something went wrong!</b>,
      });
      registerPromise
        .then(() => {
          navigate('/username');
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center h-screen'>
        <div
          className={styles.glass}
          style={{ width: '45%', paddingTop: '3em', minHeight: '90%' }}
        >
          <div className='title flex flex-col items-center'>
            <h4 className='text-5xl font-bold'>Create an Account</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Keep your Calendar tiddy!
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <label htmlFor='profile'>
                <img
                  src={file || avatar}
                  alt='avatar'
                  className={styles.profile_img}
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
              <input
                type='text'
                placeholder='Email'
                {...formik.getFieldProps('email')}
                className={styles.textbox}
              />
              <input
                type='text'
                placeholder='Username'
                {...formik.getFieldProps('username')}
                className={styles.textbox}
              />
              <input
                type='password'
                placeholder='Password'
                {...formik.getFieldProps('password')}
                className={styles.textbox}
              />
              <button type='submit' className={styles.btn}>
                Sign Up!
              </button>
            </div>

            <div className='text-center py-4'>
              <span className='text-gray-500'>
                Already have an Account?{' '}
                <Link to='/username' className='text-red-500'>
                  Sign In!
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
