import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import supabase from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { Link } from "react-router-dom"

interface Perfil {
  id: string
  nome: string
  email: string
  telefone?: string
  bio?: string
  localizacao?: string
  servicos?: string[]
  preco_min?: number
  preco_max?: number
  created_at: string
}

export default function Perfis() {
  const [perfis, setPerfis] = useState<Perfil[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPerfis()
  }, [])

  const loadPerfis = async () => {
    try {
      const { data, error } = await supabase
        .from('perfis')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setPerfis(data || [])
    } catch (err) {
      console.error('Erro ao carregar perfis:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">👑 Perfis de Dominatrices</h1>
        <p className="text-muted-foreground">Encontre profissionais experientes para suas necessidades</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : perfis.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Nenhum perfil encontrado no momento.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {perfis.map((perfil) => (
            <Card key={perfil.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{perfil.nome}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{perfil.email}</p>
                    {perfil.telefone && (
                      <p className="text-sm text-muted-foreground mt-1">📱 {perfil.telefone}</p>
                    )}
                  </div>
                  <Badge variant="default">Disponível</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {perfil.localizacao && (
                  <div className="mb-3">
                    <span className="font-semibold text-sm">📍 Localização:</span>
                    <span className="ml-2 text-muted-foreground">{perfil.localizacao}</span>
                  </div>
                )}

                {perfil.bio && (
                  <div className="mb-4">
                    <span className="font-semibold text-sm">📝 Sobre:</span>
                    <p className="text-sm text-muted-foreground mt-1">{perfil.bio}</p>
                  </div>
                )}

                {perfil.servicos && perfil.servicos.length > 0 && (
                  <div className="mb-4">
                    <span className="font-semibold text-sm">💼 Serviços:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {perfil.servicos.map((servico, index) => (
                        <Badge key={index} variant="secondary">
                          {servico}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {(perfil.preco_min || perfil.preco_max) && (
                  <div>
                    <span className="font-semibold text-sm">💰 Preço:</span>
                    <p className="text-lg font-bold mt-1">
                      R$ {perfil.preco_min?.toFixed(2)} - R$ {perfil.preco_max?.toFixed(2)}
                    </p>
                  </div>
                )}

                <Button 
                  className="mt-4 w-full"
                  asChild
                >
                  <Link to={`/profile/${perfil.id}`}>
                    Ver Perfil Completo
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}