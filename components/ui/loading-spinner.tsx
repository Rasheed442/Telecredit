import React from 'react'

interface LoadingSpinnerProps {
  height?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const ComponentLoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  height = 'h-32', 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`flex items-center justify-center ${height} ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}></div>
    </div>
  )
}

export default ComponentLoadingSpinner
