'use server'

import { createClient } from '../../../../utils/supabase/server'
import { redirect } from 'next/navigation'

export async function logout() {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error("Erro ao fazer logout:", error)
    throw new Error("Erro ao sair da conta")
  }
  
  redirect('/login')
}