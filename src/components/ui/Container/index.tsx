import React from 'react'
import { cn } from '@/utilities/ui'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={cn('mx-auto w-full max-w-screen-2xl px-8', className)}>
      {children}
    </div>
  )
}