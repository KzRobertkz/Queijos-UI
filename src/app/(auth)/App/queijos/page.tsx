import { createClient } from "../../../../../utils/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Plus, Package, Weight, Calculator } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

// Tipo para o queijo
interface Queijo {
  id: string;
  name: string;
  peso_unidade: number;
  unidades_por_peca: number;
  created_at: string;
  updated_at: string;
}

// Função para buscar os queijos do usuário
async function getQueijos(): Promise<Queijo[]> {
  const supabase = await createClient();

  // Verificar autenticação
  const { data: authUser, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser?.user) {
    redirect("/login");
  }

  // Buscar queijos do usuário
  const { data: queijos, error } = await supabase
    .from("queijos")
    .select("*")
    .eq("user_id", authUser.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar queijos:", error);
    return [];
  }

  return queijos || [];
}

// Função para formatar a data
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Função para calcular peso total por peça
function calcularPesoTotal(pesoUnidade: number, unidadesPorPeca: number): number {
  return pesoUnidade * unidadesPorPeca;
}

export default async function QueijosPage() {
  const queijos = await getQueijos();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Queijos</h1>
          <p className="text-gray-600 mt-2">
            Gerencie seus tipos de queijo e suas propriedades
          </p>
        </div>
        <Link href="/App/queijos/novoqueijo">
          <Button className="flex items-center gap-2 cursor-pointer">
            <Plus className="h-4 w-4" />
            Novo Queijo
          </Button>
        </Link>
      </div>

      {/* Lista de Queijos */}
      {queijos.length === 0 ? (
        /* Estado vazio */
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Nenhum queijo cadastrado
              </h3>
              <p className="text-gray-500 mt-1">
                Comece cadastrando seu primeiro tipo de queijo
              </p>
            </div>
            <Link href="/App/queijos/novoqueijo">
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Queijo
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        /* Grid de queijos */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {queijos.map((queijo) => (
            <Card key={queijo.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-gray-900">
                    {queijo.name}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    ID: {queijo.id.slice(0, 8)}...
                  </Badge>
                </div>
                <CardDescription className="text-sm text-gray-500">
                  Cadastrado em {formatDate(queijo.created_at)}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Propriedades do queijo */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Peso por unidade */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Weight className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-600">
                        Peso/Unidade
                      </span>
                    </div>
                    <p className="text-lg font-bold text-blue-900">
                      {queijo.peso_unidade}g
                    </p>
                  </div>

                  {/* Unidades por peça */}
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-medium text-green-600">
                        Unidades/Peça
                      </span>
                    </div>
                    <p className="text-lg font-bold text-green-900">
                      {queijo.unidades_por_peca}
                    </p>
                  </div>
                </div>

                {/* Cálculo do peso total */}
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Calculator className="h-4 w-4 text-yellow-600" />
                    <span className="text-xs font-medium text-yellow-600">
                      Peso Total/Peça
                    </span>
                  </div>
                  <p className="text-xl font-bold text-yellow-900">
                    {calcularPesoTotal(queijo.peso_unidade, queijo.unidades_por_peca).toLocaleString()}g
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    ({(calcularPesoTotal(queijo.peso_unidade, queijo.unidades_por_peca) / 1000).toFixed(2)}kg)
                  </p>
                </div>

                {/* Ações */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex flex-col space-y-2">
                    <Link href={`/App/queijos/${queijo.id}/calcular-rendimento`}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full cursor-pointer"
                      >
                        Calcular Rendimento
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 cursor-pointer"
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                  >
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Estatísticas resumidas */}
      {queijos.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total de Queijos</p>
                  <p className="text-2xl font-bold">{queijos.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Peso Médio/Unidade</p>
                  <p className="text-2xl font-bold">
                    {Math.round(
                      queijos.reduce((acc, q) => acc + q.peso_unidade, 0) / queijos.length
                    )}g
                  </p>
                </div>
                <Weight className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Rendimento Médio</p>
                  <p className="text-2xl font-bold">
                    {Math.round(
                      queijos.reduce((acc, q) => acc + q.unidades_por_peca, 0) / queijos.length
                    )}
                  </p>
                </div>
                <Calculator className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}