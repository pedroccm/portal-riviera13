-- Tabela CRM para pessoas importantes
CREATE TABLE crm_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  link TEXT, -- LinkedIn, site pessoal, etc
  description TEXT,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
  tags TEXT[], -- Array de tags para categorizar (ex: ['VIP', 'Fornecedor', 'Parceiro'])
  notes TEXT, -- Observações adicionais
  last_contact DATE, -- Data do último contato
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_crm_contacts_updated_at 
  BEFORE UPDATE ON crm_contacts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_crm_contacts_status ON crm_contacts(status);
CREATE INDEX idx_crm_contacts_name ON crm_contacts(name);
CREATE INDEX idx_crm_contacts_created_at ON crm_contacts(created_at DESC);
CREATE INDEX idx_crm_contacts_tags ON crm_contacts USING GIN(tags);

-- Comentários na tabela
COMMENT ON TABLE crm_contacts IS 'Tabela para gerenciamento de contatos importantes (CRM)';
COMMENT ON COLUMN crm_contacts.name IS 'Nome da pessoa/contato';
COMMENT ON COLUMN crm_contacts.email IS 'Email de contato';
COMMENT ON COLUMN crm_contacts.phone IS 'Telefone de contato';
COMMENT ON COLUMN crm_contacts.link IS 'Link relevante (LinkedIn, site, etc)';
COMMENT ON COLUMN crm_contacts.description IS 'Descrição/cargo/função da pessoa';
COMMENT ON COLUMN crm_contacts.tags IS 'Array de tags para categorização';
COMMENT ON COLUMN crm_contacts.notes IS 'Observações e anotações adicionais';
COMMENT ON COLUMN crm_contacts.last_contact IS 'Data do último contato realizado';