import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useAppDispatch } from '@/store'
import { ShoppingCartIcon } from 'lucide-react'
import { Product } from '@/libs/interfaces'
import { addToCart, emptyCart, login, logout } from '@/store/app'
import {
  addToBasket,
  checkToken,
  fetchBasket,
  fetchProducts,
} from '@/libs/utils'

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken')
    if (storedToken) {
      checkToken(storedToken)
        .then((result) => {
          if (result) {
            dispatch(login())
          }
        })
        .catch((error) => {
          if (!error) {
            dispatch(logout())
            dispatch(emptyCart())
          }
        })
    }

    fetchProducts().then((result) => setProducts(result))
    fetchBasket()
      .then((result) => {
        result.forEach((item: Product) => {
          dispatch(addToCart(item))
        })
      })
      .catch((error) => {
        dispatch(logout())
        dispatch(emptyCart())
        toast({
          title: 'Basket',
          description: `${error}`,
        })
      })
  }, [])

  return (
    <>
      <Header />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 shadow-md">
            <div className="h-54 w-full overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full object-cover"
              />
            </div>
            <div className="p-2">
              <h2 className="font-medium mb-2 line-clamp-1">{product.name}</h2>
              <p className="line-clamp-3">{product.description}</p>
              <div className="flex items-center justify-between mt-4">
                <p>€{product.price}</p>
                <Button
                  size="sm"
                  onClick={() => {
                    addToBasket(product.id)
                      .then(() => {
                        dispatch(addToCart(product))
                        toast({
                          title: 'Added to cart',
                          description: `${product.name} was added to your cart`,
                        })
                      })
                      .catch((error) => {
                        console.error('Error adding to cart:', error)
                        toast({
                          title: 'Error',
                          description: `${product.name} was not added to your cart`,
                        })
                      })
                  }}
                >
                  <ShoppingCartIcon />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default HomePage
