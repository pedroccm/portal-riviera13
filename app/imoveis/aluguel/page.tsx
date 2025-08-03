'use client'

import { useProperties } from '@/hooks/useSupabase'
import MobileHeader from '@/components/layout/MobileHeader'
import { PROPERTY_TYPES } from '@/types/database'
import Link from 'next/link'

export default function AluguelPage() {
  const { properties, loading, error } = useProperties()
  const aluguelProperties = properties.filter(item => item.type === 'RENT')

  return (
    <main className="min-h-screen bg-surface">
      <MobileHeader title="Aluguel" showBack />
      
      <div className="px-4 py-6">
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Carregando imóveis...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">Erro: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-4">

            {aluguelProperties.map(item => (
              <Link key={item.id} href={`/imoveis/${item.id}`} className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600">
                        🛏️ {item.bedrooms}q
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600">
                        🚿 {item.bathrooms}b
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-dark font-bold text-lg">
                        R$ {item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {item.images?.[0] && (
                    <div className="w-24 h-24 bg-gray-200 rounded-lg ml-3 overflow-hidden">
                      <img 
                        src={item.images[0]} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </Link>
            ))}

            {aluguelProperties.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum imóvel para aluguel encontrado</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}