import { createBrowserRouter, type RouteObject } from 'react-router-dom';

import { HomePage } from '../pages/HomePage.tsx';
import { LoginPage } from '../pages/LoginPage.tsx';
import { TripCreatePage } from '../pages/TripCreatePage.tsx';
import { NotFound } from '../pages/NotFound.tsx';
import { ProtectedLayout } from '../layouts/ProtectedLayout.tsx';
import { BaseLayout } from '../layouts/BaseLayout.tsx';
import { TripDetailPage } from '../pages/TripDetailPage.tsx';
import { EventCreatePage } from '../pages/EventCreatePage.tsx';

const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <BaseLayout />,
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
        element: <BaseLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          { path: '*', element: <NotFound /> },
          {
            path: 'trips/new',
            element: <TripCreatePage />,
          },
          {
            path: 'trips/:id',
            element: <TripDetailPage />,
          },
          {
            path: 'events/new',
            element: <EventCreatePage />,
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);
