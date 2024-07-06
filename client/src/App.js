import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { ProtectedRoute, AuthorizeUser } from './utils/authProtector';
import Home from './pages/Home';
import Register from './pages/Register';
import Calendar from './pages/Calendar';
import Username from './components/auth/Username';
import Password from './components/auth/Password';
import Recovery from './components/auth/Recovery';
import Reset from './components/auth/Reset';
import Profile from './components/auth/Profile';
import ContextWrapper from './context/ContextWrapper';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/username',
    element: <Username />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/password',
    element: (
      <ProtectedRoute>
        <Password />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <AuthorizeUser>
        <Profile />
      </AuthorizeUser>
    ),
  },
  {
    path: '/recovery',
    element: (
      <ProtectedRoute>
        <Recovery />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reset',
    element: (
      <ProtectedRoute>
        <Reset />
      </ProtectedRoute>
    ),
  },
  {
    path: '/calendar',
    element: (
      <AuthorizeUser>
        <ContextWrapper>
          <Calendar />
        </ContextWrapper>
      </AuthorizeUser>
    ),
  },
]);

const App = () => {
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>
  );
};

export default App;
