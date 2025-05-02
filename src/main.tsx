import { Suspense, StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Loader, Center } from '@mantine/core';

import App from './App';
import Landing from './pages/landing/Landing';
import LaunchDetail from './pages/landing/LaunchDetail';
import Login from './pages/auth/Login';
import AuthRoute from './components/AuthRoute';
import NotFound from './pages/NotFound';

const RocketLoader = () => (
  <Center h="100vh">
    <Loader size="lg" color="teal" />
  </Center>
);

export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: (
          <AuthRoute>
            <Landing />
          </AuthRoute>
        ),
      },
      {
        path: '/launches',
        element: (
          <AuthRoute>
            <Landing />
          </AuthRoute>
        ),
      },
      {
        path: '/launches/:id',
        element: (
          <AuthRoute>
            <LaunchDetail />
          </AuthRoute>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

const router = createBrowserRouter(routes);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 1000 * 60 * 15,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<RocketLoader />}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  </StrictMode>
);
