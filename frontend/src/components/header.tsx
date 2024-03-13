import { ShoppingBasket } from 'lucide-react'
import { Button } from './ui/button'
import { RootState, useAppSelector } from '@/store'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Link } from 'react-router-dom'
export const Header = () => {
  const { cart } = useAppSelector((s: RootState) => s.app)

  return (
    <div className="flex items-center justify-between h-16 border-b px-4 lg:px-8">
      <div className="flex items-center">
        <h2>
          <Link to="/">logo</Link>
        </h2>
      </div>
      <div className="flex items-center">
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
                      <Button variant="destructive">X</Button>
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
