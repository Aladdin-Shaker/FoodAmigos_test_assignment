'use client'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { InputField } from './ui/input-field'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog'
import { useAppDispatch } from '@/store'
import { login, signup } from '@/store/app'
import { useState } from 'react'
import { useToast } from './ui/use-toast'

type SigninFormValues = {
  email: string
  password: string
}

type SignUpFormValues = {
  email: string
  password: string
  phone_number: string
  shipping_address: string
}

export const SigninForm = () => {
  const { toast } = useToast()

  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    // phone_number: z.string().nullable(),
    // shipping_address: z.string().nullable(),
  })

  const dispatch = useAppDispatch()

  const signInForm = useForm<SigninFormValues>({
    resolver: zodResolver(schema),
  })
  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(schema),
  })

  const onLogin = async (values: SigninFormValues) => {
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

        return
      }

      // set local
      localStorage.setItem('authToken', data.token)
      dispatch(login())
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const onSignup = async (values: SignUpFormValues) => {
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

        return
      }

      // set local
      localStorage.setItem('authToken', data.token)

      dispatch(signup())
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const [activeTab, setActiveTab] = useState(1)

  const handleTabClick = (tabNumber: number) => {
    setActiveTab(tabNumber)
  }

  return (
    <AlertDialog open>
      <AlertDialogHeader>Login</AlertDialogHeader>
      <AlertDialogContent>
        <Form {...signInForm}>
          <div className="tabs-container">
            <div className="tabs">
              <button
                className={activeTab === 1 ? 'tab active' : 'tab'}
                onClick={() => handleTabClick(1)}
              >
                Login
              </button>
              <button
                className={activeTab === 2 ? 'tab active' : 'tab'}
                onClick={() => handleTabClick(2)}
              >
                Signup
              </button>
            </div>
            <div className="tab-content">
              {activeTab === 1 && (
                <form onSubmit={signInForm.handleSubmit(onLogin)}>
                  <InputField
                    control={signInForm.control}
                    className="col-span-2"
                    name="email"
                    placeholder="Enter your email"
                    type="text"
                    label="Email Address"
                  />
                  <InputField
                    control={signInForm.control}
                    className="col-span-2"
                    name="password"
                    placeholder="Enter your password"
                    type="password"
                    label="Password"
                  />

                  <Button className="w-full mt-4">Login</Button>
                </form>
              )}
              {activeTab === 2 && (
                <form onSubmit={signUpForm.handleSubmit(onSignup)}>
                  <InputField
                    control={signUpForm.control}
                    className="col-span-2"
                    name="email"
                    placeholder="Enter your email"
                    type="text"
                    label="Email Address"
                  />
                  <InputField
                    control={signUpForm.control}
                    className="col-span-2"
                    name="password"
                    placeholder="Enter your password"
                    type="password"
                    label="Password"
                  />
                  <InputField
                    control={signUpForm.control}
                    className="col-span-2"
                    name="phone_number"
                    placeholder="Enter your phone number"
                    type="text"
                    label="Phone Number"
                  />
                  <InputField
                    control={signUpForm.control}
                    className="col-span-2"
                    name="shipping_address"
                    placeholder="Enter your shipping address"
                    type="text"
                    label="Shipping Address"
                  />

                  <Button className="w-full mt-4">Signup</Button>
                </form>
              )}
            </div>
          </div>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
