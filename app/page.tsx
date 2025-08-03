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
        padding: '48px 16px 24px 16px', 
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '24px' 
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
            <p style={{ 
              color: '#6b7280', 
              fontSize: '14px', 
              marginTop: '4px',
              margin: 0 
            }}>
              ✨ Seu condomínio conectado
            </p>
          </div>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            backgroundColor: '#606c38',
            borderRadius: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
          }}>
            <Home color="white" size={24} />
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
        {/* Categorias Premium */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explorar Categorias</h2>
          
          <div className="grid grid-cols-2 gap-5">
            <Link href="/classificados" className="group">
              <div className="bg-secondary-50 rounded-3xl p-6 border border-secondary-200 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-secondary rounded-3xl flex items-center justify-center shadow-xl">
                    <TrendingUp className="text-white" size={30} />
                  </div>
                  <span className="bg-secondary text-white text-sm px-3 py-2 rounded-full font-bold shadow-lg">
                    {loadingClassifieds ? '...' : classifieds.length}
                  </span>
                </div>
                <h3 className="font-bold text-dark text-xl mb-2">Classificados</h3>
                <p className="text-dark-600 text-sm">Produtos e serviços</p>
              </div>
            </Link>

            <Link href="/imoveis" className="group">
              <div className="bg-primary-50 rounded-3xl p-6 border border-primary-200 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center shadow-xl">
                    <Home className="text-white" size={30} />
                  </div>
                  <span className="bg-primary text-white text-sm px-3 py-2 rounded-full font-bold shadow-lg">
                    {loadingProperties ? '...' : properties.length}
                  </span>
                </div>
                <h3 className="font-bold text-dark text-xl mb-2">Imóveis</h3>
                <p className="text-dark-600 text-sm">Locação e venda</p>
              </div>
            </Link>

            <Link href="/eventos" className="group">
              <div className="bg-accent-50 rounded-3xl p-6 border border-accent-200 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-accent rounded-3xl flex items-center justify-center shadow-xl">
                    <Calendar className="text-white" size={30} />
                  </div>
                  <span className="bg-accent text-white text-sm px-3 py-2 rounded-full font-bold shadow-lg">
                    {loadingEvents ? '...' : events.length}
                  </span>
                </div>
                <h3 className="font-bold text-dark text-xl mb-2">Eventos</h3>
                <p className="text-dark-600 text-sm">Próximos eventos</p>
              </div>
            </Link>

            <div className="bg-dark-50 rounded-3xl p-6 border border-dark-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-dark rounded-3xl flex items-center justify-center shadow-xl">
                  <Star className="text-white" size={30} />
                </div>
                <span className="bg-dark text-white text-sm px-3 py-2 rounded-full font-bold shadow-lg">
                  +
                </span>
              </div>
              <h3 className="font-bold text-dark text-xl mb-2">Informações</h3>
              <p className="text-dark-600 text-sm">Dados gerais</p>
            </div>
          </div>
        </div>

        {/* Destaques Premium */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-dark">✨ Destaques</h2>
            <Link href="/classificados" className="bg-secondary text-white px-4 py-2 rounded-full font-semibold hover:shadow-lg transition-all">
              Ver todos →
            </Link>
          </div>
          
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
            {classifieds.slice(0, 5).map(item => (
              <div key={item.id} className="flex-shrink-0 w-80 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300">
                {item.images?.[0] && (
                  <div className="h-48 bg-gray-100 overflow-hidden relative">
                    <img 
                      src={item.images[0]} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all">
                      <Heart size={18} className="text-gray-600" />
                    </button>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-700">
                          {item.contact_name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-dark text-sm font-semibold">
                        {item.contact_name}
                      </span>
                    </div>
                    {item.apartment && (
                      <span className="text-gray-500 text-xs bg-gray-100 px-3 py-1 rounded-full font-medium">
                        Apt {item.apartment}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Imóveis Premium */}
        {properties.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-dark">🏠 Imóveis Premium</h2>
              <Link href="/imoveis" className="bg-primary text-white px-4 py-2 rounded-full font-semibold hover:shadow-lg transition-all">
                Ver todos →
              </Link>
            </div>
            
            <div className="space-y-5">
              {properties.slice(0, 3).map(item => (
                <div key={item.id} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="flex">
                    {item.images?.[0] && (
                      <div className="w-44 h-40 bg-gray-100 flex-shrink-0 relative overflow-hidden">
                        <img 
                          src={item.images[0]} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:scale-110 transition-all">
                          <Heart size={16} className="text-gray-600" />
                        </button>
                      </div>
                    )}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <span className="bg-primary text-white text-xs px-3 py-2 rounded-full font-bold">
                          {PROPERTY_TYPES[item.type]}
                        </span>
                        <div className="text-right">
                          <span className="text-primary font-bold text-2xl">
                            R$ {item.price.toLocaleString()}
                          </span>
                          {item.type === 'RENT' && (
                            <span className="text-gray-500 text-sm">/mês</span>
                          )}
                        </div>
                      </div>
                      <h3 className="font-bold text-dark text-xl mb-2 line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                            🛏️ {item.bedrooms}
                          </span>
                          <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                            🚿 {item.bathrooms}
                          </span>
                          {item.area && (
                            <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                              📐 {item.area}m²
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gray-400" />
                          <span className="text-dark text-sm font-semibold">
                            {item.contact_name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}