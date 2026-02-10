import supabase from './lib/supabase'

console.log('🔍 Test de connexion Supabase...')
console.log('URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Chargée' : '❌ Manquante')
console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Chargée' : '❌ Manquante')

// Test de récupération des perfis
export const testSupabaseConnection = async () => {
  try {
    // Récupérer tous les perfis
    const { data: perfis, error } = await supabase
      .from('perfis')
      .select('*')
    
    if (error) throw error
    
    console.log('✅ Perfis récupérés:', perfis)
    console.log('📊 Nombre de perfis:', perfis.length)
    
    return true
  } catch (err) {
    console.error('❌ Erreur Supabase:', err)
    return false
  }
}

testSupabaseConnection()