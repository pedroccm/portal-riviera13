-- ================================================
-- Portal Riviera 13 - Correção de Imagens
-- ================================================
-- Execute este arquivo no SQL Editor do Supabase Dashboard
-- para corrigir as URLs das imagens existentes

-- ================================================
-- VERIFICAR IMAGENS ATUAIS
-- ================================================

-- Ver todas as imagens dos classificados
SELECT id, title, images 
FROM classifieds 
WHERE images IS NOT NULL AND array_length(images, 1) > 0;

-- Ver todas as imagens dos imóveis  
SELECT id, title, images 
FROM properties 
WHERE images IS NOT NULL AND array_length(images, 1) > 0;

-- Ver todas as imagens dos eventos
SELECT id, title, images 
FROM events 
WHERE images IS NOT NULL AND array_length(images, 1) > 0;

-- ================================================
-- OPÇÃO 1: ATUALIZAR COM IMAGENS PLACEHOLDER
-- ================================================

-- Atualizar classificados com imagens placeholder do Supabase
UPDATE classifieds 
SET images = ARRAY[
  'https://your-project.supabase.co/storage/v1/object/public/images/placeholder-classified.jpg'
]
WHERE images IS NOT NULL AND array_length(images, 1) > 0;

-- Atualizar imóveis com imagens placeholder do Supabase  
UPDATE properties 
SET images = ARRAY[
  'https://your-project.supabase.co/storage/v1/object/public/images/placeholder-property.jpg'
]
WHERE images IS NOT NULL AND array_length(images, 1) > 0;

-- Atualizar eventos com imagens placeholder do Supabase
UPDATE events 
SET images = ARRAY[
  'https://your-project.supabase.co/storage/v1/object/public/images/placeholder-event.jpg'
]
WHERE images IS NOT NULL AND array_length(images, 1) > 0;

-- ================================================
-- OPÇÃO 2: MANTER URLs UNSPLASH (TEMPORÁRIO)
-- ================================================

-- Se quiser manter as URLs do Unsplash funcionando temporariamente,
-- não precisa fazer nada. As URLs antigas continuarão funcionando.

-- ================================================
-- OPÇÃO 3: LIMPAR IMAGENS (REMOVER TODAS)
-- ================================================

-- Remover todas as imagens dos classificados
-- UPDATE classifieds SET images = ARRAY[]::text[];

-- Remover todas as imagens dos imóveis
-- UPDATE properties SET images = ARRAY[]::text[];

-- Remover todas as imagens dos eventos  
-- UPDATE events SET images = ARRAY[]::text[];

-- ================================================
-- INSERIR IMAGENS PLACEHOLDER NO STORAGE
-- ================================================

-- Você precisa fazer upload manual de imagens placeholder no Supabase Storage:
-- 1. Vá para Storage > images no Dashboard
-- 2. Faça upload de:
--    - placeholder-classified.jpg
--    - placeholder-property.jpg  
--    - placeholder-event.jpg

-- ================================================
-- VERIFICAR APÓS ATUALIZAÇÃO
-- ================================================

-- Contar registros com imagens
SELECT 
  'classifieds' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN images IS NOT NULL AND array_length(images, 1) > 0 THEN 1 END) as records_with_images
FROM classifieds
UNION ALL
SELECT 
  'properties' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN images IS NOT NULL AND array_length(images, 1) > 0 THEN 1 END) as records_with_images
FROM properties  
UNION ALL
SELECT 
  'events' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN images IS NOT NULL AND array_length(images, 1) > 0 THEN 1 END) as records_with_images
FROM events;