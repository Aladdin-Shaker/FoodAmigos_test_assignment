
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Order, Product, SignUpFormValues, SigninFormValues } from "./interfaces"
import { toast } from "@/components/ui/use-toast"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const onLogin = async (values: SigninFormValues): Promise<boolean> => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      toast({
        title: 'Error',
        description: `${data.message}`,
      })

      return false;
    }

    // set local
    localStorage.setItem('authToken', data.token)
    return true;

  } catch (error) {
    console.error('Error fetching data:', error)
    return false;
  }
}

export const onSignup = async (values: SignUpFormValues): Promise<boolean> => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
        phone_number: values.phone_number,
        shipping_address: values.shipping_address,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      toast({
        title: 'Error',
        description: `${data.message}`,
      })

      return false;
    }

    // set local
    localStorage.setItem('authToken', data.token)

    return true;
  } catch (error) {
    console.error('Error fetching data:', error)
    return false;
  }
}


export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/products')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data;
  } catch (error) {
    console.error('Error fetching products:', error)
    return Promise.reject(error);
  }
}

export const fetchOrders = async (): Promise<Order[]> => {
  const token = localStorage.getItem('authToken')
  if (!token) return [];

  try {
    const response = await fetch('http://127.0.0.1:8000/api/orders', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data.data;
  } catch (error) {
    console.error('Error fetching orders:', error)
    return Promise.reject(error);
  }
}

export const fetchOrder = async (id: string): Promise<Order | null> => {
  const token = localStorage.getItem('authToken')
  if (!token) return null;

  try {
    const response = await fetch('http://127.0.0.1:8000/api/orders/' + id, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()

    console.log("data => ", data);

    return data;
  } catch (error) {
    console.error('Error fetching orders:', error)
    return Promise.reject(error);
  }
}

export const fetchBasket = async (): Promise<Product[]> => {
  const token = localStorage.getItem('authToken')
  if (!token) return [];

  try {
    const response = await fetch('http://127.0.0.1:8000/api/basket', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      localStorage.removeItem('authToken')
    }
    const data = await response.json()

    localStorage.setItem('total_price', data.total_price.toFixed(2))

    return data.items;

  } catch (error) {
    console.error('Error fetching basket:', error)
    throw new Error(`${error}`)
  }
}

export const checkToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      return false
    }
    return true
  } catch (error) {
    console.error('Error checking token:', error)
    return false

  }
}

export const addToBasket = async (productId: number) => {
  try {
    const token = localStorage.getItem('authToken')
    if (!token) return false;

    const response = await fetch(
      `http://127.0.0.1:8000/api/basket/add/${productId}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: 1 }),
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
    fetchBasket();
    return data
  } catch (error) {
    console.error('Error adding to basket:', error)
    throw error
  }
}


export const doLogout = async (): Promise<boolean> => {
  const token = localStorage.getItem('authToken')

  if (!token) {
    return false
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
      localStorage.removeItem('authToken')
      return true
    }

    return true;


    // set local
  } catch (error) {
    console.error('Error fetching data:', error)
    return false;
  }
}

export async function removeFromBasket(product: Product) {
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
    fetchBasket()
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}



export async function checkout(note: string) {
  const token = localStorage.getItem('authToken')

  if (!token) {
    return;
  }
  try {
    const response = await fetch(
      'http://127.0.0.1:8000/api/order',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          note: note,
        }),
      },
    )

    const data = await response.json()


    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('Bad Request (400)')
      } else {
        throw new Error(`${data.message}`)
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    throw new Error(`${error}`)
  }
}


