import { ShoppingBasket } from 'lucide-react'
import { Button } from './ui/button'
import { RootState, useAppDispatch, useAppSelector } from '@/store'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Link } from 'react-router-dom'
import { logout, removeFromCart } from '@/store/app'
import { Product } from '@/pages/home'

export const Header = () => {
  const { loggedIn } = useAppSelector((s) => s.app)
  const { cart } = useAppSelector((s: RootState) => s.app)
  const dispatch = useAppDispatch()

  const doLogout = async () => {
    const token = localStorage.getItem('authToken')

    if (!token) {
      return
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/api/logout', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        dispatch(logout())
        localStorage.removeItem('authToken')
        return
      }

      // set local
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  async function removeFromBasket(product: Product) {
    const token = localStorage.getItem('authToken')

    if (!token) {
      return
    }
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/basket/remove/' + product.id,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity: 1,
          }),
        },
      )

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Bad Request (400)')
        } else {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      }

      const data = await response.json()

      dispatch(removeFromCart(product))
      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <div className="flex items-center justify-between h-16 border-b px-4 lg:px-8">
      <div className="flex items-center">
        <h2>
          <Link to="/">logo</Link>
        </h2>
      </div>
      <div className="flex items-center">
        {loggedIn == true ? (
          <button onClick={() => doLogout()}>Logout</button>
        ) : (
          ''
        )}
        <Popover>
          <PopoverTrigger className="relative">
            {cart.length > 0 && (
              <span className="bg-destructive rounded-full w-4 h-4 shrink-0 absolute -top-2 -right-2 text-xs text-white">
                {cart.length}
              </span>
            )}
            <ShoppingBasket />
          </PopoverTrigger>
          <PopoverContent className="w-[500px]">
            {cart.length > 0 && (
              <>
                <div className="max-h-[500px] overflow-y-auto mb-4">
                  {cart.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-2"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 shrink-0">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h2 className="font-medium">{product.title}</h2>
                          <p>
                            ${product.price} x {product.quantity}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => removeFromBasket(product)}
                      >
                        X
                      </Button>
                    </div>
                  ))}
                </div>
                <Button className="w-full">Checkout</Button>
              </>
            )}
            {cart.length === 0 && <p>Your cart is empty</p>}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
