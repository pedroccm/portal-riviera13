'use client'

import { useState } from 'react'
import { useClassifieds } from '@/hooks/useSupabase'
import MobileHeader from '@/components/layout/MobileHeader'
import { CLASSIFIED_CATEGORIES } from '@/types/database'
import { Utensils, Zap, Waves, Package, Wind, TreePine, Car } from 'lucide-react'

const categoryIcons = {
  IFOOD: Utensils,
  ELETRICA: Zap,
  PISCINA: Waves,
  GERAL: Package,
  AR_CONDICIONADO: Wind,
  JARDIM: TreePine,
  JET_QUADRI: Car
}

const categoryColors = {
  IFOOD: { bg: 'bg-secondary-100', text: 'text-secondary', icon: 'text-secondary' },
  ELETRICA: { bg: 'bg-accent-100', text: 'text-accent', icon: 'text-accent' },
  PISCINA: { bg: 'bg-primary-100', text: 'text-primary', icon: 'text-primary' },
  GERAL: { bg: 'bg-dark-100', text: 'text-dark', icon: 'text-dark' },
  AR_CONDICIONADO: { bg: 'bg-secondary-100', text: 'text-secondary', icon: 'text-secondary' },
  JARDIM: { bg: 'bg-primary-100', text: 'text-primary', icon: 'text-primary' },
  JET_QUADRI: { bg: 'bg-accent-100', text: 'text-accent', icon: 'text-accent' }
}

export default function ClassificadosPage() {
  const { classifieds, loading, error } = useClassifieds()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredClassifieds = selectedCategory 
    ? classifieds.filter(item => item.category === selectedCategory)
    : classifieds

  const getCategoryCount = (category: string) => {
    return classifieds.filter(item => item.category === category).length
  }

  return (
    <main className="min-h-screen bg-surface">
      <MobileHeader title="Classificados" />
      
      <div className="px-4 py-6">
        <div className="space-y-6">
          {/* Filtros por categoria */}
          <div>
            <h2 className="text-lg font-semibold text-dark mb-4">Categorias</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`p-4 rounded-xl border transition-all ${
                  selectedCategory === null 
                    ? 'bg-dark text-white border-dark' 
                    : 'bg-white border-gray-200 hover:border-dark-200'
                }`}
              >
                <div className="text-center">
                  <Package className={`w-6 h-6 mx-auto mb-2 ${selectedCategory === null ? 'text-white' : 'text-dark'}`} />
                  <p className="text-sm font-medium">Todos</p>
                  <p className="text-xs opacity-75">{classifieds.length}</p>
                </div>
              </button>

              {Object.entries(CLASSIFIED_CATEGORIES).map(([key, label]) => {
                const Icon = categoryIcons[key as keyof typeof categoryIcons]
                const colors = categoryColors[key as keyof typeof categoryColors]
                const count = getCategoryCount(key)
                const isSelected = selectedCategory === key

                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`p-4 rounded-xl border transition-all ${
                      isSelected 
                        ? `${colors.bg} border-transparent` 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? colors.icon : 'text-gray-400'}`} />
                      <p className={`text-sm font-medium ${isSelected ? colors.text : 'text-gray-700'}`}>
                        {label}
                      </p>
                      <p className={`text-xs ${isSelected ? colors.text : 'text-gray-500'} opacity-75`}>
                        {count}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Lista de resultados */}
          {loading && (
            <div className="text-center py-8">
              <p className="text-dark-600">Carregando classificados...</p>
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
                <p className="text-dark-600 text-center">
                  {filteredClassifieds.length} classificados 
                  {selectedCategory ? ` em ${CLASSIFIED_CATEGORIES[selectedCategory]}` : ' encontrados'}
                </p>
              </div>

              {filteredClassifieds.map(item => {
                const colors = categoryColors[item.category as keyof typeof categoryColors]
                return (
                  <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-dark mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-dark-600 mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`${colors.bg} ${colors.text} px-2 py-1 rounded-full text-xs font-medium`}>
                            {CLASSIFIED_CATEGORIES[item.category]}
                          </span>
                          {item.price && (
                            <span className={`${colors.text} font-semibold`}>
                              R$ {item.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-dark-600">
                          {item.contact_name}
                          {item.apartment && ` • Apt ${item.apartment}`}
                          {item.block && ` • ${item.block}`}
                        </div>
                      </div>
                      {item.images?.[0] && (
                        <div className="w-20 h-20 bg-gray-200 rounded-lg ml-3 overflow-hidden">
                          <img 
                            src={item.images[0]} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {filteredClassifieds.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-dark-600">
                    Nenhum classificado encontrado
                    {selectedCategory && ` na categoria ${CLASSIFIED_CATEGORIES[selectedCategory]}`}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}