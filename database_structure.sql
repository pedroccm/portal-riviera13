-- ================================================
-- Portal Riviera 13 - Estrutura das Tabelas
-- ================================================

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

-- ================================================
-- Função para atualizar updated_at automaticamente
-- ================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ================================================
-- Triggers para updated_at
-- ================================================

CREATE TRIGGER update_classifieds_updated_at 
  BEFORE UPDATE ON classifieds 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at 
  BEFORE UPDATE ON properties 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at 
  BEFORE UPDATE ON events 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- Índices para performance
-- ================================================

-- Índices para Classificados
CREATE INDEX idx_classifieds_category ON classifieds(category);
CREATE INDEX idx_classifieds_status ON classifieds(status);
CREATE INDEX idx_classifieds_created_at ON classifieds(created_at DESC);
CREATE INDEX idx_classifieds_price ON classifieds(price);

-- Índices para Imóveis
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);

-- Índices para Eventos
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_created_at ON events(created_at DESC);

-- ================================================
-- RLS (Row Level Security) - Opcional
-- ================================================

-- Habilitar RLS (se necessário)
-- ALTER TABLE classifieds ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública (se necessário)
-- CREATE POLICY "Public read access" ON classifieds FOR SELECT USING (true);
-- CREATE POLICY "Public read access" ON properties FOR SELECT USING (true);
-- CREATE POLICY "Public read access" ON events FOR SELECT USING (true);

-- ================================================
-- Comentários nas tabelas
-- ================================================

COMMENT ON TABLE classifieds IS 'Tabela de classificados do condomínio';
COMMENT ON TABLE properties IS 'Tabela de imóveis para locação e venda';
COMMENT ON TABLE events IS 'Tabela de eventos do condomínio';

COMMENT ON COLUMN classifieds.category IS 'Categorias: IFOOD, ELETRICA, PISCINA, GERAL, AR_CONDICIONADO, JARDIM, JET_QUADRI';
COMMENT ON COLUMN properties.type IS 'Tipo do imóvel: RENT (locação) ou SALE (venda)';
COMMENT ON COLUMN events.status IS 'Status do evento: UPCOMING, ONGOING, FINISHED, CANCELLED';