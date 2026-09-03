import { Pool } from 'pg';
import { OfertaCronograma, PreferenciasUsuario, HistoricoEconomia } from '@/types';
import { OFERTAS_TELEMETRIA_INITIAL } from './telemetryData';

// Configuração do Pool de conexão local com PostgreSQL
const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'sniper_ofertas',
  password: process.env.PGPASSWORD || 'postgres',
  port: parseInt(process.env.PGPORT || '5432'),
  max: 10,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 2000,
});

export const queryDB = async (text: string, params?: any[]) => {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('[PostgreSQL] Query executada', { text: text.substring(0, 50), duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.warn('[PostgreSQL] Conexão indisponível, chaveando para fallback em memória:', (error as Error).message);
    return null;
  }
};

// Banco de dados em memória por usuário (fallback)
export interface UsuarioDB {
  id: number;
  nome: string;
  email: string;
  senha_hash: string;
}

let inMemoryUsuarios: UsuarioDB[] = [
  { id: 1, nome: 'Vinicius (Sniper Demo)', email: 'vinicius@sniper.com', senha_hash: '123456' },
  { id: 2, nome: 'Ana Paula (Moda & Viagens)', email: 'ana@sniper.com', senha_hash: '123456' },
];

let inMemoryOfertas: OfertaCronograma[] = [...OFERTAS_TELEMETRIA_INITIAL];
let inMemoryEconomia: HistoricoEconomia[] = [];
let inMemoryPreferenciasMap: Record<number, PreferenciasUsuario> = {
  1: {
    usuario_id: 1,
    categorias_focadas: ['Tecnologia & Informática', 'Moda & Vestuário', 'Passagens & Viagens', 'Supermercado & Abastecimento'],
    max_alertas_por_dia: 5,
    push_ativado: true,
  },
  2: {
    usuario_id: 2,
    categorias_focadas: ['Moda & Vestuário', 'Passagens & Viagens'],
    max_alertas_por_dia: 3,
    push_ativado: true,
  },
};

/**
 * Autentica usuário via e-mail e senha
 */
export async function autenticarUsuario(email: string, senhaHash: string): Promise<{ id: number; nome: string; email: string } | null> {
  const res = await queryDB('SELECT id, nome, email FROM public.usuarios WHERE email = $1 AND senha_hash = $2', [email, senhaHash]);
  if (res && res.rows && res.rows[0]) {
    return res.rows[0];
  }
  const user = inMemoryUsuarios.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.senha_hash === senhaHash);
  if (user) {
    return { id: user.id, nome: user.nome, email: user.email };
  }
  return null;
}

/**
 * Cadastra um novo usuário
 */
export async function criarUsuario(nome: string, email: string, senhaHash: string): Promise<{ id: number; nome: string; email: string }> {
  const resDB = await queryDB(
    'INSERT INTO public.usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email',
    [nome, email, senhaHash]
  );
  if (resDB && resDB.rows && resDB.rows[0]) {
    const newUser = resDB.rows[0];
    await queryDB('INSERT INTO public.preferencias_usuario (usuario_id) VALUES ($1) ON CONFLICT DO NOTHING', [newUser.id]);
    return newUser;
  }

  const novoId = inMemoryUsuarios.length + 1;
  const novoUser = { id: novoId, nome, email, senha_hash: senhaHash };
  inMemoryUsuarios.push(novoUser);
  inMemoryPreferenciasMap[novoId] = {
    usuario_id: novoId,
    categorias_focadas: ['Tecnologia & Informática', 'Moda & Vestuário', 'Passagens & Viagens', 'Supermercado & Abastecimento'],
    max_alertas_por_dia: 5,
    push_ativado: true,
  };
  return { id: novoId, nome, email };
}

/**
 * Retorna ofertas filtradas
 */
export async function getOfertas(categoriasFocadas?: string[]): Promise<OfertaCronograma[]> {
  const result = await queryDB('SELECT * FROM public.cronograma_ofertas ORDER BY horario_gatilho ASC');
  let lista: OfertaCronograma[] = [];

  if (result && result.rows && result.rows.length > 0) {
    lista = result.rows;
  } else {
    lista = inMemoryOfertas;
  }

  if (categoriasFocadas && categoriasFocadas.length > 0) {
    return lista.filter((o) =>
      categoriasFocadas.some(
        (cat) => o.categoria.toLowerCase().includes(cat.toLowerCase()) || cat.toLowerCase().includes(o.categoria.toLowerCase())
      )
    );
  }

  return lista;
}

export async function addOferta(novaOferta: Omit<OfertaCronograma, 'id'>): Promise<OfertaCronograma> {
  const sql = `
    INSERT INTO public.cronograma_ofertas
    (categoria, plataforma, titulo, dia_semana_gatilho, horario_gatilho, duracao_minutos, desconto_percentual_esperado, desconto_cupom_fixo, valor_minimo_compra, codigo_cupom, selo_tag, descricao, url_redirecionamento)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *;
  `;
  const params = [
    novaOferta.categoria,
    novaOferta.plataforma,
    novaOferta.titulo,
    novaOferta.dia_semana_gatilho ?? null,
    novaOferta.horario_gatilho,
    novaOferta.duracao_minutos || 60,
    novaOferta.desconto_percentual_esperado ?? null,
    novaOferta.desconto_cupom_fixo ?? null,
    novaOferta.valor_minimo_compra || 0,
    novaOferta.codigo_cupom ?? null,
    novaOferta.selo_tag ?? 'MCP',
    novaOferta.descricao,
    novaOferta.url_redirecionamento || 'https://www.google.com',
  ];

  const dbRes = await queryDB(sql, params);
  if (dbRes && dbRes.rows && dbRes.rows[0]) {
    return dbRes.rows[0];
  }

  const itemMemoria: OfertaCronograma = {
    id: inMemoryOfertas.length + 1,
    ...novaOferta,
  };
  inMemoryOfertas.unshift(itemMemoria);
  return itemMemoria;
}

/**
 * Busca histórico de economia específico do usuário
 */
export async function getHistoricoEconomia(usuarioId: number = 1): Promise<HistoricoEconomia[]> {
  const res = await queryDB('SELECT * FROM public.historico_economia WHERE usuario_id = $1 ORDER BY registrado_em DESC', [usuarioId]);
  if (res && res.rows) {
    return res.rows;
  }
  return inMemoryEconomia.filter((e) => e.usuario_id === usuarioId);
}

/**
 * Salva novo registro de economia para o usuário logado
 */
export async function salvarEconomia(item: Omit<HistoricoEconomia, 'id' | 'valor_economizado'>): Promise<HistoricoEconomia> {
  const uId = item.usuario_id || 1;
  const valorEconomizado = item.preco_original - item.preco_final;
  const sql = `
    INSERT INTO public.historico_economia
    (usuario_id, nome_produto, categoria, preco_original, preco_final, plataforma)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const res = await queryDB(sql, [uId, item.nome_produto, item.categoria, item.preco_original, item.preco_final, item.plataforma]);

  if (res && res.rows && res.rows[0]) {
    return res.rows[0];
  }

  const itemMemoria: HistoricoEconomia = {
    id: inMemoryEconomia.length + 1,
    ...item,
    usuario_id: uId,
    valor_economizado: valorEconomizado,
    registrado_em: new Date().toISOString(),
  };
  inMemoryEconomia.unshift(itemMemoria);
  return itemMemoria;
}

/**
 * Busca preferências específicas do usuário logado
 */
export async function getPreferenciasUsuario(usuarioId: number = 1): Promise<PreferenciasUsuario> {
  const res = await queryDB('SELECT * FROM public.preferencias_usuario WHERE usuario_id = $1', [usuarioId]);
  if (res && res.rows && res.rows[0]) {
    return res.rows[0];
  }
  if (inMemoryPreferenciasMap[usuarioId]) {
    return inMemoryPreferenciasMap[usuarioId];
  }
  return {
    usuario_id: usuarioId,
    categorias_focadas: ['Tecnologia & Informática', 'Moda & Vestuário', 'Passagens & Viagens', 'Supermercado & Abastecimento'],
    max_alertas_por_dia: 5,
    push_ativado: true,
  };
}

/**
 * Salva preferências do usuário logado
 */
export async function salvarPreferenciasUsuario(pref: PreferenciasUsuario): Promise<PreferenciasUsuario> {
  const uId = pref.usuario_id || 1;
  const sql = `
    INSERT INTO public.preferencias_usuario (usuario_id, categorias_focadas, max_alertas_por_dia, push_ativado)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (usuario_id) DO UPDATE
    SET categorias_focadas = EXCLUDED.categorias_focadas,
        max_alertas_por_dia = EXCLUDED.max_alertas_por_dia,
        push_ativado = EXCLUDED.push_ativado,
        atualizado_em = CURRENT_TIMESTAMP
    RETURNING *;
  `;
  const res = await queryDB(sql, [uId, JSON.stringify(pref.categorias_focadas), pref.max_alertas_por_dia, pref.push_ativado]);

  if (res && res.rows && res.rows[0]) {
    return res.rows[0];
  }

  inMemoryPreferenciasMap[uId] = { ...pref, usuario_id: uId };
  return inMemoryPreferenciasMap[uId];
}
