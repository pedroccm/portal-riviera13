'use client'

import { Home, TrendingUp, Building, Calendar } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { 
    icon: Home, 
    label: 'Início', 
    href: '/',
    activeColor: 'text-dark',
    bgColor: 'bg-dark'
  },
  { 
    icon: TrendingUp, 
    label: 'Classificados', 
    href: '/classificados',
    activeColor: 'text-secondary',
    bgColor: 'bg-secondary'
  },
  { 
    icon: Building, 
    label: 'Imóveis', 
    href: '/imoveis',
    activeColor: 'text-primary',
    bgColor: 'bg-primary'
  },
  { 
    icon: Calendar, 
    label: 'Eventos', 
    href: '/eventos',
    activeColor: 'text-accent',
    bgColor: 'bg-accent'
  }
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 px-6 py-3 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center py-2 px-3 transition-all duration-300 relative"
            >
              <div className={`p-2 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? `${item.bgColor} shadow-lg` 
                  : 'bg-gray-100'
              }`}>
                <Icon 
                  size={20} 
                  className={`${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-500'
                  }`}
                />
              </div>
              <span 
                className={`text-xs font-medium mt-1 transition-colors duration-300 ${
                  isActive 
                    ? item.activeColor 
                    : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className={`absolute -top-1 w-1 h-1 ${item.bgColor} rounded-full`} />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}