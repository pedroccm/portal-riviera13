'use client'

import { useState } from 'react'
import { useInfosByCategory } from '@/hooks/useSupabase'
import MobileHeader from '@/components/layout/MobileHeader'
import { INFO_CATEGORIES } from '@/types/database'
import { 
  Clock, Phone, MapPin, Waves, Anchor, Coffee, Mountain, Home,
  Building2, ShoppingCart, Utensils, Hotel, Stethoscope, Globe, Mail
} from 'lucide-react'

// Mapeamento de ícones e categorias - Paleta neutra e sóbria
const categoryConfig = {
  RIVIERA: {
    label: INFO_CATEGORIES.RIVIERA,
    icon: Waves,
    color: 'bg-slate-600',
    emoji: '🏖️'
  },
  HOSPITAIS: {
    label: INFO_CATEGORIES.HOSPITAIS,
    icon: Stethoscope,
    color: 'bg-slate-700',
    emoji: '🏥'
  },
  SUPERMERCADOS: {
    label: INFO_CATEGORIES.SUPERMERCADOS,
    icon: ShoppingCart,
    color: 'bg-gray-600',
    emoji: '🛒'
  },
  RESTAURANTES: {
    label: INFO_CATEGORIES.RESTAURANTES,
    icon: Utensils,
    color: 'bg-zinc-600',
    emoji: '🍽️'
  },
  HOTEIS: {
    label: INFO_CATEGORIES.HOTEIS,
    icon: Hotel,
    color: 'bg-stone-600',
    emoji: '🏨'
  }
}

export default function InformacoesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { infos, loading, error } = useInfosByCategory(selectedCategory || undefined)

  return (
    <main className="min-h-screen bg-surface pb-20">
      <MobileHeader title="Informações" />
      
      {/* Category Grid */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {Object.entries(categoryConfig).map(([key, config]) => {
            const Icon = config.icon
            const isSelected = selectedCategory === key
            
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(isSelected ? null : key)}
                className={`p-4 rounded-xl border transition-all ${
                  isSelected 
                    ? `${config.color} border-transparent text-white shadow-lg` 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    <Icon size={24} className={isSelected ? 'text-white' : 'text-gray-600'} />
                  </div>
                  <span className="text-sm font-medium">{config.label}</span>
                </div>
              </button>
            )
          })}
        </div>


        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Carregando informações...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">Erro: {error}</p>
          </div>
        )}

        {/* Infos List */}
        {!loading && !error && (
          <div className="space-y-6">
            {infos.map((info) => {
              const config = categoryConfig[info.category as keyof typeof categoryConfig]
              const IconComponent = config?.icon || MapPin
              const cardColor = config?.color || 'bg-gray-600' // Sempre usar cor do config, ignorar banco
              
              return (
                <div key={info.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Header */}
                  <div className={`p-6 text-white ${cardColor}`}>
                    <div className="mb-3">
                      <h2 className="text-xl font-bold text-white">{info.title}</h2>
                      <p className="text-white/90 text-sm mt-1">{info.description}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {/* Detailed Description */}
                    {info.detailed_description && (
                      <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">ℹ️ Informações Adicionais:</span> {info.detailed_description}
                        </p>
                      </div>
                    )}

                    {/* Contact */}
                    {info.phone && (
                      <div className="flex items-center gap-3">
                        <Phone size={18} className="text-gray-500" />
                        <span className="font-semibold text-gray-900">{info.phone}</span>
                      </div>
                    )}

                    {/* Location */}
                    {info.location && (
                      <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-gray-500 mt-0.5" />
                        <span className="text-gray-700">{info.location}</span>
                      </div>
                    )}

                    {/* Website */}
                    {info.website && (
                      <div className="flex items-center gap-3">
                        <Globe size={18} className="text-gray-500" />
                        <a href={info.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {info.website}
                        </a>
                      </div>
                    )}

                    {/* Email */}
                    {info.email && (
                      <div className="flex items-center gap-3">
                        <Mail size={18} className="text-gray-500" />
                        <a href={`mailto:${info.email}`} className="text-blue-600 hover:underline">
                          {info.email}
                        </a>
                      </div>
                    )}

                    {/* Hours */}
                    {info.hours && Object.keys(info.hours).length > 0 && (
                      <div className="flex items-start gap-3">
                        <Clock size={18} className="text-gray-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-2">Horários:</p>
                          <div className="space-y-1">
                            {Object.entries(info.hours).map(([dia, horario]) => (
                              <div key={dia} className="flex justify-between">
                                <span className="text-gray-700">{dia}:</span>
                                <span className="font-semibold text-gray-900">{horario}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Services */}
                    {info.services && info.services.length > 0 && (
                      <div>
                        <p className="font-semibold text-gray-900 mb-3">Serviços disponíveis:</p>
                        <div className="grid grid-cols-1 gap-2">
                          {info.services.map((servico, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${cardColor}`} />
                              <span className="text-gray-700 text-sm">{servico}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {info.observations && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">📝 Observações:</span> {info.observations}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Empty State */}
            {infos.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {selectedCategory 
                    ? `Nenhuma informação encontrada para ${categoryConfig[selectedCategory as keyof typeof categoryConfig]?.label}`
                    : 'Nenhuma informação disponível'
                  }
                </p>
              </div>
            )}

            {/* Footer Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <p className="text-gray-700 text-sm">
                💡 <span className="font-semibold">Dica:</span> Para mais informações ou dúvidas, entre em contato diretamente com cada estabelecimento pelos telefones listados acima.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}