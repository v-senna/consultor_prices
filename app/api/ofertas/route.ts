import { NextResponse } from 'next/server';
import { getOfertas, getPreferenciasUsuario } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const catQuery = searchParams.get('categoria');

    const pref = await getPreferenciasUsuario(1);
    const categoriasFiltro = catQuery ? [catQuery] : pref.categorias_focadas;

    const ofertas = await getOfertas(categoriasFiltro);

    // Calcular se a oferta está ativa neste momento
    const agora = new Date();
    const diaAtual = agora.getDay(); // 0 = Domingo, 1 = Segunda, etc.
    const horaAtualStr = agora.toTimeString().split(' ')[0]; // "HH:MM:SS"

    const ofertasComStatus = ofertas.map(of => {
      let ativo = false;
      
      // Se tem dia_semana_gatilho especificado, compara
      if (of.dia_semana_gatilho !== null && of.dia_semana_gatilho !== undefined) {
        if (of.dia_semana_gatilho === diaAtual) {
          ativo = true;
        }
      } else {
        // Se não tem dia específico, consideramos ativo se estiver na janela
        ativo = true;
      }

      return {
        ...of,
        ativo_agora: ativo,
      };
    });

    return NextResponse.json({
      success: true,
      timestamp: agora.toISOString(),
      dia_semana: diaAtual,
      hora_local: horaAtualStr,
      total: ofertasComStatus.length,
      ofertas: ofertasComStatus,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
