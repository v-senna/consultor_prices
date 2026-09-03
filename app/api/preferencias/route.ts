import { NextResponse } from 'next/server';
import { getPreferenciasUsuario, salvarPreferenciasUsuario } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdHeader = request.headers.get('x-user-id');
    const userId = parseInt(userIdHeader || searchParams.get('usuario_id') || '1');

    const pref = await getPreferenciasUsuario(userId);
    return NextResponse.json({
      success: true,
      data: pref,
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
    const { usuario_id, categorias_focadas, max_alertas_por_dia, push_ativado } = body;

    const userId = parseInt(userIdHeader || String(usuario_id) || '1');

    const atualizado = await salvarPreferenciasUsuario({
      usuario_id: userId,
      categorias_focadas: categorias_focadas || ['Tecnologia & Informática', 'Moda & Vestuário'],
      max_alertas_por_dia: max_alertas_por_dia || 5,
      push_ativado: push_ativado ?? true,
    });

    return NextResponse.json({
      success: true,
      data: atualizado,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
