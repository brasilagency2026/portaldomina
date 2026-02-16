import { supabase } from './lib/supabase'

console.log('🔍 Test de connexion Supabase...')

export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('perfis')
      .select('count')
      .limit(1)
    
    if (error) {
      console.warn('⚠️ Table "perfis" non trouvée ou vide. Assurez-vous d\'avoir exécuté le script SQL dans Supabase.');
      return false;
    }
    
    console.log('✅ Connexion Supabase réussie !');
    return true;
  } catch (err) {
    console.error('❌ Erreur de connexion Supabase:', err);
    return false;
  }
}

testSupabaseConnection()