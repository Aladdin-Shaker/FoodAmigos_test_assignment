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
import { useState } from 'react'
import { SignUpFormValues, SigninFormValues } from '@/libs/interfaces'
import { fetchBasket, onLogin, onSignup } from '@/libs/utils'
import { login, signup } from '@/store/app'
import { useAppDispatch } from '@/store'

export const SigninForm = () => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const signInForm = useForm<SigninFormValues>({
    resolver: zodResolver(schema),
  })
  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(schema),
  })

  const dispatch = useAppDispatch()

  const [activeTab, setActiveTab] = useState(1)

  const handleTabClick = (tabNumber: number) => {
    setActiveTab(tabNumber)
  }

  async function _login(data: SigninFormValues) {
    const result: boolean = await onLogin(data)
    if (result) {
      dispatch(login())
      fetchBasket()
    }
  }

  async function _signup(data: SignUpFormValues) {
    const result: boolean = await onSignup(data)
    if (result) {
      dispatch(signup())
      fetchBasket()
    }
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
                <form onSubmit={signInForm.handleSubmit(_login)}>
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
                <form onSubmit={signUpForm.handleSubmit(_signup)}>
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
