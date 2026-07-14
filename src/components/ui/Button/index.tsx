import Link from 'next/link'
import React from 'react'

interface ButtonProps {
  href: string
  children: React.ReactNode
}

export const Button = ({ href, children }: ButtonProps) => {
  return (
    <Link
      href={href}
      className="rounded-full bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
    >
      {children}
    </Link>
  )
}