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
import { Mypage } from '../pages/Mypage.tsx';
import { TripEditPage } from '../pages/TripEditPage.tsx';
import { EventEditPage } from '../pages/EventEditPage.tsx';
import { ErrorBoundary } from '../errors/ErrorBoundary.tsx';
import { Suspense } from 'react';
import { FullscreenLoader } from '../components/common/FullscreenLoader.tsx';

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
            element: (
              <ErrorBoundary>
                <Suspense fallback={<FullscreenLoader />}>
                  <HomePage />
                </Suspense>
              </ErrorBoundary>
            ),
          },
          { path: '*', element: <NotFound /> },
          {
            path: 'trips/new',
            element: <TripCreatePage />,
          },
          {
            path: 'trips/:tripId/edit',
            element: (
              <ErrorBoundary>
                <Suspense fallback={<FullscreenLoader />}>
                  <TripEditPage />
                </Suspense>
              </ErrorBoundary>
            ),
          },
          {
            path: 'trips/:tripId',
            element: (
              <ErrorBoundary>
                <Suspense fallback={<FullscreenLoader />}>
                  <TripDetailPage />
                </Suspense>
              </ErrorBoundary>
            ),
          },
          {
            path: 'trips/:tripId/events/new',
            element: <EventCreatePage />,
          },

          {
            path: 'trips/:tripId/events/:eventId/edit',
            element: (
              <ErrorBoundary>
                <Suspense fallback={<FullscreenLoader />}>
                  <EventEditPage />
                </Suspense>
              </ErrorBoundary>
            ),
          },
          {
            path: 'trips/:tripId/events/:eventId',
            element: (
              <ErrorBoundary>
                <Suspense fallback={<FullscreenLoader />}>
                  <EventDetailPage />
                </Suspense>
              </ErrorBoundary>
            ),
          },
          {
            path: 'my-trips',
            element: <MyTripsPage />,
          },
          {
            path: 'mypage',
            element: <Mypage />,
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);
