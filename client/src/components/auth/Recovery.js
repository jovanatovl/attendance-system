import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import styles from '../../styles/Username.module.css';
import { useAuthStore } from '../../store/store';
import { generateOTP, verifyOTP } from '../../api/authRequests';

const Recovery = () => {
  const [otp, setOtp] = useState();
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);

  useEffect(() => {
    generateOTP(username)
      .then((OTP) => {
        if (OTP)
          return toast.success('OTP has been sent to your email address.');
        return toast.error('Something went wrong. Try again!');
      })
      .catch((error) => {
        console.log(error);
      });
  }, [username]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let { status } = await verifyOTP({ username, code: otp });
      if (status === 201) {
        toast.success('Account Verified!');
        return navigate('/reset');
      }
    } catch (error) {
      console.log(error);
      return toast.error('Wrong OTP code. Try again!');
    }
  };

  const onResend = () => {
    let sendPromise = generateOTP(username);
    toast.promise(sendPromise, {
      loading: 'Creating an OTP code...',
      success: <b>OTP has been sent to your email address.</b>,
      error: <b>Something went wrong. Try again!</b>,
    });

    sendPromise.then((OTP) => {
      console.log('Success' + OTP);
    });
  };

  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>
          <div className='title flex flex-col items-center'>
            <h4 className='text-5xl font-bold'>Forgot your Password?</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Enter OTP to recover your password.
            </span>
          </div>

          <form className='pt-20' onSubmit={onSubmit}>
            <div className='textbox flex flex-col items-center gap-6'>
              <div className='input text-center'>
                <span className='py-4 text-sm text-left text-gray-500'>
                  Enter 6 digit OTP sent to your email address.
                </span>
                <input
                  type='text'
                  placeholder='OTP'
                  onChange={(e) => setOtp(e.target.value)}
                  className={styles.textbox}
                />
              </div>

              <button type='submit' className={styles.btn}>
                Recover
              </button>
            </div>

            <div className='text-center py-4'>
              <span className='text-gray-500'>
                Didn't receive an email?{' '}
                <button
                  onClick={onResend}
                  type='button'
                  className='text-red-500'
                >
                  Resend
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Recovery;
