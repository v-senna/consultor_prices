import { NextResponse } from 'next/server';
import { addOferta } from '@/lib/db';
import { MCPPayload } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Aceita tanto objeto único quanto array de novas ofertas via MCP
    const itensParaProcessar: MCPPayload[] = Array.isArray(body) ? body : [body];
    const ofertasInseridas = [];

    for (const item of itensParaProcessar) {
      if (!item.categoria || !item.plataforma || !item.titulo || !item.horario_gatilho) {
        return NextResponse.json(
          {
            success: false,
            error: 'Campos obrigatórios ausentes. Requer: categoria, plataforma, titulo, horario_gatilho.',
          },
          { status: 400 }
        );
      }

      const novaOferta = await addOferta({
        categoria: item.categoria,
        plataforma: item.plataforma,
        titulo: item.titulo,
        dia_semana_gatilho: item.dia_semana_gatilho ?? null,
        horario_gatilho: item.horario_gatilho,
        duracao_minutos: item.duracao_minutos || 60,
        desconto_percentual_esperado: item.desconto_percentual_esperado ?? null,
        desconto_cupom_fixo: item.desconto_cupom_fixo ?? null,
        valor_minimo_compra: item.valor_minimo_compra || 0,
        codigo_cupom: item.codigo_cupom ?? null,
        selo_tag: item.selo_tag || 'MCP_INGESTED',
        descricao: item.descricao || 'Regra de oferta atualizada via protocolo MCP.',
        url_redirecionamento: item.url_redirecionamento || 'https://www.mercadolivre.com.br',
      });

      ofertasInseridas.push(novaOferta);
    }

    return NextResponse.json({
      success: true,
      protocol: 'MCP/1.0',
      message: `${ofertasInseridas.length} regra(s) de agendamento de oferta processada(s) com sucesso.`,
      data: ofertasInseridas,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'Sniper de Ofertas MCP Ingestion API',
    version: '1.0.0',
    protocol: 'MCP/1.0',
    description: 'Endpoint REST preparado para receber agendamentos e regras dinâmicas de e-commerce.',
    endpoints: {
      post_offers: '/api/mcp/v1/offers',
    },
  });
}
