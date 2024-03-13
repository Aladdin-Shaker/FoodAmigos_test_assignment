'use client'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Control } from 'react-hook-form'
import { z } from 'zod'

interface InputFieldProps {
  control: Control<z.infer<any>>
  className?: string
  name: string
  placeholder: string
  type: string
  label?: string | React.ReactNode
}

export const InputField: React.FC<InputFieldProps> = ({
  control,
  className,
  name,
  placeholder,
  type = 'text',
  label,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type}
              value={value || ''}
              onChange={onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
