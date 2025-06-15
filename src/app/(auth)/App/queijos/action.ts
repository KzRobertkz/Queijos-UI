"use server"

import { createClient } from "../../../../../utils/supabase/server";
import { revalidatePath } from "next/cache";

// Tipo para o retorno das actions
type ActionResult = {
  success: boolean;
  message: string;
  data?: any;
}

// Action para excluir queijo
export async function deleteQueijoAction(queijoId: string): Promise<ActionResult> {
  const supabase = await createClient();

  try {
    // Verificar autenticação
    const { data: authUser, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser?.user) {
      return {
        success: false,
        message: "Usuário não autenticado"
      };
    }

    // Verificar se o queijo pertence ao usuário antes de excluir
    const { data: queijo, error: fetchError } = await supabase
      .from("queijos")
      .select("user_id")
      .eq("id", queijoId)
      .single();

    if (fetchError || !queijo) {
      return {
        success: false,
        message: "Queijo não encontrado"
      };
    }

    if (queijo.user_id !== authUser.user.id) {
      return {
        success: false,
        message: "Você não tem permissão para excluir este queijo"
      };
    }

    // Excluir o queijo
    const { error: deleteError } = await supabase
      .from("queijos")
      .delete()
      .eq("id", queijoId);

    if (deleteError) {
      console.error("Erro ao excluir queijo:", deleteError);
      return {
        success: false,
        message: "Erro ao excluir queijo"
      };
    }

    // Revalidar a página
    revalidatePath("/dashboard/queijos");

    return {
      success: true,
      message: "Queijo excluído com sucesso!"
    };

  } catch (error) {
    console.error("Erro inesperado:", error);
    return {
      success: false,
      message: "Ocorreu um erro inesperado"
    };
  }
}

// Action para atualizar queijo
export async function updateQueijoAction(
  queijoId: string, 
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();

  try {
    // Verificar autenticação
    const { data: authUser, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser?.user) {
      return {
        success: false,
        message: "Usuário não autenticado"
      };
    }

    // Extrair dados do FormData
    const name = formData.get("name")?.toString();
    const pesoUnidade = formData.get("pesoUnidade")?.toString();
    const unidadesPorPeca = formData.get("unidadesPorPeca")?.toString();

    // Validação
    if (!name?.trim()) {
      return {
        success: false,
        message: "Nome do queijo é obrigatório"
      };
    }

    if (!pesoUnidade || Number(pesoUnidade) <= 0) {
      return {
        success: false,
        message: "Peso por unidade deve ser maior que 0"
      };
    }

    if (!unidadesPorPeca || Number(unidadesPorPeca) <= 0) {
      return {
        success: false,
        message: "Unidades por peça deve ser maior que 0"
      };
    }

    // Verificar se o queijo pertence ao usuário
    const { data: queijo, error: fetchError } = await supabase
      .from("queijos")
      .select("user_id")
      .eq("id", queijoId)
      .single();

    if (fetchError || !queijo) {
      return {
        success: false,
        message: "Queijo não encontrado"
      };
    }

    if (queijo.user_id !== authUser.user.id) {
      return {
        success: false,
        message: "Você não tem permissão para editar este queijo"
      };
    }

    // Atualizar o queijo
    const { data: updatedQueijo, error: updateError } = await supabase
      .from("queijos")
      .update({
        name: name.trim(),
        peso_unidade: Number(pesoUnidade),
        unidades_por_peca: Number(unidadesPorPeca),
        updated_at: new Date().toISOString()
      })
      .eq("id", queijoId)
      .select()
      .single();

    if (updateError) {
      console.error("Erro ao atualizar queijo:", updateError);
      return {
        success: false,
        message: "Erro ao atualizar queijo"
      };
    }

    // Revalidar a página
    revalidatePath("/dashboard/queijos");

    return {
      success: true,
      message: "Queijo atualizado com sucesso!",
      data: updatedQueijo
    };

  } catch (error) {
    console.error("Erro inesperado:", error);
    return {
      success: false,
      message: "Ocorreu um erro inesperado"
    };
  }
}

// Action para buscar um queijo específico (para edição)
export async function getQueijoByIdAction(queijoId: string): Promise<ActionResult> {
  const supabase = await createClient();

  try {
    // Verificar autenticação
    const { data: authUser, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser?.user) {
      return {
        success: false,
        message: "Usuário não autenticado"
      };
    }

    // Buscar o queijo
    const { data: queijo, error: fetchError } = await supabase
      .from("queijos")
      .select("*")
      .eq("id", queijoId)
      .eq("user_id", authUser.user.id)
      .single();

    if (fetchError || !queijo) {
      return {
        success: false,
        message: "Queijo não encontrado"
      };
    }

    return {
      success: true,
      message: "Queijo encontrado",
      data: queijo
    };

  } catch (error) {
    console.error("Erro inesperado:", error);
    return {
      success: false,
      message: "Ocorreu um erro inesperado"
    };
  }
}