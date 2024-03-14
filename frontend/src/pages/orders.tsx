import { Header } from '@/components/header'
import { Order } from '@/libs/interfaces'
import { fetchOrders } from '@/libs/utils'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken')
    if (storedToken) {
      fetchOrders().then((result) => setOrders(result))
    }
  }, [])

  return (
    <>
      <Header />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        {orders.map((order) => (
          <div key={order.id} className="border p-4 shadow-md">
            <Link to={`/orders/${order.id}`}>
              <div className="p-2">
                <h2 className="font-medium mb-2 line-clamp-1">
                  {order.shipping_address}
                </h2>
                <div className="flex items-center justify-between mt-4">
                  <p>€{order.total_price}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}
