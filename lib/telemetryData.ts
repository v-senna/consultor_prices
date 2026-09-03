import { OfertaCronograma } from '@/types';

export const OFERTAS_TELEMETRIA_INITIAL: OfertaCronograma[] = [
  // --- MODA & VESTUÁRIO ---
  {
    id: 1,
    categoria: 'Moda & Vestuário',
    plataforma: 'Mercado Livre',
    titulo: 'Roupas de Academia & Fitness Sniper',
    dia_semana_gatilho: 2, // Terça-feira
    horario_gatilho: '21:00:00',
    duracao_minutos: 60,
    desconto_percentual_esperado: 20,
    desconto_cupom_fixo: null,
    valor_minimo_compra: 0,
    codigo_cupom: 'BOHOCHIC',
    selo_tag: 'FULL',
    descricao: '🟢 JANELA SNIPER ATIVA: Melhor horário para roupas de academia no Mercado Livre ou Renner! Cupom BOHOCHIC + 20% EXTRA com frete FULL.',
    url_redirecionamento: 'https://www.mercadolivre.com.br'
  },
  {
    id: 2,
    categoria: 'Moda & Vestuário',
    plataforma: 'Lojas Renner',
    titulo: 'Especial Renner BohoChic Sazonal',
    dia_semana_gatilho: null,
    horario_gatilho: '17:00:00',
    duracao_minutos: 180,
    desconto_percentual_esperado: 20,
    desconto_cupom_fixo: null,
    valor_minimo_compra: 150,
    codigo_cupom: 'BOHOCHIC',
    selo_tag: 'RENNER_APP',
    descricao: 'Liquidação e cupom BOHOCHIC extra no app Renner. Ganhe de 10% a 15% adicionais na primeira compra via mobile.',
    url_redirecionamento: 'https://www.lojasrenner.com.br'
  },
  {
    id: 3,
    categoria: 'Moda & Vestuário',
    plataforma: 'Promobit Black Friday',
    titulo: 'Pico de Vestuário Feminino & Masculino',
    dia_semana_gatilho: 5, // Sexta-feira
    horario_gatilho: '17:00:00',
    duracao_minutos: 240,
    desconto_percentual_esperado: 50,
    desconto_cupom_fixo: null,
    valor_minimo_compra: 0,
    codigo_cupom: 'BLACKMODA',
    selo_tag: 'PROMOBIT',
    descricao: 'Pico máximo de ofertas em moda feminina e masculina na Black Friday (34% a 50% de desconto real).',
    url_redirecionamento: 'https://www.promobit.com.br'
  },

  // --- TECNOLOGIA & INFORMÁTICA ---
  {
    id: 4,
    categoria: 'Tecnologia & Informática',
    plataforma: 'Mercado Livre',
    titulo: 'Domingo de Tecnologia (Laptops e Celulares)',
    dia_semana_gatilho: 0, // Domingo
    horario_gatilho: '15:00:00',
    duracao_minutos: 120,
    desconto_percentual_esperado: 15,
    desconto_cupom_fixo: 200,
    valor_minimo_compra: 1199,
    codigo_cupom: 'TECH200',
    selo_tag: 'MELI_TECH',
    descricao: 'Lote especial de tecnologia! Cupom de R$ 200 OFF para compras acima de R$ 1.199 em eletrônicos, laptops e smartphones.',
    url_redirecionamento: 'https://www.mercadolivre.com.br'
  },
  {
    id: 5,
    categoria: 'Tecnologia & Informática',
    plataforma: 'Mercado Livre',
    titulo: 'Chuva de Cupons Geral Mercado Livre',
    dia_semana_gatilho: 0, // Domingo
    horario_gatilho: '12:00:00',
    duracao_minutos: 180,
    desconto_percentual_esperado: null,
    desconto_cupom_fixo: 60,
    valor_minimo_compra: 299,
    codigo_cupom: 'CHUVA60',
    selo_tag: 'DOMINGO_MELI',
    descricao: 'Liberação de cupons escalonados: R$ 30 (mín R$ 140), R$ 40 (mín R$ 199), R$ 50 (mín R$ 249) e R$ 60 (mín R$ 299).',
    url_redirecionamento: 'https://www.mercadolivre.com.br'
  },
  {
    id: 6,
    categoria: 'Tecnologia & Informática',
    plataforma: 'Mercado Livre',
    titulo: 'Gatilho de Cupons 25% OFF Selo FULL',
    dia_semana_gatilho: 0, // Domingo
    horario_gatilho: '19:00:00',
    duracao_minutos: 300,
    desconto_percentual_esperado: 25,
    desconto_cupom_fixo: null,
    valor_minimo_compra: 0,
    codigo_cupom: 'FULL25NIGHT',
    selo_tag: 'FULL',
    descricao: 'Resgate o cupom às 19h! A ativação no carrinho inicia pontualmente à meia-noite (00h00).',
    url_redirecionamento: 'https://www.mercadolivre.com.br'
  },
  {
    id: 7,
    categoria: 'Tecnologia & Informática',
    plataforma: 'Mercado Livre',
    titulo: 'Mês do Consumidor (Campanha 3.3)',
    dia_semana_gatilho: null,
    horario_gatilho: '09:00:00',
    duracao_minutos: 720,
    desconto_percentual_esperado: 70,
    desconto_cupom_fixo: null,
    valor_minimo_compra: 19,
    codigo_cupom: 'CONSUMIDOR33',
    selo_tag: 'FRETE_19',
    descricao: 'Frete grátis liberado a partir de R$ 19,00, descontos de até 70% OFF e parcelamento em até 21x sem juros com cartão Mercado Pago.',
    url_redirecionamento: 'https://www.mercadolivre.com.br'
  },
  {
    id: 8,
    categoria: 'Tecnologia & Informática',
    plataforma: 'Promobit Black Friday',
    titulo: 'Madrugada Gamer & Consoles',
    dia_semana_gatilho: 5, // Sexta
    horario_gatilho: '00:00:00',
    duracao_minutos: 180,
    desconto_percentual_esperado: 45,
    desconto_cupom_fixo: null,
    valor_minimo_compra: 0,
    codigo_cupom: 'MADRUGADAGAMER',
    selo_tag: 'GAMER',
    descricao: 'Ápice histórico de menor preço em consoles, games e computadores (entre 22h de quinta e 01h de sexta).',
    url_redirecionamento: 'https://www.promobit.com.br'
  },
  {
    id: 9,
    categoria: 'Tecnologia & Informática',
    plataforma: 'Promobit Cyber Monday',
    titulo: 'Cyber Monday Pico Absoluto',
    dia_semana_gatilho: 1, // Segunda
    horario_gatilho: '15:00:00',
    duracao_minutos: 240,
    desconto_percentual_esperado: 41,
    desconto_cupom_fixo: null,
    valor_minimo_compra: 0,
    codigo_cupom: 'CYBER41',
    selo_tag: 'CYBER_MONDAY',
    descricao: 'Pico de desconto da Cyber Monday com média de 41% OFF das 15h às 19h.',
    url_redirecionamento: 'https://www.promobit.com.br'
  },

  // --- PASSAGENS & VIAGENS ---
  {
    id: 10,
    categoria: 'Passagens & Viagens',
    plataforma: 'Sniper de Voos',
    titulo: 'Janela de Voos Nacionais (28 a 35 Dias)',
    dia_semana_gatilho: 2, // Terça-feira
    horario_gatilho: '02:00:00',
    duracao_minutos: 240,
    desconto_percentual_esperado: 35,
    desconto_cupom_fixo: null,
    valor_minimo_compra: 0,
    codigo_cupom: 'MADRUGAFLY',
    selo_tag: 'VOOS_TERCA',
    descricao: 'Melhor horário para emitir passagens de terça para quarta na madrugada (faixa ideal: 28 a 35 dias antes do voo).',
    url_redirecionamento: 'https://www.google.com/travel/flights'
  },
  {
    id: 11,
    categoria: 'Passagens & Viagens',
    plataforma: 'Programas de Fidelidade',
    titulo: 'Bônus de Transferência de Milhas (Janeiro & Março)',
    dia_semana_gatilho: null,
    horario_gatilho: '10:00:00',
    duracao_minutos: 480,
    desconto_percentual_esperado: 50,
    desconto_cupom_fixo: null,
    valor_minimo_compra: 0,
    codigo_cupom: 'BONUS165',
    selo_tag: 'MILHAS',
    descricao: 'Aniversários de companhias (Gol 15/01, ClubeAzul 16/01, TAP 14/03) oferecem bônus de transferência de até 165%.',
    url_redirecionamento: 'https://www.esfera.com.br'
  },
  {
    id: 12,
    categoria: 'Passagens & Viagens',
    plataforma: 'Radar de Praias',
    titulo: 'Porto de Galinhas (Baixa Temporada Set-Nov)',
    dia_semana_gatilho: null,
    horario_gatilho: '08:00:00',
    duracao_minutos: 1440,
    desconto_percentual_esperado: 50,
    desconto_cupom_fixo: null,
    valor_minimo_compra: 0,
    codigo_cupom: 'PORTO50',
    selo_tag: 'PRAIA',
    descricao: 'Viaje a Porto de Galinhas entre setembro e novembro para sol firme, mar claro e 50% de economia em hospedagem.',
    url_redirecionamento: 'https://www.booking.com'
  },
  {
    id: 13,
    categoria: 'Passagens & Viagens',
    plataforma: 'Radar de Praias',
    titulo: 'Ubatuba Mês Sem Chuva (Maio Sol Garantido)',
    dia_semana_gatilho: null,
    horario_gatilho: '08:00:00',
    duracao_minutos: 1440,
    desconto_percentual_esperado: 40,
    desconto_cupom_fixo: null,
    valor_minimo_compra: 0,
    codigo_cupom: 'UBATUBA_MAY',
    selo_tag: 'SOL_SP',
    descricao: 'Maio é o mês menos chuvoso no litoral norte paulista. Garanta sol sem frentes frias e diárias baratas.',
    url_redirecionamento: 'https://www.airbnb.com.br'
  },

  // --- SUPERMERCADO & ABASTECIMENTO ---
  {
    id: 14,
    categoria: 'Supermercado & Abastecimento',
    plataforma: 'Supermercado Rio Branco',
    titulo: 'Campanha Fecha Mês Rio Branco (Araras/SP)',
    dia_semana_gatilho: null,
    horario_gatilho: '08:00:00',
    duracao_minutos: 1440,
    desconto_percentual_esperado: 25,
    desconto_cupom_fixo: null,
    valor_minimo_compra: 100,
    codigo_cupom: 'FECHAMES',
    selo_tag: 'ARARAS_SP',
    descricao: '🛒 ÚLTIMOS 5 DIAS DO MÊS: Descontos agressivos em cortes de carnes selecionados, mercearia, hortifruti e limpeza.',
    url_redirecionamento: 'https://www.facebook.com/smriobranco'
  }
];
