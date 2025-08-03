# Portal Riviera 13 - Guia de Desenvolvimento

## Visão Geral
Portal não oficial de condomínio desenvolvido em Next.js com foco em dispositivos móveis, inspirado no layout do Airbnb. 
**Portal apenas para exibição de informações - sem sistema de cadastro/upload.**

## Estrutura do Projeto

### Funcionalidades Principais
- **Classificados** (iFood, Elétrica, Piscina, Geral, Ar Condicionado, Jardim, Jet/Quadri) - **Somente leitura**
- **Imóveis** (Locação, Venda de Casa) - **Somente leitura**
- **Eventos** - **Somente leitura**
- **Informações Básicas**

## Passo a Passo de Desenvolvimento

### 1. Setup Inicial do Projeto

```bash
# Criar projeto Next.js
npx create-next-app@latest portal-riviera13 --typescript --tailwind --eslint --app

# Dependências essenciais
npm install @supabase/supabase-js
npm install lucide-react
npm install @headlessui/react
npm install framer-motion
```

### 2. Configuração do Supabase

#### Setup do Cliente Supabase

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### Schema SQL do Banco (Supabase)

```sql
-- Tabela de Classificados
CREATE TABLE classifieds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('IFOOD', 'ELETRICA', 'PISCINA', 'GERAL', 'AR_CONDICIONADO', 'JARDIM', 'JET_QUADRI')),
  price DECIMAL(10,2),
  images TEXT[],
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SOLD', 'INACTIVE')),
  contact_name TEXT NOT NULL,
  contact_phone TEXT,
  apartment TEXT,
  block TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Imóveis
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('RENT', 'SALE')),
  price DECIMAL(10,2) NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  area DECIMAL(8,2),
  images TEXT[],
  status TEXT DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'RENTED', 'SOLD', 'INACTIVE')),
  contact_name TEXT NOT NULL,
  contact_phone TEXT,
  apartment TEXT,
  block TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Eventos
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  images TEXT[],
  max_guests INTEGER,
  status TEXT DEFAULT 'UPCOMING' CHECK (status IN ('UPCOMING', 'ONGOING', 'FINISHED', 'CANCELLED')),
  contact_name TEXT NOT NULL,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_classifieds_updated_at BEFORE UPDATE ON classifieds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_classifieds_category ON classifieds(category);
CREATE INDEX idx_classifieds_status ON classifieds(status);
CREATE INDEX idx_classifieds_created_at ON classifieds(created_at DESC);

CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);

CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_created_at ON events(created_at DESC);
```

#### Types TypeScript

```typescript
// types/database.ts
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
  price: number
  bedrooms: number
  bathrooms: number
  area?: number
  images: string[]
  status: 'AVAILABLE' | 'RENTED' | 'SOLD' | 'INACTIVE'
  contact_name: string
  contact_phone?: string
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
```

### 3. Estrutura de Pastas

```
src/
├── app/
│   ├── classificados/
│   │   └── [category]/
│   ├── imoveis/
│   │   ├── locacao/
│   │   └── venda/
│   ├── eventos/
│   │   └── [id]/
│   └── layout.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   └── cards/
├── lib/
│   ├── supabase.ts
│   └── utils.ts
├── types/
│   └── database.ts
└── hooks/
    └── useSupabase.ts
```

### 4. Layout Mobile-First (Inspirado no Airbnb)

#### Componentes Base

**Header Mobile:**
```typescript
// components/layout/MobileHeader.tsx
interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}
```

**Navigation Bar:**
```typescript
// components/layout/BottomNav.tsx
const navItems = [
  { icon: Home, label: 'Início', href: '/' },
  { icon: Search, label: 'Classificados', href: '/classificados' },
  { icon: Building, label: 'Imóveis', href: '/imoveis' },
  { icon: Calendar, label: 'Eventos', href: '/eventos' }
];
```

**Card Components:**
```typescript
// components/cards/ClassifiedCard.tsx
interface ClassifiedCardProps {
  id: string;
  title: string;
  category: string;
  price?: number;
  image: string;
  contactName: string;
  contactPhone?: string;
}

// components/cards/PropertyCard.tsx
interface PropertyCardProps {
  id: string;
  title: string;
  type: 'rent' | 'sale';
  price: number;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  images: string[];
  contactName: string;
  contactPhone?: string;
}
```

### 5. Páginas Principais (Somente Leitura)

#### Home Page
```typescript
// app/page.tsx
- Hero section com busca
- Categorias em grid
- Últimos classificados
- Próximos eventos
- Imóveis em destaque
```

#### Classificados
```typescript
// app/classificados/page.tsx
- Filtros por categoria
- Grid de cards (somente leitura)
- Busca por texto
- Ordenação (recente, preço)
- Modal com detalhes e contato
```

#### Imóveis
```typescript
// app/imoveis/page.tsx
- Tabs: Locação/Venda
- Filtros (preço, quartos, área)
- Lista com cards detalhados
- Modal com galeria e contato
```

#### Eventos
```typescript
// app/eventos/page.tsx
- Lista de eventos
- Filtro por data
- Cards com informações e contato
```

### 6. Hooks Customizados para Supabase

```typescript
// hooks/useSupabase.ts
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Classified, Property, Event } from '@/types/database'

export function useClassifieds() {
  const [classifieds, setClassifieds] = useState<Classified[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClassifieds()
  }, [])

  const fetchClassifieds = async () => {
    const { data, error } = await supabase
      .from('classifieds')
      .select('*')
      .eq('status', 'ACTIVE')
      .order('created_at', { ascending: false })

    if (data && !error) setClassifieds(data)
    setLoading(false)
  }

  return { classifieds, loading, refetch: fetchClassifieds }
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'AVAILABLE')
      .order('created_at', { ascending: false })

    if (data && !error) setProperties(data)
    setLoading(false)
  }

  return { properties, loading, refetch: fetchProperties }
}
```

### 7. Comandos de Desenvolvimento

```bash
# Desenvolvimento
npm run dev
npm run build
npm run lint
npm run typecheck
```

### 8. Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-chave-anonima"
```

### 9. Funcionalidades Mobile

- **Touch gestures** para navegação
- **Infinite scroll** nas listagens
- **Pull-to-refresh**
- **Busca e filtros**
- **Compartilhamento nativo**
- **Links diretos para WhatsApp/Telefone**

### 10. Design System

#### Cores (Inspirado no Airbnb)
```css
:root {
  --primary: #FF385C;
  --primary-dark: #E00B41;
  --secondary: #00A699;
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-900: #111827;
}
```

#### Componentes UI
- Buttons com estados hover/active
- Input fields com validação visual
- Modal/Sheet para mobile
- Toast notifications
- Loading skeletons

### 11. Testing

```bash
# Instalar dependências de teste
npm install -D jest @testing-library/react @testing-library/jest-dom

# Executar testes
npm run test
npm run test:watch
```

## Funcionalidades do Portal

### Características Principais
- ✅ **Somente leitura** - Portal para consulta de informações
- ✅ **Mobile-first** - Otimizado para smartphones
- ✅ **Layout Airbnb** - Interface familiar e intuitiva
- ✅ **Supabase** - Banco de dados em nuvem
- ✅ **TypeScript** - Tipagem estática

### Funcionalidades Implementadas
- 📱 **Navegação mobile** com bottom tabs
- 🔍 **Busca e filtros** por categoria/preço/tipo
- 📋 **Listagem** de classificados, imóveis e eventos
- 📞 **Contato direto** via WhatsApp/telefone
- 🔄 **Pull-to-refresh** para atualizar dados
- 💫 **Animações** suaves com Framer Motion

## Próximos Passos (Futuro)

1. **Sistema de favoritos** (localStorage)
2. **PWA** para instalação mobile
3. **Notificações** push
4. **Modo offline** básico
5. **Analytics** de visualizações

## Comandos Úteis

```bash
# Lint e formatação
npm run lint
npm run lint:fix

# Verificação de tipos
npm run typecheck

# Build para produção
npm run build
npm run start
```