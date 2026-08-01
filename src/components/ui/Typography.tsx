import React from 'react'
import { twMerge } from 'tailwind-merge'

interface TypographyProps {
  children: React.ReactNode
  className?: string
  id?: string
}

const H1: React.FC<TypographyProps> = ({ children, className, id }) => (
  <h1 id={id} className={twMerge('text-4xl font-extrabold text-white md:text-5xl lg:text-6xl', className)}>
    {children}
  </h1>
)

const H2: React.FC<TypographyProps> = ({ children, className, id }) => (
  <h2 id={id} className={twMerge('text-3xl font-bold text-white md:text-4xl', className)}>
    {children}
  </h2>
)

const H3: React.FC<TypographyProps> = ({ children, className, id }) => (
  <h3 id={id} className={twMerge('text-2xl font-semibold text-white md:text-3xl', className)}>
    {children}
  </h3>
)

const P: React.FC<TypographyProps> = ({ children, className, id }) => (
  <p id={id} className={twMerge('text-base text-gray-300 md:text-lg', className)}>
    {children}
  </p>
)

export const T = {
  H1,
  H2,
  H3,
  P,
}
