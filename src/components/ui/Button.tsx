'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  disabled, 
  ...props 
}: ButtonProps) {
  
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'btn-primary', // defined in globals.css
    secondary: 'btn-secondary', // defined in globals.css
    ghost: 'bg-transparent hover:bg-white/10 text-gray-700 dark:text-white/80 hover:text-black dark:hover:text-white',
    outline: 'border border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-transparent text-gray-700 dark:text-gray-300',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base', // specific overrides might be needed if utilities don't win
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
      {children}
    </button>
  );
}
