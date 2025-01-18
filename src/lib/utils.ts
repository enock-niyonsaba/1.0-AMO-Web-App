import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { toast } from 'react-hot-toast'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function showError(message: string) {
  toast.error(message, {
    style: {
      background: '#ef4444',
      color: '#fff',
    },
  })
}

export function showSuccess(message: string) {
  toast.success(message)
}

export const validatePassword = (password: string) => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const errors = []
  if (password.length < minLength) errors.push(`At least ${minLength} characters`)
  if (!hasUpperCase) errors.push('One uppercase letter')
  if (!hasLowerCase) errors.push('One lowercase letter')
  if (!hasNumbers) errors.push('One number')
  if (!hasSpecialChar) errors.push('One special character')

  return errors
}

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhoneNumber = (phone: string) => {
  const phoneRegex = /^\d{10}$/
  return phoneRegex.test(phone)
}