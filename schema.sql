-- Script DDL PostgreSQL para a Aplicação "Sniper de Ofertas"
-- Executar no pgAdmin (Query Tool) ou via psql

-- 1. Tabela de Usuários (Autenticação Local)
CREATE TABLE IF NOT EXISTS public.usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Tabela de Preferências de Usuário (Controle de Alertas e Antispam)
CREATE TABLE IF NOT EXISTS public.preferencias_usuario (
    usuario_id INT NOT NULL PRIMARY KEY,
    categorias_focadas JSONB DEFAULT '["Tecnologia", "Moda", "Viagens", "Supermercado"]'::jsonb,
    max_alertas_por_dia INT DEFAULT 5,
    push_ativado BOOLEAN DEFAULT TRUE,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE
);

-- 3. Tabela de Cronograma de Ofertas e Cupons (Motor de Alertas)
CREATE TABLE IF NOT EXISTS public.cronograma_ofertas (
    id SERIAL PRIMARY KEY,
    categoria VARCHAR(100) NOT NULL, -- 'Tecnologia', 'Moda', 'Viagens', 'Supermercado'
    plataforma VARCHAR(100) NOT NULL, -- 'Mercado Livre', 'Lojas Renner', 'Esfera', etc.
    titulo VARCHAR(255) NOT NULL,
    dia_semana_gatilho INT, -- 0 = Domingo, 1 = Segunda... 6 = Sábado (NULL para datas fixas)
    horario_gatilho TIME NOT NULL,
    duracao_minutos INT DEFAULT 60,
    desconto_percentual_esperado DECIMAL(5,2),
    desconto_cupom_fixo DECIMAL(10,2),
    valor_minimo_compra DECIMAL(10,2) DEFAULT 0.00,
    codigo_cupom VARCHAR(50),
    selo_tag VARCHAR(50), -- 'FULL', 'BOHOCHIC', 'TECH', etc.
    data_especifica DATE, -- Para datas comemorativas fixas (ex: 15/03, 29/11)
    descricao TEXT,
    url_redirecionamento VARCHAR(512),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. Tabela de Histórico de Economia do Usuário (Painel de ROI)
CREATE TABLE IF NOT EXISTS public.historico_economia (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    nome_produto VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    preco_original DECIMAL(10,2) NOT NULL,
    preco_final DECIMAL(10,2) NOT NULL,
    valor_economizado DECIMAL(10,2) GENERATED ALWAYS AS (preco_original - preco_final) STORED,
    plataforma VARCHAR(100) NOT NULL,
    registrado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. Carga de Dados Inicial (Seed Data dos Padrões de Desconto)
INSERT INTO public.cronograma_ofertas
(categoria, plataforma, titulo, dia_semana_gatilho, horario_gatilho, duracao_minutos, desconto_percentual_esperado, desconto_cupom_fixo, valor_minimo_compra, codigo_cupom, selo_tag, descricao, url_redirecionamento)
VALUES
('Moda', 'Mercado Livre', 'Roupas de Academia Sniper', 2, '21:00:00', 60, 20.00, NULL, 0.00, 'BOHOCHIC', 'FULL', 'Melhor horário para compra de vestuário fitness com frete FULL e envio rápido', 'https://www.mercadolivre.com.br'),
('Tecnologia', 'Mercado Livre', 'Domingo de Tecnologia', 0, '15:00:00', 120, NULL, 200.00, 1199.00, 'ACTIVE_AT_15H', 'TECH', 'Cupom de R$200 OFF para Laptops, Laptops de Alto Valor, Celulares e Gadgets', 'https://www.mercadolivre.com.br'),
('Moda', 'Lojas Renner', 'Especial Renner BohoChic', NULL, '17:00:00', 180, 20.00, NULL, 150.00, 'BOHOCHIC', 'RENNER', 'Cupom extra de 20% aplicável na seleção BohoChic pelo app', 'https://www.lojasrenner.com.br'),
('Supermercado', 'Supermercado Rio Branco', 'Fecha Mês Rio Branco', NULL, '08:00:00', 1440, 15.00, NULL, 100.00, 'LOCAL', 'ARARAS', 'Campanha de ofertas de carnes, hortifruti e limpeza nos últimos 5 dias do mês', 'https://www.facebook.com/smriobranco'),
('Tecnologia', 'Mercado Livre', 'Chuva de Cupons Geral', 0, '12:00:00', 180, NULL, 60.00, 299.00, 'DOMINGO60', 'MELI+', 'Cupons regressivos de R$30 a R$60 OFF em todo o site', 'https://www.mercadolivre.com.br'),
('Tecnologia', 'Mercado Livre', 'Noite do Frete FULL', 0, '19:00:00', 300, 25.00, NULL, 0.00, 'FULL25', 'FULL', 'Resgate às 19h, uso liberado no carrinho a partir de 00h00', 'https://www.mercadolivre.com.br'),
('Tecnologia', 'Promobit Black Friday', 'Madrugada Gamer & Consoles', 5, '00:00:00', 180, 40.00, NULL, 500.00, 'BFGAMER', 'BLACK_FRIDAY', 'Ápice de menor preço em consoles, games e hardware entre 22h de quinta e 01h de sexta', 'https://www.promobit.com.br'),
('Passagens & Viagens', 'Companhias Aéreas', 'Madrugada Promocional de Voos', 2, '01:00:00', 300, 35.00, NULL, 0.00, 'VOATERCA', 'VIAGENS', 'Melhores tarifas em voos nacionais (28 a 35 dias de antecedência) nas madrugadas de terça e quarta', 'https://www.google.com/travel/flights')
ON CONFLICT DO NOTHING;
