-- ================================================
-- Portal Riviera 13 - Dados Fake para Teste
-- ================================================

-- ================================================
-- CLASSIFICADOS - Dados Fake
-- ================================================

-- Categoria: IFOOD
INSERT INTO classifieds (title, description, category, price, images, contact_name, contact_phone, apartment, block) VALUES
('Delivery de Açaí - Açaí do Bem', 'Açaí cremoso com diversos complementos. Entrega grátis no condomínio. Açaí premium com frutas frescas e granola crocante.', 'IFOOD', 25.90, ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'], 'Marina Silva', '(11) 98765-4321', '142', 'Bloco A'),
('Pizza Artesanal - Massa Madre', 'Pizzas artesanais com massa fermentada 48h. Ingredientes selecionados e forno a lenha. Entrega até 45min.', 'IFOOD', 39.90, ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop'], 'Carlos Oliveira', '(11) 97654-3210', '89', 'Bloco B'),
('Hambúrguer Gourmet - Burguer House', 'Hambúrgueres artesanais com carne angus. Batata rústica inclusa. Delivery gratuito para o condomínio.', 'IFOOD', 32.50, ARRAY['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop'], 'Ana Costa', '(11) 96543-2109', '203', 'Bloco C');

-- Categoria: ELETRICA
INSERT INTO classifieds (title, description, category, price, images, contact_name, contact_phone, apartment, block) VALUES
('Eletricista Residencial - João Elétrica', 'Serviços elétricos residenciais: instalação de tomadas, troca de disjuntores, reparo em chuveiros elétricos. Atendimento 24h.', 'ELETRICA', 80.00, ARRAY['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop'], 'João Santos', '(11) 95432-1098', '67', 'Bloco A'),
('Instalação de Ar Condicionado', 'Instalação e manutenção de ar condicionado. Técnico especializado com 10 anos de experiência. Garantia de 1 ano.', 'ELETRICA', 150.00, ARRAY['https://images.unsplash.com/photo-1545259741-2ea3ebf61fa1?w=800&h=600&fit=crop'], 'Roberto Lima', '(11) 94321-0987', '156', 'Bloco D'),
('Automação Residencial', 'Instalação de sistemas de automação: interruptores inteligentes, sensores de presença, controle por aplicativo.', 'ELETRICA', 200.00, ARRAY['https://images.unsplash.com/photo-1518709268805-4e9042af2ac6?w=800&h=600&fit=crop'], 'Tech Smart', '(11) 93210-9876', NULL, NULL);

-- Categoria: PISCINA
INSERT INTO classifieds (title, description, category, price, images, contact_name, contact_phone, apartment, block) VALUES
('Limpeza de Piscina Semanal', 'Serviço de limpeza e tratamento de piscina. Inclui aspiração, escovação e balanceamento químico. Serviço semanal.', 'PISCINA', 120.00, ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'], 'Piscinas Clean', '(11) 92109-8765', NULL, NULL),
('Manutenção de Equipamentos', 'Manutenção e reparo de bombas, filtros e aquecedores de piscina. Técnico especializado em equipamentos nacionais e importados.', 'PISCINA', 180.00, ARRAY['https://images.unsplash.com/photo-1574263867128-a3d5c1b1dedc'], 'AquaTech', '(11) 91098-7654', NULL, NULL),
('Aulas de Natação Particulares', 'Professor de natação com experiência em todas as idades. Aulas particulares na piscina do condomínio. Horários flexíveis.', 'PISCINA', 80.00, ARRAY['https://images.unsplash.com/photo-1530549387789-4c1017266635'], 'Prof. Ricardo', '(11) 90987-6543', '78', 'Bloco B');

-- Categoria: GERAL
INSERT INTO classifieds (title, description, category, price, images, contact_name, contact_phone, apartment, block) VALUES
('Vendo Bicicleta Aro 29', 'Bicicleta mountain bike aro 29, pouco usada. Marca Caloi, cor preta, com 21 marchas. Inclui capacete e bomba.', 'GERAL', 800.00, ARRAY['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13'], 'Pedro Ferreira', '(11) 89876-5432', '134', 'Bloco A'),
('Móveis de Escritório', 'Mesa de escritório em L + cadeira executiva. Móveis em ótimo estado, pouco uso. Ideal para home office.', 'GERAL', 450.00, ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7'], 'Lucia Mendes', '(11) 88765-4321', '91', 'Bloco C'),
('Serviço de Limpeza Doméstica', 'Faxineira experiente oferece serviços de limpeza doméstica. Referências disponíveis. Atendimento flexível.', 'GERAL', 60.00, ARRAY['https://images.unsplash.com/photo-1581578731548-c64695cc6952'], 'Maria Aparecida', '(11) 87654-3210', '45', 'Bloco B');

-- Categoria: AR_CONDICIONADO
INSERT INTO classifieds (title, description, category, price, images, contact_name, contact_phone, apartment, block) VALUES
('Técnico em Ar Condicionado', 'Instalação, manutenção e reparo de ar condicionado. Todas as marcas. Orçamento gratuito. Garantia nos serviços.', 'AR_CONDICIONADO', 100.00, ARRAY['https://images.unsplash.com/photo-1545259741-2ea3ebf61fa1'], 'ClimaTech', '(11) 86543-2109', NULL, NULL),
('Vendo Ar Split 12000 BTUs', 'Ar condicionado split Electrolux 12000 BTUs, usado apenas 6 meses. Com nota fiscal e garantia. Instalação inclusa.', 'AR_CONDICIONADO', 1200.00, ARRAY['https://images.unsplash.com/photo-1631545804814-2c6f2e0b57e6'], 'Fernando Alves', '(11) 85432-1098', '167', 'Bloco D'),
('Higienização de Ar Condicionado', 'Serviço de higienização e limpeza completa de ar condicionado. Remove fungos, bactérias e mau cheiro.', 'AR_CONDICIONADO', 80.00, ARRAY['https://images.unsplash.com/photo-1581578731548-c64695cc6952'], 'Higiene Total', '(11) 84321-0987', NULL, NULL);

-- Categoria: JARDIM
INSERT INTO classifieds (title, description, category, price, images, contact_name, contact_phone, apartment, block) VALUES
('Jardineiro Paisagista', 'Serviços de jardinagem e paisagismo. Poda, plantio, manutenção de jardins. Projetos personalizados para varandas.', 'JARDIM', 90.00, ARRAY['https://images.unsplash.com/photo-1416879595882-3373a0480b5b'], 'Verde Vida', '(11) 83210-9876', NULL, NULL),
('Vendo Plantas Ornamentais', 'Várias espécies de plantas ornamentais para apartamento. Suculentas, samambaias, palmeiras. Preços a partir de R$ 15.', 'JARDIM', 15.00, ARRAY['https://images.unsplash.com/photo-1463320726281-696a485928c7'], 'Jardim da Vovó', '(11) 82109-8765', '89', 'Bloco A'),
('Sistema de Irrigação', 'Instalação de sistema de irrigação automática para jardins e varandas. Programação por aplicativo.', 'JARDIM', 300.00, ARRAY['https://images.unsplash.com/photo-1586090940635-a37c7f2c6e7d'], 'IrrigaTech', '(11) 81098-7654', NULL, NULL);

-- Categoria: JET_QUADRI
INSERT INTO classifieds (title, description, category, price, images, contact_name, contact_phone, apartment, block) VALUES
('Aluguel de Jet Ski', 'Aluguel de jet ski para passeios. Equipamento em excelente estado com instrutor. Passeios pela região.', 'JET_QUADRI', 200.00, ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5'], 'Aventura Aquática', '(11) 99887-7665', NULL, NULL),
('Vendo Quadriciclo 250cc', 'Quadriciclo Honda TRX 250cc, ano 2020. Pouco rodado, sempre revisado. Documentação em dia.', 'JET_QUADRI', 15000.00, ARRAY['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13'], 'Marcos Adventure', '(11) 98776-6554', '234', 'Bloco D'),
('Manutenção de Jet Ski', 'Mecânico especializado em jet ski e quadriciclos. Revisão, reparo e manutenção preventiva. Serviço autorizado.', 'JET_QUADRI', 150.00, ARRAY['https://images.unsplash.com/photo-1581578731548-c64695cc6952'], 'PowerTech', '(11) 97665-5443', NULL, NULL);

-- ================================================
-- IMÓVEIS - Dados Fake
-- ================================================

-- Imóveis para LOCAÇÃO
INSERT INTO properties (title, description, type, price, bedrooms, bathrooms, area, images, contact_name, contact_phone, apartment, block) VALUES
('Apartamento 2 Quartos Vista Mar', 'Lindo apartamento com 2 quartos, sala, cozinha americana e varanda com vista para o mar. Mobiliado, pronto para morar.', 'RENT', 2800.00, 2, 2, 85.50, ARRAY['https://images.unsplash.com/photo-1560448204-e1a3ecbdd2af?w=800&h=600&fit=crop','https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop'], 'Imobiliária Riviera', '(11) 99123-4567', '145', 'Bloco A'),
('Casa Duplex 3 Quartos', 'Casa duplex com 3 quartos sendo 1 suíte, 3 banheiros, sala de estar, jantar, cozinha e área gourmet. Quintal privativo.', 'RENT', 4200.00, 3, 3, 150.00, ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop','https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop'], 'Maria Imóveis', '(11) 98234-5678', '78', 'Bloco C'),
('Studio Mobiliado', 'Studio moderno totalmente mobiliado. Ideal para solteiros ou casais. Área de 45m² com varanda. Inclui todas as utilidades.', 'RENT', 1800.00, 1, 1, 45.00, ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop','https://images.unsplash.com/photo-1560448204-e1a3ecbdd2af?w=800&h=600&fit=crop'], 'Carlos Corretor', '(11) 97345-6789', '23', 'Bloco B');

-- Imóveis para VENDA
INSERT INTO properties (title, description, type, price, bedrooms, bathrooms, area, images, contact_name, contact_phone, apartment, block) VALUES
('Cobertura 4 Quartos Premium', 'Magnífica cobertura com 4 quartos sendo 2 suítes, 4 banheiros, sala de estar/jantar, cozinha gourmet e terraço com piscina privativa.', 'SALE', 850000.00, 4, 4, 220.00, ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop','https://images.unsplash.com/photo-1560448204-e1a3ecbdd2af?w=800&h=600&fit=crop'], 'Premium Imóveis', '(11) 96456-7890', '301', 'Bloco D'),
('Apartamento 3 Quartos Reformado', 'Apartamento completamente reformado com 3 quartos, 2 banheiros, sala ampla, cozinha planejada. Pronto para morar.', 'SALE', 480000.00, 3, 2, 110.00, ARRAY['https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop','https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop'], 'Ana Corretora', '(11) 95567-8901', '189', 'Bloco A'),
('Casa Térrea Oportunidade', 'Casa térrea em excelente localização. 2 quartos, 1 banheiro, sala, cozinha e quintal. Ótima oportunidade de investimento.', 'SALE', 320000.00, 2, 1, 90.00, ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop','https://images.unsplash.com/photo-1560448204-e1a3ecbdd2af?w=800&h=600&fit=crop'], 'Oportunidade Imóveis', '(11) 94678-9012', '45', 'Bloco B');

-- ================================================
-- EVENTOS - Dados Fake
-- ================================================

INSERT INTO events (title, description, event_date, location, images, max_guests, contact_name, contact_phone) VALUES
('Festa Junina do Condomínio 2024', 'Grande festa junina com quadrilha, comidas típicas, pescaria e muita diversão para toda família. Evento beneficente em prol da APAE local.', '2024-06-29 19:00:00+00', 'Área de Lazer - Salão de Festas', ARRAY['https://images.unsplash.com/photo-1559827260-dc66d52bef19','https://images.unsplash.com/photo-1559827260-dc66d52bef19'], 200, 'Comissão de Eventos', '(11) 91234-5678'),

('Workshop de Culinária Italiana', 'Aprenda a fazer massas artesanais e molhos especiais com o Chef Giovanni. Inclui degustação e receitas para levar para casa.', '2024-08-15 14:00:00+00', 'Área Gourmet do Bloco A', ARRAY['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136','https://images.unsplash.com/photo-1556909688-f6e7ad7d3136'], 25, 'Chef Giovanni', '(11) 92345-6789'),

('Torneio de Tênis Riviera Cup', 'Torneio de tênis entre moradores. Categorias: iniciante, intermediário e avançado. Premiação para os primeiros colocados.', '2024-09-10 08:00:00+00', 'Quadra de Tênis', ARRAY['https://images.unsplash.com/photo-1551698618-1dfe5d97d256','https://images.unsplash.com/photo-1551698618-1dfe5d97d256'], 50, 'Clube de Tênis', '(11) 93456-7890'),

('Aula de Aqua Aeróbica', 'Aulas de aqua aeróbica todas as terças e quintas. Exercícios de baixo impacto na água. Ideal para todas as idades.', '2024-08-06 09:00:00+00', 'Piscina Principal', ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b','https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'], 20, 'Profa. Sandra', '(11) 94567-8901'),

('Feira de Produtos Orgânicos', 'Feira mensal com produtos orgânicos locais. Frutas, verduras, pães artesanais e produtos naturais. Apoie os produtores da região.', '2024-08-10 07:00:00+00', 'Praça Central', ARRAY['https://images.unsplash.com/photo-1542838132-92c53300491e','https://images.unsplash.com/photo-1542838132-92c53300491e'], 100, 'Feira Orgânica', '(11) 95678-9012'),

('Sessão de Cinema ao Ar Livre', 'Sessão especial do filme "O Rei Leão" na área da piscina. Traga sua cadeira ou canga. Pipoca gratuita para todos.', '2024-08-20 19:30:00+00', 'Área da Piscina', ARRAY['https://images.unsplash.com/photo-1489599735371-750e8f5c90e4','https://images.unsplash.com/photo-1489599735371-750e8f5c90e4'], 150, 'Cine Riviera', '(11) 96789-0123');

-- ================================================
-- Atualizar algumas datas para o passado (eventos finalizados)
-- ================================================

UPDATE events 
SET status = 'FINISHED' 
WHERE event_date < NOW();

-- ================================================
-- Comentários finais
-- ================================================

-- Total inserido:
-- Classificados: 21 registros (3 por categoria)
-- Imóveis: 6 registros (3 locação + 3 venda)
-- Eventos: 6 registros (mix de datas futuras e passadas)