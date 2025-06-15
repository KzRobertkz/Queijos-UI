"use server"

import { createClient } from "../../../../../../utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Tipo para o retorno da action
type ActionResult = {
  success: boolean;
  message: string;
  data?: any;
}

export async function createQueijoAction(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

  try {
    // Verificar se o usuário está autenticado
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

    // Validação dos dados
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

    // Inserir no Supabase
    const { data: queijo, error: insertError } = await supabase
      .from("queijos")
      .insert({
        name: name.trim(),
        peso_unidade: Number(pesoUnidade),
        unidades_por_peca: Number(unidadesPorPeca),
        user_id: authUser.user.id
      })
      .select()
      .single();

    if (insertError) {
      console.error("Erro ao inserir queijo:", insertError);
      return {
        success: false,
        message: "Erro ao criar queijo no banco de dados"
      };
    }

    // Revalidar a página/cache para mostrar os novos dados
    revalidatePath("/App/queijos/novoqueijo"); // Ajuste o path conforme sua estrutura

    return {
      success: true,
      message: "Queijo criado com sucesso!",
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

// Versão alternativa usando redirect em caso de sucesso
export async function createQueijoActionWithRedirect(formData: FormData) {
  const result = await createQueijoAction(formData);
  
  if (result.success) {
    // Redirecionar para página de listagem ou dashboard
    redirect("/App/queijos");
  }
  
  return result;
}