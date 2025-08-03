'use client'

import { useEvents } from '@/hooks/useSupabase'
import MobileHeader from '@/components/layout/MobileHeader'
import { Calendar, MapPin, Users } from 'lucide-react'

export default function EventosPage() {
  const { events, loading, error } = useEvents()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <MobileHeader title="Eventos" />
      
      <div className="px-4 py-6">
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Carregando eventos...</p>
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
                {events.length} eventos próximos
              </p>
            </div>

            {events.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="mx-auto mb-4 text-gray-300" size={48} />
                <p className="text-gray-500">Nenhum evento próximo</p>
              </div>
            )}

            {events.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={16} />
                        <span>{formatDate(item.event_date)}</span>
                      </div>
                      
                      {item.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin size={16} />
                          <span>{item.location}</span>
                        </div>
                      )}
                      
                      {item.max_guests && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Users size={16} />
                          <span>Máximo {item.max_guests} pessoas</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'UPCOMING' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.status === 'UPCOMING' ? 'Próximo' : 'Em andamento'}
                      </span>
                      
                      <div className="text-xs text-gray-500 text-right">
                        {item.contact_name}
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
          </div>
        )}
      </div>
    </main>
  )
}