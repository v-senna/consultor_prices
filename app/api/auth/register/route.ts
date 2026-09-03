import { NextResponse } from 'next/server';
import { criarUsuario } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, senha } = body;

    if (!nome || !email || !senha) {
      return NextResponse.json(
        { success: false, error: 'Nome, e-mail e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    const novoUsuario = await criarUsuario(nome, email, senha);

    return NextResponse.json({
      success: true,
      usuario: novoUsuario,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
