import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useAppDispatch } from '@/store'
import { addToCart, login, logout } from '@/store/app'
import { ShoppingCartIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export interface Product {
  id: number
  name: string
  price: number
  description: string
  imageUrl: string
}

export interface Rating {
  rate: number
  count: number
}

export const HomePage = () => {
  const [products, setProducts] = useState([])
  const [storedToken, setToken] = useState<string | null>()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  //
  useEffect(() => {
    setToken(localStorage.getItem('authToken'))
    console.log('storedToken', storedToken)
    if (storedToken) {
      checkToken(storedToken)
    }
    getProducts()
    getBasket()
  }, [])

  async function addToBasket(productId: number) {
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/basket/add/' + productId,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken}`,
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
      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  async function getProducts() {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/products', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  async function getBasket() {
    const token = localStorage.getItem('authToken')

    if (!token) {
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/basket', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()

      if (!response.ok) {
        dispatch(logout())
        localStorage.removeItem('authToken')
        return
      }

      data.items.map((item: Product) => {
        dispatch(addToCart(item))
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  async function checkToken(token: string) {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/me', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        dispatch(logout())
        return
      }
      dispatch(login())
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <>
      <Header />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        {products.map((product: Product) => (
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
                    // check login

                    addToBasket(product.id)
                      .then((data) => {
                        console.log('Fetched data:', data)
                        dispatch(addToCart(product))
                        toast({
                          title: 'Added to cart',
                          description: `${product.name} was added to your cart`,
                        })
                      })
                      .catch((error) => {
                        console.error('Error:', error)
                        toast({
                          title: error,
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
