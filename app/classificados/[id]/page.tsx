'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Classified, CLASSIFIED_CATEGORIES } from '@/types/database'
import MobileHeader from '@/components/layout/MobileHeader'
import { Phone, MessageCircle, MapPin, Calendar, Share2, Heart } from 'lucide-react'

export default function ClassifiedDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [classified, setClassified] = useState<Classified | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (params.id) {
      fetchClassified(params.id as string)
    }
  }, [params.id])

  const fetchClassified = async (id: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('classifieds')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setClassified(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar classificado')
    } finally {
      setLoading(false)
    }
  }


  const handleWhatsApp = () => {
    if (classified?.contact_phone) {
      const phone = classified.contact_phone.replace(/\D/g, '')
      const message = `Olá! Vi seu anúncio "${classified.title}" no Portal Riviera 13 e tenho interesse.`
      window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank')
    }
  }

  const handleCall = () => {
    if (classified?.contact_phone) {
      window.open(`tel:${classified.contact_phone}`, '_self')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-surface">
        <MobileHeader title="Carregando..." showBack />
        <div className="flex items-center justify-center h-64">
          <p className="text-dark-600">Carregando classificado...</p>
        </div>
      </main>
    )
  }

  if (error || !classified) {
    return (
      <main className="min-h-screen bg-surface">
        <MobileHeader title="Erro" showBack />
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{error || 'Classificado não encontrado'}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface pb-20">
      <MobileHeader 
        title={classified.title} 
        showBack 
      />

      {/* Images Gallery */}
      {classified.images && classified.images.length > 0 && (
        <div className="relative">
          <div className="h-64 bg-gray-200 overflow-hidden">
            <img 
              src={classified.images[currentImageIndex]} 
              alt={classified.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log('Erro ao carregar imagem:', classified.images[currentImageIndex])
                e.currentTarget.src = 'https://via.placeholder.com/800x600/e5e7eb/9ca3af?text=Imagem+Indisponível'
              }}
              onLoad={() => {
                console.log('Imagem carregada com sucesso:', classified.images[currentImageIndex])
              }}
            />
          </div>
          
          {classified.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {classified.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

        </div>
      )}

      <div className="px-4 py-6 space-y-6">
        {/* Main Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-secondary text-white px-3 py-2 rounded-full text-sm font-bold">
              {CLASSIFIED_CATEGORIES[classified.category]}
            </span>
            {classified.price && (
              <span className="text-secondary font-bold text-2xl">
                R$ {classified.price.toLocaleString()}
              </span>
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-dark mb-4">
            {classified.title}
          </h1>
          
          <p className="text-dark-600 leading-relaxed mb-6">
            {classified.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-dark-600">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>
                {new Date(classified.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
            {(classified.apartment || classified.block) && (
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>
                  {classified.apartment && `Apt ${classified.apartment}`}
                  {classified.apartment && classified.block && ' • '}
                  {classified.block}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary-200 to-secondary-300 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-secondary-700">
                {classified.contact_name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-dark text-lg">
                {classified.contact_name}
              </h3>
              {classified.contact_phone && (
                <p className="text-dark-600">
                  {classified.contact_phone}
                </p>
              )}
            </div>
          </div>

          {classified.contact_phone && (
            <div className="flex gap-3">
              <button
                onClick={handleWhatsApp}
                className="flex-1 bg-green-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
              >
                <MessageCircle size={20} />
                WhatsApp
              </button>
              
              <button
                onClick={handleCall}
                className="flex-1 bg-primary text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors"
              >
                <Phone size={20} />
                Ligar
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}