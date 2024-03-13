import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useAppDispatch } from '@/store'
import { addToCart } from '@/store/app'
import { ShoppingCartIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: Rating
}

export interface Rating {
  rate: number
  count: number
}

export const HomePage = () => {
  const [products, setProducts] = useState([])
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
  }, [])

  return (
    <>
      <Header />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        {products.map((product: Product) => (
          <div key={product.id} className="border p-4 shadow-md">
            <div className="h-64 w-full overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full object-cover"
              />
            </div>
            <div className="p-2">
              <h2 className="font-medium mb-2 line-clamp-1">{product.title}</h2>
              <p className="line-clamp-3">{product.description}</p>
              <div className="flex items-center justify-between mt-4">
                <p>${product.price}</p>
                <Button
                  size="sm"
                  onClick={() => {
                    dispatch(addToCart(product))
                    toast({
                      title: 'Added to cart',
                      description: `${product.title} was added to your cart`,
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
