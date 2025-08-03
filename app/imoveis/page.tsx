'use client'

import Link from 'next/link'
import { useProperties } from '@/hooks/useSupabase'
import MobileHeader from '@/components/layout/MobileHeader'
import { Building, Home, Key } from 'lucide-react'

export default function ImoveisPage() {
  const { properties, loading } = useProperties()
  
  const vendaCount = properties.filter(p => p.type === 'SALE').length
  const aluguelCount = properties.filter(p => p.type === 'RENT').length

  return (
    <main className="min-h-screen bg-surface">
      <MobileHeader title="Imóveis" />
      
      <div className="px-4 py-6">
        <div className="space-y-4">
          {/* Categorias */}
          <div className="grid grid-cols-1 gap-4">
            <Link href="/imoveis/venda">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <Home className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark">Venda</h3>
                      <p className="text-sm text-dark-600">
                        {loading ? '...' : `${vendaCount} imóveis`}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    →
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/imoveis/aluguel">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-dark-100 rounded-xl flex items-center justify-center">
                      <Key className="w-6 h-6 text-dark" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark">Aluguel</h3>
                      <p className="text-sm text-dark-600">
                        {loading ? '...' : `${aluguelCount} imóveis`}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    →
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Resumo Total */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-dark-600 text-center">
              {loading ? 'Carregando...' : `Total: ${properties.length} imóveis disponíveis`}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}