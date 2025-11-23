import { createBrowserRouter, type RouteObject } from 'react-router-dom';

import { HomeLayout } from '../layouts/HomeLayout';
import { HomePage } from '../pages/HomePage.tsx';
import { LoginPage } from '../pages/LoginPage.tsx';
import { ErrorBoundary } from '../components/ErrorBoundary.tsx';
import NotFound from '../pages/NotFound.tsx';
import { ProtectedLayout } from '../layouts/ProtectedLayout.tsx';

const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <ErrorBoundary />,
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
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },

      { path: '*', element: <NotFound /> },
    ],
  },
];

export const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);
