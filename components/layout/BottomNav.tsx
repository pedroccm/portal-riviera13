'use client'

import { Home, TrendingUp, Building, Calendar, Info } from 'lucide-react'
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
  },
  { 
    icon: Info, 
    label: 'Infos', 
    href: '/informacoes',
    activeColor: 'text-dark',
    bgColor: 'bg-dark'
  }
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 px-2 py-1 z-50">
      <div className="flex justify-around items-center w-full">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-center py-2 px-1 transition-all duration-300 relative flex-1"
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${
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
            </Link>
          )
        })}
      </div>
    </nav>
  )
}