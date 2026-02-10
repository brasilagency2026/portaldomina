import { useState, useEffect } from 'react'
import supabase from '@/lib/supabase'

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

export default function PerfisList() {
  const [perfis, setPerfis] = useState<Perfil[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPerfis()
  }, [])

  const fetchPerfis = async () => {
    try {
      const { data, error } = await supabase
        .from('perfis')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setPerfis(data || [])
      console.log('✅ Perfis carregados:', data)
    } catch (err) {
      console.error('❌ Erro ao carregar perfis:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">👑 Perfis de Dominatrices</h1>
      
      {perfis.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Nenhum perfil encontrado</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {perfis.map((perfil) => (
            <div
              key={perfil.id}
              className="border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{perfil.nome}</h2>
                  <p className="text-gray-600 mt-1">{perfil.email}</p>
                  {perfil.telefone && (
                    <p className="text-gray-500 mt-1">📱 {perfil.telefone}</p>
                  )}
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Disponível
                </span>
              </div>

              {perfil.localizacao && (
                <div className="mt-4">
                  <span className="font-semibold">📍 Localização:</span> {perfil.localizacao}
                </div>
              )}

              {perfil.bio && (
                <div className="mt-4">
                  <span className="font-semibold">📝 Sobre:</span>
                  <p className="text-gray-700 mt-1">{perfil.bio}</p>
                </div>
              )}

              {perfil.servicos && perfil.servicos.length > 0 && (
                <div className="mt-4">
                  <span className="font-semibold">💼 Serviços:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {perfil.servicos.map((servico, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {servico}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(perfil.preco_min || perfil.preco_max) && (
                <div className="mt-4">
                  <span className="font-semibold">💰 Preço:</span>
                  <p className="text-gray-700 mt-1">
                    R$ {perfil.preco_min?.toFixed(2)} - R$ {perfil.preco_max?.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}