import { NextResponse } from 'next/server';
import { getHistoricoEconomia, salvarEconomia } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdHeader = request.headers.get('x-user-id');
    const userId = parseInt(userIdHeader || searchParams.get('usuario_id') || '1');

    const historico = await getHistoricoEconomia(userId);
    const totalEconomizado = historico.reduce((acc, item) => acc + Number(item.valor_economizado || 0), 0);

    return NextResponse.json({
      success: true,
      usuario_id: userId,
      total_economizado: totalEconomizado,
      historico,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userIdHeader = request.headers.get('x-user-id');
    const { usuario_id, nome_produto, categoria, preco_original, preco_final, plataforma } = body;

    const userId = parseInt(userIdHeader || String(usuario_id) || '1');

    if (!nome_produto || !preco_original || !preco_final) {
      return NextResponse.json(
        { success: false, error: 'Campos nome_produto, preco_original e preco_final são obrigatórios.' },
        { status: 400 }
      );
    }

    const registro = await salvarEconomia({
      usuario_id: userId,
      nome_produto,
      categoria: categoria || 'Geral',
      preco_original: Number(preco_original),
      preco_final: Number(preco_final),
      plataforma: plataforma || 'Sniper de Ofertas',
    });

    return NextResponse.json({
      success: true,
      data: registro,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
