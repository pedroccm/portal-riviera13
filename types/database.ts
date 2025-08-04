export interface Classified {
  id: string
  title: string
  description: string
  category: 'IFOOD' | 'ELETRICA' | 'PISCINA' | 'GERAL' | 'AR_CONDICIONADO' | 'JARDIM' | 'JET_QUADRI'
  price?: number
  images: string[]
  status: 'ACTIVE' | 'SOLD' | 'INACTIVE'
  contact_name: string
  contact_phone?: string
  instagram?: string
  apartment?: string
  block?: string
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  title: string
  description: string
  type: 'RENT' | 'SALE'
  property_subtype?: 'HOUSE' | 'LAND' | 'APARTMENT'
  price: number
  bedrooms: number
  bathrooms: number
  area?: number
  images: string[]
  status: 'AVAILABLE' | 'RENTED' | 'SOLD' | 'INACTIVE'
  contact_name: string
  contact_phone?: string
  instagram?: string
  apartment?: string
  block?: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  description: string
  event_date: string
  location?: string
  images: string[]
  max_guests?: number
  status: 'UPCOMING' | 'ONGOING' | 'FINISHED' | 'CANCELLED'
  contact_name: string
  contact_phone?: string
  created_at: string
  updated_at: string
}

export const CLASSIFIED_CATEGORIES = {
  IFOOD: 'iFood',
  ELETRICA: 'Elétrica',
  PISCINA: 'Piscina',
  GERAL: 'Geral',
  AR_CONDICIONADO: 'Ar Condicionado',
  JARDIM: 'Jardim',
  JET_QUADRI: 'Jet/Quadri'
} as const

export const PROPERTY_TYPES = {
  RENT: 'Aluguel',
  SALE: 'Venda'
} as const

export const PROPERTY_SUBTYPES = {
  HOUSE: 'Casa',
  LAND: 'Terreno',
  APARTMENT: 'Apartamento'
} as const

export interface Info {
  id: string
  title: string
  description: string
  detailed_description?: string
  category: 'RIVIERA' | 'HOSPITAIS' | 'SUPERMERCADOS' | 'RESTAURANTES' | 'HOTEIS'
  phone?: string
  address?: string
  location?: string
  hours?: Record<string, string>
  services?: string[]
  observations?: string
  website?: string
  email?: string
  images: string[]
  color?: string
  icon?: string
  status: 'ACTIVE' | 'INACTIVE'
  created_at: string
  updated_at: string
}

export const INFO_CATEGORIES = {
  RIVIERA: 'Riviera',
  HOSPITAIS: 'Hospitais',
  SUPERMERCADOS: 'Supermercados',
  RESTAURANTES: 'Restaurantes',
  HOTEIS: 'Hotéis'
} as const