import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ChefHat, Plus, Package, Calculator, Weight, TrendingUp, Users, Clock } from "lucide-react";
import Link from "next/link";
import QueijosPage from "./(auth)/App/queijos/page";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-500 p-4 rounded-full">
                <ChefHat className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Bem-vindo ao <span className="text-yellow-600">Queijos Gestor</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Gerencie seus queijos, calcule rendimentos e otimize sua produção com facilidade
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/App/queijos">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer">
                  <Package className="h-5 w-5 mr-2" />
                  Ver Meus Queijos
                </Button>
              </Link>
              <Link href="/App/queijos/novoqueijo">
                <Button size="lg" variant="outline" className="cursor-pointer">
                  <Plus className="h-5 w-5 mr-2" />
                  Cadastrar Queijo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Funcionalidades Principais
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tudo que você precisa para gerenciar seus queijos de forma eficiente
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card className="hover:shadow-2xl transition-shadow">
            <CardHeader>
              <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Gestão de Queijos</CardTitle>
              <CardDescription>
                Cadastre e organize todos os seus tipos de queijo com informações detalhadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Cadastro de nome e propriedades</li>
                <li>• Peso por unidade</li>
                <li>• Unidades por peça</li>
                <li>• Histórico de criação</li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="hover:shadow-2xl transition-shadow">
            <CardHeader>
              <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Calculator className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Cálculo de Rendimento</CardTitle>
              <CardDescription>
                Calcule automaticamente o rendimento e peso total dos seus queijos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Peso total por peça</li>
                <li>• Conversão automática kg/g</li>
                <li>• Cálculos em tempo real</li>
                <li>• Otimização de produção</li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="hover:shadow-2xl transition-shadow">
            <CardHeader>
              <div className="bg-yellow-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <CardTitle className="text-xl">Estatísticas</CardTitle>
              <CardDescription>
                Acompanhe estatísticas detalhadas da sua produção de queijos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Total de queijos cadastrados</li>
                <li>• Peso médio por unidade</li>
                <li>• Rendimento médio</li>
                <li>• Relatórios visuais</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Seus Dados em Tempo Real
            </h2>
            <p className="text-gray-600">
              Acompanhe o crescimento da sua gestão de queijos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-gray-600">Queijos Cadastrados</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Weight className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-gray-600">Peso Médio</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Calculator className="h-8 w-8 text-yellow-600" />
                </div>
                <p className="text-gray-600">Rendimento Médio</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-gray-600">Último Acesso</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
            <p className="text-xl mb-8 opacity-90">
              Cadastre seu primeiro queijo e comece a otimizar sua produção hoje mesmo
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/App/queijos/novoqueijo">
                <Button size="lg" variant="secondary" className="bg-white text-yellow-600 hover:text-yellow-600 hover:bg-gray-100 cursor-pointer">
                  <Plus className="h-5 w-5 mr-2" />
                  Cadastrar Primeiro Queijo
                </Button>
              </Link>

              <Link href="/App/queijos">
                <Button size="lg" variant="outline" className="bg-white text-yellow-600 hover:text-yellow-600 hover:bg-gray-100 cursor-pointer">
                  <Package className="h-5 w-5 mr-2" />
                  Ver Lista de Queijos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
