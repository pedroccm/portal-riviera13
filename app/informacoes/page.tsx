'use client'

import MobileHeader from '@/components/layout/MobileHeader'
import { Clock, Phone, MapPin, Waves, Anchor, Coffee, Mountain, Home } from 'lucide-react'

const informacoes = [
  {
    id: 'clube-iate',
    name: 'Clube Iate',
    icon: Anchor,
    description: 'Clube náutico exclusivo com marina completa e serviços de qualidade.',
    phone: '(11) 3456-7890',
    horarios: {
      'Segunda a Sexta': '08:00 às 18:00',
      'Sábado': '08:00 às 20:00',
      'Domingo': '09:00 às 17:00'
    },
    servicos: [
      'Marina com 150 vagas',
      'Aluguel de embarcações',
      'Escola de vela',
      'Restaurante panorâmico',
      'Loja náutica'
    ],
    localizacao: 'Marina Riviera - Píer Principal',
    observacoes: 'Reservas antecipadas recomendadas nos finais de semana.',
    color: 'bg-blue-500'
  },
  {
    id: 'clube-marina',
    name: 'Clube Marina',
    icon: Waves,
    description: 'Centro de lazer aquático com piscinas, restaurante e área de recreação.',
    phone: '(11) 2345-6789',
    horarios: {
      'Todos os dias': '06:00 às 22:00'
    },
    servicos: [
      'Piscina olímpica aquecida',
      'Piscina infantil',
      'Sauna e spa',
      'Academia completa',
      'Quadras poliesportivas'
    ],
    localizacao: 'Área Central do Condomínio',
    observacoes: 'Horário especial de limpeza: Terças das 06:00 às 08:00.',
    color: 'bg-cyan-500'
  },
  {
    id: 'ponto-alto',
    name: 'Ponto Alto',
    icon: Mountain,
    description: 'Mirante e área de contemplação com vista panorâmica da região.',
    phone: '(11) 1234-5678',
    horarios: {
      'Todos os dias': '05:30 às 21:00'
    },
    servicos: [
      'Trilha ecológica',
      'Mirante panorâmico',
      'Área para piquenique',
      'Playground',
      'Lanchonete'
    ],
    localizacao: 'Ponto mais alto do condomínio',
    observacoes: 'Ideal para assistir ao nascer e pôr do sol.',
    color: 'bg-green-500'
  },
  {
    id: 'ciber-cafe',
    name: 'Ciber Café',
    icon: Coffee,
    description: 'Espaço digital com internet, café e ambiente de trabalho.',
    phone: '(11) 9876-5432',
    horarios: {
      'Segunda a Sexta': '07:00 às 23:00',
      'Sábado e Domingo': '08:00 às 22:00'
    },
    servicos: [
      'Internet de alta velocidade',
      'Computadores disponíveis',
      'Impressão e digitalização',
      'Café e lanches',
      'Salas de reunião'
    ],
    localizacao: 'Praça Central - Térreo',
    observacoes: 'Wi-Fi gratuito para moradores. Sala de reunião sob agendamento.',
    color: 'bg-orange-500'
  },
  {
    id: 'casa-do-lago',
    name: 'Casa do Lago',
    icon: Home,
    description: 'Espaço para eventos e confraternizações em ambiente natural.',
    phone: '(11) 8765-4321',
    horarios: {
      'Segunda a Quinta': '09:00 às 18:00',
      'Sexta a Domingo': '09:00 às 23:00'
    },
    servicos: [
      'Salão para eventos',
      'Cozinha industrial',
      'Deck sobre o lago',
      'Churrasqueira gourmet',
      'Som e iluminação'
    ],
    localizacao: 'Margem do Lago Artificial',
    observacoes: 'Reserva obrigatória. Capacidade máxima: 80 pessoas.',
    color: 'bg-emerald-500'
  }
]

export default function InformacoesPage() {
  return (
    <main className="min-h-screen bg-surface pb-20">
      <MobileHeader title="Informações" />
      
      <div className="px-4 py-6">
        <div className="space-y-6">
          {informacoes.map((local) => {
            const Icon = local.icon
            
            return (
              <div key={local.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className={`${local.color} p-6 text-white`}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Icon size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{local.name}</h2>
                      <p className="text-white/90 text-sm">{local.description}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Contact */}
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-gray-500" />
                    <span className="font-semibold text-dark">{local.phone}</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-gray-500 mt-0.5" />
                    <span className="text-dark-600">{local.localizacao}</span>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-dark mb-2">Horários:</p>
                      <div className="space-y-1">
                        {Object.entries(local.horarios).map(([dia, horario]) => (
                          <div key={dia} className="flex justify-between">
                            <span className="text-dark-600">{dia}:</span>
                            <span className="font-semibold text-dark">{horario}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div>
                    <p className="font-semibold text-dark mb-3">Serviços disponíveis:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {local.servicos.map((servico, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-2 h-2 ${local.color} rounded-full`} />
                          <span className="text-dark-600 text-sm">{servico}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-dark-600">
                      <span className="font-semibold">📝 Observações:</span> {local.observacoes}
                    </p>
                  </div>

                </div>
              </div>
            )
          })}

          {/* Footer Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <p className="text-dark-600 text-sm">
              💡 <span className="font-semibold">Dica:</span> Para mais informações ou dúvidas, entre em contato diretamente com cada estabelecimento pelos telefones listados acima.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}