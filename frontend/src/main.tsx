import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './routes/main/App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SensorData from './routes/sensor_data/sensor_data.tsx'
import SpecificRoute from './routes/specificRoute/specificRoute.tsx'
import ErrorNotFound from './components/error/error.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorNotFound />
  },
  {
    path: 'sensor_data',
    element: <SensorData />
  }, 
  {
    path: 'routes/:routeId',
    element: <SpecificRoute />

  }
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
