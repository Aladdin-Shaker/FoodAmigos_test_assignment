import { Toaster } from '@/components/ui/toaster'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SigninForm } from './components/login-form'
import { HomePage } from './pages/home'
import { OrderPage } from './pages/order'
import { useAppSelector } from './store'
import { OrdersPage } from './pages/orders'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/orders',
    element: <OrdersPage />,
  },
  {
    path: '/orders/:id',
    element: <OrderPage />,
  },
])

function Routes() {
  const { loggedIn } = useAppSelector((s) => s.app)
  return (
    <>
      {!loggedIn && <SigninForm />}
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}

export default Routes
