import { Header } from '@/components/header'
import { useParams } from 'react-router-dom'

import { useToast } from '@/components/ui/use-toast'
import { Order } from '@/libs/interfaces'
import { fetchOrder } from '@/libs/utils'
import { useEffect, useState } from 'react'

export const OrderPage = () => {
  const [order, setOrder] = useState<Order | null>(null)
  const { toast } = useToast()
  const { id } = useParams()

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken')
    if (storedToken && id != undefined) {
      fetchOrder(id)
        .then((result) => {
          console.log('result => ', result)
          if (result) {
            setOrder(result)
          }
        })
        .catch((e) => {
          toast({
            title: 'Order',
            description: `${e}`,
          })
        })
    }
  }, [])

  if (order == null) {
    return
  }

  return (
    <>
      <Header />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        <div key={order!.id} className="border p-4 shadow-md">
          <div className="p-2">
            <h2 className="font-medium mb-2 line-clamp-1">
              {order!.shipping_address}
            </h2>
            <div className="flex items-center justify-between mt-4">
              <p>€{order!.total_price}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p>Note: {order!.note}</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p>user email: {order!.user.email}</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p> user phone number:{order!.user.phone_number}</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p>{new Date(order!.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      {order!.order_items.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4"
        >
          <div className="border p-4 shadow-md">
            <div className="h-54 w-full overflow-hidden">
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-full object-cover"
              />
            </div>
            <div className="p-2">
              <h2 className="font-medium mb-2 line-clamp-1">
                {item.product.name}
              </h2>
              <p className="line-clamp-3">{item.product.description}</p>
              <div className="flex items-center justify-between mt-4">
                <p>€{item.product.price}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
