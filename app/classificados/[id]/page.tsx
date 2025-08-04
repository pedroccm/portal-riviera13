'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Classified, CLASSIFIED_CATEGORIES } from '@/types/database'
import MobileHeader from '@/components/layout/MobileHeader'
import { Phone, MessageCircle, MapPin, Calendar, Share2, Heart, Instagram } from 'lucide-react'

export default function ClassifiedDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [classified, setClassified] = useState<Classified | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

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

  const handleInstagram = () => {
    if (classified?.instagram) {
      let instagramUrl = classified.instagram
      
      // Se não começar com http, assumir que é um handle
      if (!instagramUrl.startsWith('http')) {
        // Remover @ se existir
        const handle = instagramUrl.startsWith('@') ? instagramUrl.slice(1) : instagramUrl
        instagramUrl = `https://instagram.com/${handle}`
      }
      
      window.open(instagramUrl, '_blank')
    }
  }

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50
    
    if (classified && classified.images && classified.images.length > 1) {
      if (isLeftSwipe && currentImageIndex < classified.images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1)
      }
      if (isRightSwipe && currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1)
      }
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
          <div 
            className="h-64 bg-gray-200 overflow-hidden cursor-pointer"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img 
              src={classified.images[currentImageIndex]} 
              alt={classified.title}
              className="w-full h-full object-cover select-none"
              onError={(e) => {
                console.log('Erro ao carregar imagem:', classified.images[currentImageIndex])
                e.currentTarget.src = 'https://via.placeholder.com/800x600/e5e7eb/9ca3af?text=Imagem+Indisponível'
              }}
              onLoad={() => {
                console.log('Imagem carregada com sucesso:', classified.images[currentImageIndex])
              }}
              draggable={false}
            />
          </div>
          
          {classified.images.length > 1 && (
            <>
              {/* Navigation arrows */}
              <button
                onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all ${
                  currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={currentImageIndex === 0}
              >
                ‹
              </button>
              <button
                onClick={() => setCurrentImageIndex(Math.min(classified.images.length - 1, currentImageIndex + 1))}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all ${
                  currentImageIndex === classified.images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={currentImageIndex === classified.images.length - 1}
              >
                ›
              </button>
              
              {/* Image counter */}
              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {classified.images.length}
              </div>
              
              {/* Dots indicator */}
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
            </>
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
              {classified.instagram && (
                <p className="text-purple-600 text-sm">
                  {classified.instagram.startsWith('@') ? classified.instagram : `@${classified.instagram}`}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
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
            
            {classified.instagram && (
              <button
                onClick={handleInstagram}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
              >
                <Instagram size={20} />
                {classified.instagram.startsWith('@') ? classified.instagram : `@${classified.instagram}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}