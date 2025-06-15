// app/(auth)/login/actions.ts
"use server";

import { createClient } from "../../../../utils/supabase/server";
import { redirect } from "next/navigation";

export interface LoginState {
  success: boolean | null;
  message: string;
}

export async function login(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string;

  if (!email) {
    return {
      success: false,
      message: "E-mail é obrigatório"
    };
  }

  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Redireciona para /App/queijos após o login
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}`
      }
    });

    if (error) {
      console.error("Erro no login:", error);
      return {
        success: false,
        message: error.message
      };
    }

    return {
      success: true,
      message: "Link de login enviado com sucesso!"
    };
  } catch (error) {
    console.error("Erro inesperado:", error);
    return {
      success: false,
      message: "Erro interno do servidor"
    };
  }
}

// Função para lidar com o callback do Supabase
export async function handleAuthCallback() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect("/login");
  }
  
  // Redireciona para a página de queijos após login bem-sucedido
  redirect("/App/queijos");
}