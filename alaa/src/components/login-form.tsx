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
import { login } from '@/store/app'

type SigninFormValues = {
  email: string
  password: string
}

export const SigninForm = () => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const dispatch = useAppDispatch()

  const form = useForm<SigninFormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (values: SigninFormValues) => {
    console.log(values)
    dispatch(login())
  }

  return (
    <AlertDialog open>
      <AlertDialogHeader>Login</AlertDialogHeader>
      <AlertDialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <InputField
              control={form.control}
              className="col-span-2"
              name="email"
              placeholder="Enter your email"
              type="text"
              label="Email Address"
            />
            <InputField
              control={form.control}
              className="col-span-2"
              name="password"
              placeholder="Enter your password"
              type="password"
              label="Password"
            />

            <Button className="w-full mt-4">Login</Button>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
