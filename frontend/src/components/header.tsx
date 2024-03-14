import { ShoppingBasket } from 'lucide-react'
import { Button } from './ui/button'
import { RootState, useAppDispatch, useAppSelector } from '@/store'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Link } from 'react-router-dom'
import { checkout, doLogout, removeFromBasket } from '@/libs/utils'
import { emptyCart, logout, removeFromCart } from '@/store/app'
import { Product } from '@/libs/interfaces'
import { toast } from './ui/use-toast'
import { Input } from './ui/input'
import { useState } from 'react'

export const Header = () => {
  const { loggedIn } = useAppSelector((s) => s.app)
  const { cart } = useAppSelector((s: RootState) => s.app)
  const [note, setNote] = useState<string>('')

  const dispatch = useAppDispatch()

  function _logout(): void {
    doLogout().then(() => {
      dispatch(logout())
      dispatch(emptyCart())
    })
  }
  function _removeProduct(_product: Product): void {
    removeFromBasket(_product).then(() => {
      dispatch(removeFromCart(_product))
    })
  }
  function _checkout(): void {
    checkout(note)
      .then(() => {
        dispatch(emptyCart())
        localStorage.removeItem('total_price')

        toast({
          title: 'Checkout',
          description: `Order placed successfully`,
        })
      })
      .catch((error) => {
        toast({
          title: 'Checkout',
          description: `${error}`,
        })
      })
  }

  const handleChangeNote = (event) => {
    setNote(event.target.value)
  }

  return (
    <div className="flex items-center justify-between h-16 border-b px-4 lg:px-8">
      <div className="flex items-center">
        <h2>
          <Link to="/">HOME</Link>
        </h2>
      </div>
      <div className="flex items-center">
        {loggedIn == true ? (
          <Link to="/orders">
            <button className="mx-3">Orders</button>
          </Link>
        ) : (
          ''
        )}
        {loggedIn == true ? (
          <button className="mx-3" onClick={() => _logout()}>
            Logout
          </button>
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
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h2 className="font-medium">{product.name}</h2>
                          <p>
                            ${product.price} x {product.quantity}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => _removeProduct(product)}
                      >
                        X
                      </Button>
                    </div>
                  ))}
                </div>

                <Input
                  className="mb-2"
                  type="text"
                  placeholder="Write note"
                  value={note}
                  onChange={handleChangeNote}
                ></Input>

                <Button className="w-full" onClick={() => _checkout()}>
                  Checkout ${localStorage.getItem('total_price')}
                </Button>
              </>
            )}
            {cart.length === 0 && <p>Your cart is empty</p>}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
