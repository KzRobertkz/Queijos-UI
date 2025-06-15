import { createClient } from "../../../../utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface ResultadoRendimento {
  queijo_id: string;
  queijo_name: string;
  tipo_calculo: string;
  peso_unidade: number;
  unidades_por_peca: number;
  // Campos específicos por tipo de cálculo
  qts_unidades?: number;
  qts_pecas?: number;
  qts_total?: number;
  qts_sobra?: number;
  qts_cortar?: number;
  tipo_sobra?: string;
  // Resultados
  resultado_pecas?: number;
  resultado_unidades?: number;
  resultado_peso_total?: number;
  observacoes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verificar autenticação
    const { data: authUser, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser?.user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Processar dados do formulário
    const formData = await request.formData();
    const queijo_id = formData.get("queijo_id") as string;
    const tipo_calculo = formData.get("tipo_calculo") as string;

    // Buscar dados do queijo
    const { data: queijo, error: queijoError } = await supabase
      .from("queijos")
      .select("*")
      .eq("id", queijo_id)
      .eq("user_id", authUser.user.id)
      .single();

    if (queijoError || !queijo) {
      return NextResponse.json({ error: "Queijo não encontrado" }, { status: 404 });
    }

    let resultado: ResultadoRendimento = {
      queijo_id,
      queijo_name: queijo.name,
      tipo_calculo,
      peso_unidade: queijo.peso_unidade,
      unidades_por_peca: queijo.unidades_por_peca,
    };

    // Realizar cálculos baseados no tipo
    switch (tipo_calculo) {
      case "financeiro": { // Rendimento por Unidade
        const qts_unidades = parseInt(formData.get("qts_un") as string);
        const resultado_pecas = qts_unidades / queijo.unidades_por_peca;
        const resultado_peso_total = qts_unidades * queijo.peso_unidade;

        resultado = {
          ...resultado,
          qts_unidades,
          resultado_pecas,
          resultado_peso_total,
          observacoes: `Com ${qts_unidades} unidades, você consegue formar ${resultado_pecas.toFixed(2)} peças completas.`
        };
        break;
      }

      case "aproveitamento": { // Rendimento por Peça
        const qts_pecas = parseInt(formData.get("qts_pecas") as string);
        const resultado_unidades = qts_pecas * queijo.unidades_por_peca;
        const resultado_peso_total = resultado_unidades * queijo.peso_unidade;

        resultado = {
          ...resultado,
          qts_pecas,
          resultado_unidades,
          resultado_peso_total,
          observacoes: `Com ${qts_pecas} peças, você tem ${resultado_unidades} unidades disponíveis.`
        };
        break;
      }

      case "producao": { // Rendimento com Sobra
        const tipo_sobra = formData.get("tipo_sobra") as string;
        const qts_total = parseInt(formData.get("qts_total") as string);
        const qts_sobra = parseInt(formData.get("qts_sobra") as string);
        const qts_cortar = parseInt(formData.get("qts_cortar") as string);

        let resultado_unidades = 0;
        let resultado_pecas = 0;
        let observacoes = "";

        if (tipo_sobra === "unidades") {
          // Sobra em unidades: (Total - Sobra - Cortar) / unidades_por_peça
          const unidades_restantes = qts_total - qts_sobra - qts_cortar;
          resultado_pecas = unidades_restantes / queijo.unidades_por_peca;
          resultado_unidades = unidades_restantes;
          
          observacoes = `Após usar ${qts_cortar} unidades das ${qts_total} disponíveis (sobra: ${qts_sobra}), restam ${unidades_restantes} unidades, formando ${resultado_pecas.toFixed(2)} peças.`;
        } else {
          // Sobra em peças: (Sobra_peças × unidades_por_peça) - Cortar
          const unidades_da_sobra = qts_sobra * queijo.unidades_por_peca;
          resultado_unidades = unidades_da_sobra - qts_cortar;
          resultado_pecas = resultado_unidades / queijo.unidades_por_peca;
          
          observacoes = `Com ${qts_sobra} peças de sobra (${unidades_da_sobra} unidades) e cortando ${qts_cortar} unidades, restam ${resultado_unidades} unidades, formando ${resultado_pecas.toFixed(2)} peças.`;
        }

        const resultado_peso_total = resultado_unidades * queijo.peso_unidade;

        resultado = {
          ...resultado,
          qts_total,
          qts_sobra,
          qts_cortar,
          tipo_sobra,
          resultado_unidades,
          resultado_pecas,
          resultado_peso_total,
          observacoes
        };
        break;
      }

      default:
        return NextResponse.json({ error: "Tipo de cálculo inválido" }, { status: 400 });
    }

    // Salvar resultado no banco (opcional - criar tabela para histórico)
    const { error: insertError } = await supabase
      .from("calculos_rendimento")
      .insert({
        user_id: authUser.user.id,
        queijo_id,
        tipo_calculo,
        dados_input: {
          qts_unidades: resultado.qts_unidades,
          qts_pecas: resultado.qts_pecas,
          qts_total: resultado.qts_total,
          qts_sobra: resultado.qts_sobra,
          qts_cortar: resultado.qts_cortar,
          tipo_sobra: resultado.tipo_sobra,
        },
        resultado_pecas: resultado.resultado_pecas,
        resultado_unidades: resultado.resultado_unidades,
        resultado_peso_total: resultado.resultado_peso_total,
        observacoes: resultado.observacoes,
        created_at: new Date().toISOString(),
      });

    // Se erro ao salvar, continuar (não é crítico)
    if (insertError) {
      console.warn("Erro ao salvar cálculo de rendimento:", insertError);
    }

    // Redirecionar para página de resultado
    const params = new URLSearchParams({
      resultado: JSON.stringify(resultado)
    });

    return NextResponse.redirect(
      new URL(`/App/queijos/${queijo_id}/resultado-rendimento?${params.toString()}`, request.url)
    );

  } catch (error) {
    console.error("Erro ao processar cálculo de rendimento:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}