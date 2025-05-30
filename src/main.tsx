/**
 * @copyright 2024 mattxslv
 * @license Apache-2.0
 * @description Main entry point for the app
 */

/**
 * Node modules
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';

/**
 * CSS link
 */
import '@/index.css';

/**
 * Routes
 */
import router from '@/routes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);