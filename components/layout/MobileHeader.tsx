'use client'

import { ArrowLeft, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface MobileHeaderProps {
  title: string
  showBack?: boolean
  rightAction?: React.ReactNode
  className?: string
}

export default function MobileHeader({ 
  title, 
  showBack = false, 
  rightAction,
  className = ''
}: MobileHeaderProps) {
  const router = useRouter()

  return (
    <header className={`bg-white border-b border-gray-200 px-4 py-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="mr-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-dark" />
            </button>
          )}
          <h1 className="text-lg font-semibold text-dark truncate">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center">
          {rightAction}
        </div>
      </div>
    </header>
  )
}