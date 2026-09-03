export type CategoriaOferta = 
  | 'Tecnologia & Informática' 
  | 'Moda & Vestuário' 
  | 'Passagens & Viagens' 
  | 'Supermercado & Abastecimento';

export interface OfertaCronograma {
  id: number;
  categoria: CategoriaOferta | string;
  plataforma: string;
  titulo: string;
  dia_semana_gatilho?: number | null; // 0 = Domingo, 1 = Segunda, etc.
  horario_gatilho: string; // "HH:MM:SS" ou "HH:MM"
  duracao_minutos: number;
  desconto_percentual_esperado?: number | null;
  desconto_cupom_fixo?: number | null;
  valor_minimo_compra?: number | null;
  codigo_cupom?: string | null;
  selo_tag?: string | null;
  data_especifica?: string | null;
  descricao: string;
  url_redirecionamento?: string | null;
  ativo_agora?: boolean;
}

export interface PreferenciasUsuario {
  usuario_id: number;
  categorias_focadas: string[];
  max_alertas_por_dia: number;
  push_ativado: boolean;
  atualizado_em?: string;
}

export interface HistoricoEconomia {
  id?: number;
  usuario_id: number;
  nome_produto: string;
  categoria: string;
  preco_original: number;
  preco_final: number;
  valor_economizado: number;
  plataforma: string;
  registrado_em?: string;
}

export interface SimulacaoROIInput {
  categoria: string;
  nome_produto: string;
  preco_base: number;
  desconto_percentual: number;
  cupom_fixo: number;
  cashback_percentual: number;
}

export interface SimulacaoROIResultado {
  preco_base: number;
  desconto_porcentagem_total: number;
  economia_total_reais: number;
  preco_final_com_desconto: number;
  narrativa_combo: string;
  selo_combo: string;
}

export interface MCPPayload {
  categoria: string;
  plataforma: string;
  titulo: string;
  dia_semana_gatilho?: number;
  horario_gatilho: string;
  duracao_minutos?: number;
  desconto_percentual_esperado?: number;
  desconto_cupom_fixo?: number;
  valor_minimo_compra?: number;
  codigo_cupom?: string;
  selo_tag?: string;
  descricao: string;
  url_redirecionamento?: string;
}
