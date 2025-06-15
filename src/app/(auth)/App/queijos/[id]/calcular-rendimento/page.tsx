'use client';

import { useState, useEffect, use } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../../components/ui/card";
import { Button } from "../../../../../../components/ui/button";
import { Input } from "../../../../../../components/ui/input";
import { Label } from "../../../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../components/ui/select";
import { ArrowLeft, Calculator, Package, Weight, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../../../../utils/supabase/client";
import { useRouter } from "next/navigation";

interface Queijo {
  id: string;
  name: string;
  peso_unidade: number;
  unidades_por_peca: number;
  created_at: string;
  updated_at: string;
}

interface CalcularRendimentoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CalcularRendimentoPage({ params }: CalcularRendimentoPageProps) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  
  const [queijo, setQueijo] = useState<Queijo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tipoCalculo, setTipoCalculo] = useState<string>("");
  const [resultado, setResultado] = useState<any>(null);
  const router = useRouter();

  // Buscar dados do queijo
  useEffect(() => {
    async function fetchQueijo() {
      try {
        const supabase = createClient();
        
        // Verificar autenticação
        const { data: authUser, error: authError } = await supabase.auth.getUser();
        
        if (authError || !authUser?.user) {
          router.push("/login");
          return;
        }

        // Buscar o queijo específico
        const { data: queijoData, error: queijoError } = await supabase
          .from("queijos")
          .select("*")
          .eq("id", resolvedParams.id)
          .eq("user_id", authUser.user.id)
          .single();

        if (queijoError) {
          console.error("Erro ao buscar queijo:", queijoError);
          setError("Queijo não encontrado ou você não tem permissão para acessá-lo.");
          return;
        }

        setQueijo(queijoData);
      } catch (err) {
        console.error("Erro:", err);
        setError("Erro inesperado ao buscar informações do queijo.");
      } finally {
        setLoading(false);
      }
    }

    fetchQueijo();
  }, [resolvedParams.id, router]);

  const calcularRendimento = (formData: FormData) => {
    const tipo = formData.get('tipo_calculo') as string;
    
    // Verificação de segurança
    if (!queijo || !queijo.unidades_por_peca) {
      console.error('Dados do queijo inválidos');
      return;
    }
    
    switch (tipo) {
      case "financeiro": // Rendimento por Unidade
        const unidades = Number(formData.get('qts_un'));
        const pecasResultado = unidades / queijo.unidades_por_peca;
        setResultado({
          tipo: 'Rendimento por Unidade',
          unidades: unidades,
          pecas: pecasResultado,
          formula: `${unidades} ÷ ${queijo.unidades_por_peca} = ${pecasResultado.toFixed(2)} peças`
        });
        break;

      case "aproveitamento": // Rendimento por Peça
        const pecas = Number(formData.get('qts_pecas'));
        const unidadesResultado = pecas * queijo.unidades_por_peca;
        setResultado({
          tipo: 'Rendimento por Peça',
          pecas: pecas,
          unidades: unidadesResultado,
          formula: `${pecas} × ${queijo.unidades_por_peca} = ${unidadesResultado} unidades`
        });
        break;

      case "producao": // Rendimento com Sobra
        const tipoSobra = formData.get('tipo_sobra') as string;
        const totalInicial = Number(formData.get('qts_total'));
        const sobra = Number(formData.get('qts_sobra'));
        const aCortar = Number(formData.get('qts_cortar'));

        if (tipoSobra === 'unidades') {
          // Rendimento Com Sobra em Unidades
          const pecasRestantes = (aCortar - sobra) / queijo.unidades_por_peca;
          setResultado({
            tipo: 'Rendimento com Sobra em Unidades',
            totalInicial,
            sobra,
            aCortar,
            pecasRestantes,
            formula: `(${aCortar} - ${sobra}) ÷ ${queijo.unidades_por_peca} = ${pecasRestantes.toFixed(2)} peças para cortar`
          });
        } else {
          // Rendimento Com Sobra em Peças
          const unidadesRestantes = aCortar - (sobra * queijo.unidades_por_peca) ;
          const pecasRestantes = unidadesRestantes / queijo.unidades_por_peca;
          setResultado({
            tipo: 'Rendimento com Sobra em Peças',
            sobraPecas: sobra,
            aCortar,
            unidadesRestantes,
            pecasRestantes,
            formula: `(${sobra} × ${queijo.unidades_por_peca}) - ${aCortar} = ${unidadesRestantes} unidades restantes | ${unidadesRestantes} ÷ ${queijo.unidades_por_peca} = ${pecasRestantes.toFixed(2)} peças para cortar`
          });
        }
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    calcularRendimento(formData);
  };

  const renderAdditionalInputs = () => {
    switch (tipoCalculo) {
      case "financeiro": // Rendimento por Unidade
        return (
          <div>
            <Label htmlFor="qts_un">Quantidade de unidades para cortar</Label>
            <Input
              id="qts_un"
              name="qts_un"
              type="number"
              min="0"
              step="1"
              placeholder="Ex: 400"
              className="mt-1"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Quantidade de unidades de {queijo?.name || 'queijo'} que irá cortar
            </p>
          </div>
        );

      case "aproveitamento": // Rendimento por Peça
        return (
          <div>
            <Label htmlFor="qts_pecas">Quantidade de peças para cortar</Label>
            <Input
              id="qts_pecas"
              name="qts_pecas"
              type="number"
              min="0"
              step="1"
              placeholder="Ex: 10"
              className="mt-1"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Quantidade de peças de {queijo?.name || 'queijo'} que possui
            </p>
          </div>
        );

      case "producao": // Rendimento com Sobra
        return (
          <>
            <div>
              <Label htmlFor="tipo_sobra">Tipo de sobra</Label>
              <Select name="tipo_sobra" required>
                <SelectTrigger className="mt-1 cursor-pointer">
                  <SelectValue placeholder="Selecione o tipo de sobra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="unidades">Sobra em unidades</SelectItem>
                  <SelectItem className="cursor-pointer" value="pecas">Sobra em peças</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Escolha se sua sobra é em unidades ou peças
              </p>
            </div>

            <div>
              <Label htmlFor="qts_sobra">Quantidade de sobra</Label>
              <Input
                id="qts_sobra"
                name="qts_sobra"
                type="number"
                min="0"
                step="1"
                placeholder="Ex: 50"
                className="mt-1"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Quantidade que sobrou (unidades ou peças conforme selecionado acima)
              </p>
            </div>

            <div>
              <Label htmlFor="qts_cortar">Quantidade que deseja cortar</Label>
              <Input
                id="qts_cortar"
                name="qts_cortar"
                type="number"
                min="0"
                step="1"
                placeholder="Ex: 300"
                className="mt-1"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Quantidade de unidades que deseja cortar agora
              </p>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  // Estados de loading e erro
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Carregando informações do queijo...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !queijo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-red-600 mb-4">{error || "Informações do queijo não encontradas."}</p>
            <Link href="/App/queijos">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Queijos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/App/queijos">
          <Button variant="outline" size="sm" className="flex items-center gap-2 cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calcular Rendimento</h1>
          <p className="text-gray-600 mt-2">
            Calcule o rendimento por peça para: <span className="font-semibold">{queijo.name}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informações do Queijo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Informações do Queijo
            </CardTitle>
            <CardDescription>
              Dados cadastrados para este tipo de queijo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
          </CardContent>
        </Card>

        {/* Formulário de Cálculo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Calcular Rendimento
            </CardTitle>
            <CardDescription>
              Informe os dados para calcular o rendimento por peça
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <input type="hidden" name="queijo_id" value={queijo.id} />
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tipo_calculo">Tipo de cálculo</Label>
                  <Select 
                    name="tipo_calculo" 
                    required
                    onValueChange={(value) => setTipoCalculo(value)}
                  >
                    <SelectTrigger className="mt-1 cursor-pointer">
                      <SelectValue placeholder="Selecione o tipo de cálculo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="cursor-pointer" value="financeiro">Rendimento por Unidade</SelectItem>
                      <SelectItem className="cursor-pointer" value="aproveitamento">Rendimento por Peça</SelectItem>
                      <SelectItem className="cursor-pointer" value="producao">Rendimento com Sobra</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    Escolha o tipo de análise que deseja realizar
                  </p>
                </div>

                {/* Inputs dinâmicos baseados no tipo de cálculo */}
                {renderAdditionalInputs()}
              </div>

              {tipoCalculo && (
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calcular Rendimento
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setTipoCalculo("");
                      setResultado(null);
                      const form = document.querySelector('form') as HTMLFormElement;
                      if (form) form.reset();
                    }}
                  >
                    Limpar
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Resultado do Cálculo */}
      {resultado && (
        <div className="mt-8">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Calculator className="h-5 w-5" />
                Resultado: {resultado.tipo}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {resultado.unidades && (
                    <div className="bg-blue-100 p-3 rounded text-center">
                      <p className="text-xs text-blue-600 font-medium">Unidades</p>
                      <p className="text-lg font-bold text-blue-800">{resultado.unidades}</p>
                    </div>
                  )}
                  {resultado.pecas && (
                    <div className="bg-green-100 p-3 rounded text-center">
                      <p className="text-xs text-green-600 font-medium">Peças</p>
                      <p className="text-lg font-bold text-green-800">{resultado.pecas.toFixed(2)}</p>
                    </div>
                  )}
                  {resultado.pecasRestantes !== undefined && (
                    <div className="bg-blue-100 p-3 rounded text-center">
                      <p className="text-xs text-blue-600 font-medium">Peças Para Cortar</p>
                      <p className="text-lg font-bold text-blue-800">{resultado.pecasRestantes.toFixed(2)}</p>
                    </div>
                  )}
                  {resultado.unidadesRestantes !== undefined && (
                    <div className="bg-purple-100 p-3 rounded text-center">
                      <p className="text-xs text-purple-600 font-medium">Unidades Restantes</p>
                      <p className="text-lg font-bold text-purple-800">{resultado.unidadesRestantes}</p>
                    </div>
                  )}
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <p className="font-semibold text-lg mb-2">Fórmula aplicada:</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {resultado.formula}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Explicação dos Cálculos */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-green-600">Rendimento Por Unidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-green-50 p-3 rounded text-sm">
              <p className="font-semibold mb-2">Fórmula:</p>
              <div className="font-mono text-xs space-y-1">
                <p>Peças = Unidades de {queijo.name} ÷ {queijo.unidades_por_peca}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600">
              Calcula a quantidade de peças que irá cortar pela quantidade de unidades do queijo.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-blue-600">Rendimento Por Peça</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-blue-50 p-3 rounded text-sm">
              <p className="font-semibold mb-2">Fórmula:</p>
              <div className="font-mono text-xs space-y-1">
                <p>Unidades = Peças de {queijo.name} × {queijo.unidades_por_peca}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600">
              Calcula a quantidade de unidades que irá cortar pela quantidade de peças do queijo.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-purple-600">Rendimento Com Sobra em Unidades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-purple-50 p-3 rounded text-sm">
              <p className="font-semibold mb-2">Fórmula:</p>
              <div className="font-mono text-xs space-y-1">
                <p>Peças = (Sobra Unidades - Unidades a Cortar) ÷ {queijo.unidades_por_peca}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600">
              Calcula quantas peças restam após descontar a sobra e o que será cortado.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-yellow-600">Rendimento Com Sobra em Peças</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-yellow-50 p-3 rounded text-sm">
              <p className="font-semibold mb-2">Fórmula:</p>
              <div className="font-mono text-xs space-y-1">
                <p>Unidades Restantes = (Sobra Peças × {queijo.unidades_por_peca}) - Unidades a Cortar</p>
                <p>Peças Restantes = Unidades Restantes ÷ {queijo.unidades_por_peca}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600">
              Calcula o rendimento considerando sobra em peças e unidades a serem cortadas.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}