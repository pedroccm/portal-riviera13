-- Adicionar campo 'link' na tabela properties para links do Airbnb
ALTER TABLE properties 
ADD COLUMN link TEXT;

-- Comentário explicativo
COMMENT ON COLUMN properties.link IS 'Link para anúncio externo (Airbnb, Booking.com, etc)';