-- ================================================
-- Portal Riviera 13 - Políticas de Segurança
-- ================================================
-- Execute este arquivo no SQL Editor do Supabase Dashboard
-- para configurar todas as políticas necessárias

-- ================================================
-- STORAGE POLICIES - Bucket 'images'
-- ================================================

-- Permitir upload de imagens (INSERT)
CREATE POLICY "Allow public image uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images');

-- Permitir leitura de imagens (SELECT)
CREATE POLICY "Allow public image access" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Permitir atualização de imagens (UPDATE)
CREATE POLICY "Allow public image updates" ON storage.objects
FOR UPDATE USING (bucket_id = 'images');

-- Permitir exclusão de imagens (DELETE)
CREATE POLICY "Allow public image deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'images');

-- ================================================
-- TABLE POLICIES - Tabelas do Portal
-- ================================================

-- ================================================
-- CLASSIFICADOS - Políticas
-- ================================================

-- Permitir leitura de classificados ativos
CREATE POLICY "Allow public read classifieds" ON classifieds
FOR SELECT USING (status = 'ACTIVE');

-- Permitir inserção de novos classificados
CREATE POLICY "Allow public insert classifieds" ON classifieds
FOR INSERT WITH CHECK (true);

-- Permitir atualização de classificados
CREATE POLICY "Allow public update classifieds" ON classifieds
FOR UPDATE USING (true);

-- ================================================
-- IMÓVEIS - Políticas  
-- ================================================

-- Permitir leitura de imóveis disponíveis
CREATE POLICY "Allow public read properties" ON properties
FOR SELECT USING (status = 'AVAILABLE');

-- Permitir inserção de novos imóveis
CREATE POLICY "Allow public insert properties" ON properties
FOR INSERT WITH CHECK (true);

-- Permitir atualização de imóveis
CREATE POLICY "Allow public update properties" ON properties
FOR UPDATE USING (true);

-- ================================================
-- EVENTOS - Políticas
-- ================================================

-- Permitir leitura de eventos ativos
CREATE POLICY "Allow public read events" ON events
FOR SELECT USING (status IN ('UPCOMING', 'ONGOING'));

-- Permitir inserção de novos eventos
CREATE POLICY "Allow public insert events" ON events
FOR INSERT WITH CHECK (true);

-- Permitir atualização de eventos
CREATE POLICY "Allow public update events" ON events
FOR UPDATE USING (true);

-- ================================================
-- HABILITAR RLS NAS TABELAS (se não estiver ativo)
-- ================================================

-- Ativar RLS nas tabelas principais
ALTER TABLE classifieds ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- ================================================
-- VERIFICAR BUCKET 'images' (criar se não existir)
-- ================================================

-- Verificar se o bucket 'images' existe, criar caso não exista
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- COMENTÁRIOS FINAIS
-- ================================================

-- Após executar este script:
-- 1. ✅ Upload de imagens funcionará no admin
-- 2. ✅ Leitura pública de dados funcionará no portal  
-- 3. ✅ Inserção de novos itens funcionará no admin
-- 4. ✅ Bucket 'images' estará configurado corretamente

-- IMPORTANTE: 
-- - Este script permite acesso público de leitura e escrita
-- - Para produção, considere políticas mais restritivas
-- - Mantenha backups regulares do banco de dados