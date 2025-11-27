import { createBrowserRouter, type RouteObject } from 'react-router-dom';

import { HomePage } from '../pages/HomePage.tsx';
import { LoginPage } from '../pages/LoginPage.tsx';
import NotFound from '../pages/NotFound.tsx';
import { ProtectedLayout } from '../layouts/ProtectedLayout.tsx';
import { LoginLayout } from '../layouts/LoginLayout.tsx';
import { HomeLayout } from '../layouts/HomeLayout.tsx';

const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <LoginLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },

      { path: '*', element: <NotFound /> },
    ],
  },
];

const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      {
        element: <HomeLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);
