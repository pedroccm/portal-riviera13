'use client'

import { useClassifieds, useProperties, useEvents } from '@/hooks/useSupabase'
import Link from 'next/link'
import { Search, TrendingUp, Home, Calendar, Star, Heart, Phone } from 'lucide-react'
import { CLASSIFIED_CATEGORIES, PROPERTY_TYPES } from '@/types/database'

export default function HomePage() {
  const { classifieds, loading: loadingClassifieds } = useClassifieds()
  const { properties, loading: loadingProperties } = useProperties()
  const { events, loading: loadingEvents } = useEvents()

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '16px 16px 8px 16px', 
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '16px' 
        }}>
          <div>
            <h1 style={{ 
              fontSize: '30px', 
              fontWeight: 'bold', 
              color: '#283618',
              margin: 0 
            }}>
              Portal Riviera 13
            </h1>
          </div>
        </div>
        
        {/* Busca */}
        <div style={{ position: 'relative' }}>
          <Search 
            style={{ 
              position: 'absolute', 
              left: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#9ca3af' 
            }} 
            size={20} 
          />
          <input 
            type="text" 
            placeholder="Buscar classificados, imóveis, eventos..." 
            style={{
              width: '100%',
              paddingLeft: '48px',
              paddingRight: '16px',
              paddingTop: '16px',
              paddingBottom: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '24px',
              border: 'none',
              outline: 'none',
              color: '#374151',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      <div style={{ padding: '32px 16px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Categorias */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/classificados" className="group">
            <div className="bg-secondary-50 rounded-2xl p-4 border border-secondary-200 group-hover:shadow-lg group-hover:border-secondary-300 transition-all duration-200 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center">
                  <TrendingUp className="text-white" size={20} />
                </div>
              </div>
              <h3 className="font-medium text-gray-700 text-sm">Classificados</h3>
            </div>
          </Link>

          <Link href="/imoveis" className="group">
            <div className="bg-primary-50 rounded-2xl p-4 border border-primary-200 group-hover:shadow-lg group-hover:border-primary-300 transition-all duration-200 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                  <Home className="text-white" size={20} />
                </div>
              </div>
              <h3 className="font-medium text-gray-700 text-sm">Imóveis</h3>
            </div>
          </Link>

          <Link href="/eventos" className="group">
            <div className="bg-accent-50 rounded-2xl p-4 border border-accent-200 group-hover:shadow-lg group-hover:border-accent-300 transition-all duration-200 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center">
                  <Calendar className="text-white" size={20} />
                </div>
              </div>
              <h3 className="font-medium text-gray-700 text-sm">Eventos</h3>
            </div>
          </Link>

          <Link href="/informacoes" className="group">
            <div className="bg-dark-50 rounded-2xl p-4 border border-dark-200 group-hover:shadow-lg group-hover:border-dark-300 transition-all duration-200 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-dark rounded-2xl flex items-center justify-center">
                  <Star className="text-white" size={20} />
                </div>
              </div>
              <h3 className="font-medium text-gray-700 text-sm">Informações</h3>
            </div>
          </Link>
        </div>

        {/* Destaques Premium */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-dark">Destaques</h2>
            <Link href="/classificados" className="bg-secondary text-white px-3 py-1.5 rounded-full text-sm font-medium hover:shadow-md transition-all">
              Ver todos →
            </Link>
          </div>
          
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" style={{scrollBehavior: 'smooth'}}>
            {classifieds.slice(0, 5).map(item => (
              <Link key={item.id} href={`/classificados/${item.id}`} className="flex-shrink-0 w-80 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 snap-center">
                {item.images?.[0] && (
                  <div className="h-48 bg-gray-100 overflow-hidden relative">
                    <img 
                      src={item.images[0]} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log('Erro ao carregar imagem:', item.images[0])
                        e.currentTarget.src = 'https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Sem+Imagem'
                      }}
                      onLoad={() => {
                        console.log('Imagem carregada com sucesso:', item.images[0])
                      }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-secondary text-white text-xs px-3 py-2 rounded-full font-bold">
                      {CLASSIFIED_CATEGORIES[item.category]}
                    </span>
                    {item.price && (
                      <span className="text-secondary font-bold text-lg">
                        R$ {item.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-dark text-lg mb-2 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Imóveis Premium */}
        {properties.filter(item => item.type === 'RENT' && item.property_subtype === 'HOUSE').length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-dark">Locações</h2>
              <Link href="/imoveis/aluguel" className="bg-primary text-white px-3 py-1.5 rounded-full text-sm font-medium hover:shadow-md transition-all">
                Ver todos →
              </Link>
            </div>
            
            <div className="space-y-5">
              {properties.filter(item => item.type === 'RENT' && item.property_subtype === 'HOUSE').slice(0, 3).map(item => (
                <Link key={item.id} href={`/imoveis/${item.id}`} className="block bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                  {/* Título no topo */}
                  <div className="p-6 pb-4">
                    <h3 className="font-bold text-dark text-xl mb-1 line-clamp-1">
                      {item.title}
                    </h3>
                    <span className="text-primary font-bold text-lg">
                      R$ {item.price.toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Conteúdo */}
                  <div className="flex">
                    {item.images?.[0] && (
                      <div className="w-44 h-40 bg-gray-100 flex-shrink-0 relative overflow-hidden">
                        <img 
                          src={item.images[0]} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log('Erro ao carregar imagem:', item.images[0])
                            e.currentTarget.src = 'https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Sem+Imagem'
                          }}
                          onLoad={() => {
                            console.log('Imagem carregada com sucesso:', item.images[0])
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1 p-6 pt-4">
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs">
                          🛏️ {item.bedrooms}
                        </span>
                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs">
                          🚿 {item.bathrooms}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}