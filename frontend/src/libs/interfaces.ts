
export interface Product {
  id: number
  name: string
  price: number
  description: string
  imageUrl: string
  quantity: number,
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  product: Product,
}

export interface Order {
  id: number
  note: string,
  shipping_address: string,
  created_at: string,
  basket_id: number,
  user_id: number,
  total_price: number,
  user: User,
  order_items: OrderItem[]

}

export interface User {
  id: number,
  email: string,
  phone_number: string,
}


export type SigninFormValues = {
  email: string
  password: string
}

export type SignUpFormValues = {
  email: string
  password: string
  phone_number: string
  shipping_address: string
}