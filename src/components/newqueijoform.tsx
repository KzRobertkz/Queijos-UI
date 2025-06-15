"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { toast } from "sonner"
import { createQueijoAction } from "../app/(auth)/App/queijos/novoqueijo/action" // Ajuste o path
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface NewQueijoFormProps {
  loggedUser: {
    email: string
    id: string
  }
}

// Tipo para representar um novo queijo
interface Queijo {
  name: string
  pesoUnidade: number | ""
  unidadesPorPeca: number | ""
}

// Tipo para os erros
interface QueijoErrors {
  name?: string
  pesoUnidade?: string
  unidadesPorPeca?: string
}

export const NewQueijoForm = ({ loggedUser }: NewQueijoFormProps) => {
  const [newQueijo, setNewQueijo] = useState<Queijo>({
    name: "",
    pesoUnidade: "",
    unidadesPorPeca: "",
  })

  const [errors, setErrors] = useState<QueijoErrors>({})
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Para campos numéricos, converte para número ou mantém string vazia
    let processedValue: string | number = value
    if (name === "pesoUnidade" || name === "unidadesPorPeca") {
      processedValue = value === "" ? "" : Number(value)
    }

    setNewQueijo(prev => ({ 
      ...prev, 
      [name]: processedValue 
    }))

    // Remove erro do campo quando usuário começa a digitar
    if (errors[name as keyof QueijoErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: QueijoErrors = {}

    if (!newQueijo.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    // Validação do peso
    if (newQueijo.pesoUnidade === "") {
      newErrors.pesoUnidade = "Peso é obrigatório"
    } else if (typeof newQueijo.pesoUnidade === 'number' && newQueijo.pesoUnidade <= 0) {
      newErrors.pesoUnidade = "Peso deve ser maior que 0"
    }

    // Validação das unidades
    if (newQueijo.unidadesPorPeca === "") {
      newErrors.unidadesPorPeca = "Unidades por peça é obrigatório"
    } else if (typeof newQueijo.unidadesPorPeca === 'number' && newQueijo.unidadesPorPeca <= 0) {
      newErrors.unidadesPorPeca = "Unidades por peça deve ser maior que 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setNewQueijo({
      name: "",
      pesoUnidade: "",
      unidadesPorPeca: "",
    })
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Por favor, corrija os campos obrigatórios.")
      return
    }

    // Usar server action
    startTransition(async () => {
      const formData = new FormData()
      formData.append("name", newQueijo.name.trim())
      formData.append("pesoUnidade", newQueijo.pesoUnidade.toString())
      formData.append("unidadesPorPeca", newQueijo.unidadesPorPeca.toString())

      try {
        const result = await createQueijoAction(formData)
        
        if (result.success) {
          resetForm()
          toast.success(result.message)
          console.log("Queijo criado:", result.data)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error("Erro ao criar queijo:", error)
        toast.error("Ocorreu um erro inesperado.")
      }
    })
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Botão de voltar no topo, alinhado à esquerda */}
      <div className="flex justify-start">
        <Link href="/App/queijos">
          <Button variant="outline" size="sm" className="flex items-center gap-2 cursor-pointer ">
            <ArrowLeft className="h-4 w-4" />
            Voltar para queijos
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Novo Queijo</CardTitle>
          <CardDescription>
            Cadastre um novo tipo de queijo no sistema
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {/* Nome do Queijo */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nome do Queijo *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={newQueijo.name}
                  onChange={handleChange}
                  placeholder="Digite o nome do queijo"
                  className={`${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                  disabled={isPending}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Peso por Unidade */}
              <div className="space-y-2">
                <Label htmlFor="pesoUnidade" className="text-sm font-medium">
                  Peso por Unidade (gramas) *
                </Label>
                <Input
                  id="pesoUnidade"
                  name="pesoUnidade"
                  type="number"
                  min="0"
                  step="0.1"
                  value={newQueijo.pesoUnidade}
                  onChange={handleChange}
                  placeholder="Ex: 250"
                  className={`${errors.pesoUnidade ? 'border-red-500 focus:border-red-500' : ''}`}
                  disabled={isPending}
                />
                {errors.pesoUnidade && (
                  <p className="text-sm text-red-500">{errors.pesoUnidade}</p>
                )}
              </div>

              {/* Unidades por Peça */}
              <div className="space-y-2">
                <Label htmlFor="unidadesPorPeca" className="text-sm font-medium">
                  Unidades rendidas por Peça *
                </Label>
                <Input
                  id="unidadesPorPeca"
                  name="unidadesPorPeca"
                  type="number"
                  min="1"
                  step="1"
                  value={newQueijo.unidadesPorPeca}
                  onChange={handleChange}
                  placeholder="Ex: 8"
                  className={`${errors.unidadesPorPeca ? 'border-red-500 focus:border-red-500' : ''}`}
                  disabled={isPending}
                />
                {errors.unidadesPorPeca && (
                  <p className="text-sm text-red-500">{errors.unidadesPorPeca}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
                disabled={isPending}
                className="flex-1 cursor-pointer"
              >
                Limpar
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
                className="flex-1 hover:bg-yellow-600 text-white cursor-pointer"
              >
                {isPending ? "Salvando..." : "Salvar Queijo"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}