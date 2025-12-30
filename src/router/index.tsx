import { createBrowserRouter, type RouteObject } from 'react-router-dom';

import { HomePage } from '../pages/HomePage.tsx';
import { LoginPage } from '../pages/LoginPage.tsx';
import { TripCreatePage } from '../pages/TripCreatePage.tsx';
import { NotFound } from '../pages/NotFound.tsx';
import { ProtectedLayout } from '../layouts/ProtectedLayout.tsx';
import { BaseLayout } from '../layouts/BaseLayout.tsx';
import { TripDetailPage } from '../pages/TripDetailPage.tsx';
import { EventCreatePage } from '../pages/EventCreatePage.tsx';
import { EventDetailPage } from '../pages/EventDetailPage.tsx';
import { MyTripsPage } from '../pages/MyTripsPage.tsx';

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
            path: 'trips/:tripId',
            element: <TripDetailPage />,
          },
          {
            path: 'trips/:tripId/events/new',
            element: <EventCreatePage />,
          },
          {
            path: 'trips/:tripId/events/:eventId',
            element: <EventDetailPage />,
          },
          {
            path: 'my-trips',
            element: <MyTripsPage />,
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);
