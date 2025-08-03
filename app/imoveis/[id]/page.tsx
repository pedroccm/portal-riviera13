'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Property, PROPERTY_TYPES } from '@/types/database'
import MobileHeader from '@/components/layout/MobileHeader'
import { Phone, MessageCircle, MapPin, Calendar, Share2, Heart, Bed, Bath, Square } from 'lucide-react'

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id as string)
    }
  }, [params.id])

  const fetchProperty = async (id: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setProperty(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar imóvel')
    } finally {
      setLoading(false)
    }
  }


  const handleWhatsApp = () => {
    if (property?.contact_phone) {
      const phone = property.contact_phone.replace(/\D/g, '')
      const message = `Olá! Vi seu imóvel "${property.title}" no Portal Riviera 13 e tenho interesse.`
      window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank')
    }
  }

  const handleCall = () => {
    if (property?.contact_phone) {
      window.open(`tel:${property.contact_phone}`, '_self')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-surface">
        <MobileHeader title="Carregando..." showBack />
        <div className="flex items-center justify-center h-64">
          <p className="text-dark-600">Carregando imóvel...</p>
        </div>
      </main>
    )
  }

  if (error || !property) {
    return (
      <main className="min-h-screen bg-surface">
        <MobileHeader title="Erro" showBack />
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{error || 'Imóvel não encontrado'}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface pb-20">
      <MobileHeader 
        title={property.title} 
        showBack 
      />

      {/* Images Gallery */}
      {property.images && property.images.length > 0 && (
        <div className="relative">
          <div className="h-80 bg-gray-200 overflow-hidden">
            <img 
              src={property.images[currentImageIndex]} 
              alt={property.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log('Erro ao carregar imagem:', property.images[currentImageIndex])
                e.currentTarget.src = 'https://via.placeholder.com/800x600/e5e7eb/9ca3af?text=Imagem+Indisponível'
              }}
              onLoad={() => {
                console.log('Imagem carregada com sucesso:', property.images[currentImageIndex])
              }}
            />
          </div>
          
          {property.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {property.images.map((_, index) => (
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
        {/* Price and Type */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-primary text-white px-3 py-2 rounded-full text-sm font-bold">
              {PROPERTY_TYPES[property.type]}
            </span>
            <div className="text-right">
              <span className="text-primary font-bold text-3xl">
                R$ {property.price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Property Features */}
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl">
              <Bed size={18} className="text-gray-600" />
              <span className="font-semibold text-dark">{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl">
              <Bath size={18} className="text-gray-600" />
              <span className="font-semibold text-dark">{property.bathrooms}</span>
            </div>
            {property.area && (
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl">
                <Square size={18} className="text-gray-600" />
                <span className="font-semibold text-dark">{property.area}m²</span>
              </div>
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-dark mb-4">
            {property.title}
          </h1>
          
          <p className="text-dark-600 leading-relaxed mb-6">
            {property.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-dark-600">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>
                {new Date(property.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
            {(property.apartment || property.block) && (
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>
                  {property.apartment && `Apt ${property.apartment}`}
                  {property.apartment && property.block && ' • '}
                  {property.block}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-dark mb-4">Detalhes do Imóvel</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-dark-600">Tipo:</span>
                <span className="font-semibold">{PROPERTY_TYPES[property.type]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600">Quartos:</span>
                <span className="font-semibold">{property.bedrooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600">Banheiros:</span>
                <span className="font-semibold">{property.bathrooms}</span>
              </div>
            </div>
            <div className="space-y-3">
              {property.area && (
                <div className="flex justify-between">
                  <span className="text-dark-600">Área:</span>
                  <span className="font-semibold">{property.area}m²</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-dark-600">Status:</span>
                <span className="font-semibold text-green-600">Disponível</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-primary-700">
                {property.contact_name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-dark text-lg">
                {property.contact_name}
              </h3>
              {property.contact_phone && (
                <p className="text-dark-600">
                  {property.contact_phone}
                </p>
              )}
            </div>
          </div>

          {property.contact_phone && (
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