'use client'

import { useProperties } from '@/hooks/useSupabase'
import MobileHeader from '@/components/layout/MobileHeader'
import { PROPERTY_TYPES } from '@/types/database'

export default function VendaPage() {
  const { properties, loading, error } = useProperties()
  const vendaProperties = properties.filter(item => item.type === 'SALE')

  return (
    <main className="min-h-screen bg-surface">
      <MobileHeader title="Venda" showBack />
      
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
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-gray-600 text-center">
                {vendaProperties.length} imóveis à venda
              </p>
            </div>

            {vendaProperties.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
                        {PROPERTY_TYPES[item.type]}
                      </span>
                      <span className="text-xs text-gray-500">
                        {item.bedrooms}q • {item.bathrooms}b
                        {item.area && ` • ${item.area}m²`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold text-lg">
                        R$ {item.price.toLocaleString()}
                      </span>
                      <div className="text-xs text-gray-500 text-right">
                        {item.contact_name}
                        {item.apartment && <div>Apt {item.apartment}</div>}
                        {item.block && <div>{item.block}</div>}
                      </div>
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
              </div>
            ))}

            {vendaProperties.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum imóvel à venda encontrado</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}