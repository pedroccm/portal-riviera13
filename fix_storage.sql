-- ================================================
-- Portal Riviera 13 - Correção Storage
-- ================================================
-- Execute este arquivo no SQL Editor do Supabase Dashboard

-- ================================================
-- VERIFICAR E CORRIGIR BUCKET 'images'
-- ================================================

-- Verificar configuração atual do bucket
SELECT * FROM storage.buckets WHERE id = 'images';

-- Atualizar bucket para ser público (se não estiver)
UPDATE storage.buckets 
SET public = true 
WHERE id = 'images';

-- Verificar se existem arquivos
SELECT name, bucket_id, created_at 
FROM storage.objects 
WHERE bucket_id = 'images' 
ORDER BY created_at DESC;

-- ================================================
-- RECRIAR BUCKET SE NECESSÁRIO
-- ================================================

-- Se o bucket tiver problemas, delete e recrie
-- DELETE FROM storage.objects WHERE bucket_id = 'images';
-- DELETE FROM storage.buckets WHERE id = 'images';

-- Criar bucket público novamente
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('images', 'images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

-- ================================================
-- VERIFICAR POLÍTICAS DO STORAGE
-- ================================================

-- Listar políticas atuais
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Allow public image uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public image access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public image updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow public image deletes" ON storage.objects;

-- Criar políticas corretas
CREATE POLICY "Enable all operations for images bucket" ON storage.objects
FOR ALL USING (bucket_id = 'images');

-- ================================================
-- VERIFICAR CONFIGURAÇÃO RLS
-- ================================================

-- Verificar se RLS está ativo no storage.objects
SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'objects' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'storage');

-- Se necessário, desabilitar RLS temporariamente para storage.objects
-- ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- ================================================
-- TESTE FINAL
-- ================================================

-- Verificar configuração final
SELECT 
  b.id as bucket_id,
  b.name,
  b.public,
  b.file_size_limit,
  b.allowed_mime_types,
  COUNT(o.name) as files_count
FROM storage.buckets b
LEFT JOIN storage.objects o ON b.id = o.bucket_id
WHERE b.id = 'images'
GROUP BY b.id, b.name, b.public, b.file_size_limit, b.allowed_mime_types;