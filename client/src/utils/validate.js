import toast from 'react-hot-toast';
import { authenticate } from '../api/authRequests';

export const usernameValidate = async (values) => {
  const errors = usernameVerify({}, values);

  if (values.username) {
    // Check if user exists
    const { status } = await authenticate(values.username);

    if (status !== 200) {
      errors.exist = toast.error('User does not exist!');
    }
  }

  return errors;
};

export const passwordValidate = async (values) => {
  const errors = passwordVerify({}, values);
  return errors;
};

export const resetPasswordValidate = async (values) => {
  const errors = passwordVerify({}, values);

  if (values.password !== values.confirm_pwd) {
    errors.exist = toast.error('Passwords do not match!');
  }

  return errors;
};

export const registerValidate = async (values) => {
  const errors = usernameVerify({}, values);
  passwordVerify(errors, values);
  emailVerify(errors, values);

  return errors;
};

export const profileValidate = async (values) => {
  const errors = emailVerify({}, values);

  return errors;
};

const usernameVerify = (error = {}, values) => {
  if (!values.username) {
    error.username = toast.error('Username is Required!');
  } else if (values.username.includes(' ')) {
    error.username = toast.error('Invalid Username!');
  } else if (values.username.length < 6) {
    error.username = toast.error(
      'Username must be at least 6 characters long!'
    );
  }
  return error;
};

const passwordVerify = (error = {}, values) => {
  const specialCharacters = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;

  if (!values.password) {
    error.password = toast.error('Password is Required!');
  } else if (values.password.length < 6) {
    error.password = toast.error(
      'Password must be at least 6 characters long!'
    );
  } else if (!specialCharacters.test(values.password)) {
    error.password = toast.error(
      'Password must have at least one special character!'
    );
  }

  return error;
};

const emailVerify = (error = {}, values) => {
  const emailCharacters = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  if (!values.email) {
    error.email = toast.error('Email is Required!');
  } else if (values.email.length < 5) {
    error.email = toast.error('Wrong Email format!');
  } else if (!emailCharacters.test(values.email)) {
    error.email = toast.error('Wrong Email format!');
  }

  return error;
};
