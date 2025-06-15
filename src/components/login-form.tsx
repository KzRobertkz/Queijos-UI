"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { useActionState } from "react"
import { login, LoginState } from "@/app/(auth)/login/actions"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { MessageCircle, Loader, ChefHat, Mail, Sparkles } from "lucide-react"

export const LoginForm = () => {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {
      success: null,
      message: ""
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-16 h-16 bg-orange-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-amber-200 rounded-full opacity-20 animate-pulse delay-500"></div>

      <div className="relative w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-4 shadow-xl">
            <ChefHat className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Queijos Gestor
          </h1>
          <p className="text-gray-600 flex items-center justify-center gap-1">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            Gerencie seus queijos com facilidade
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Bem-vindo de volta!
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Digite seu e-mail para receber um link de acesso seguro
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form action={formAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Endereço de E-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-3.5 h-6 text-gray-400" />
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="seu.email@exemplo.com"
                    className="pl-10 h-12 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500"
                    disabled={pending}
                  />
                </div>
              </div>

              {/* Success Alert */}
              {state.success === true && (
                <Alert className="border-green-200 bg-green-50">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800 font-semibold">
                    🎉 E-mail enviado com sucesso!
                  </AlertTitle>
                  <AlertDescription className="text-green-700">
                    Confira sua caixa de entrada e clique no link para acessar sua conta.
                  </AlertDescription>
                </Alert>
              )}

              {/* Error Alert */}
              {state.success === false && (
                <Alert className="border-red-200 bg-red-50">
                  <MessageCircle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800 font-semibold">
                    ❌ Ops! Algo deu errado
                  </AlertTitle>
                  <AlertDescription className="text-red-700">
                    Não foi possível enviar o e-mail. Verifique se o endereço está correto e tente novamente.
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                disabled={pending}
              >
                {pending ? (
                  <div className="flex items-center gap-2">
                    <Loader className="animate-spin h-4 w-4" />
                    Enviando link...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Receber Link de Acesso
                  </div>
                )}
              </Button>
            </form>

            {/* Footer Info */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                Ao fazer login, você concorda com nossos termos de uso. <br />
                O link de acesso é válido por 1 hora e pode ser usado apenas uma vez.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            🔐 Login seguro sem senhas • 📧 Acesso via e-mail • ⚡ Rápido e prático
          </p>
        </div>
      </div>
    </div>
  )
}