/*
 * CLIENTE DO SUPABASE.
 * Cria uma única conexão com o Supabase, usada pelo app inteiro
 * (import { supabase } from '../lib/supabase').
 *
 * A URL e a chave pública vêm do arquivo .env (veja .env.example). Elas podem
 * ficar no app porque quem protege os dados é o RLS (Row Level Security),
 * configurado em supabase/schema.sql. NUNCA coloque aqui a chave "secret"
 * ou "service_role".
 *
 * AsyncStorage guarda a sessão no aparelho: o usuário continua logado
 * mesmo depois de fechar o app.
 */
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Tira espaços e aspas que às vezes sobram ao copiar o valor para o .env.
const limpar = (valor?: string) => (valor ?? '').trim().replace(/^["']|["']$/g, '');

/**
 * Deixa só o endereço base do projeto (https://xxxx.supabase.co).
 * Se vier com caminho (ex.: .../rest/v1/), o caminho é descartado; é isso que
 * evita o erro "Invalid path specified in request URL".
 */
function enderecoBase(url: string): string {
  if (!url) return '';
  try {
    return new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`).origin;
  } catch {
    return '';
  }
}

const supabaseUrl = enderecoBase(limpar(process.env.EXPO_PUBLIC_SUPABASE_URL));
const supabaseKey = limpar(process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

/** false quando o .env está ausente ou vazio; as telas usam isso para avisar em vez de travar. */
export const supabaseConfigurado = supabaseUrl !== '' && supabaseKey !== '';

if (!supabaseConfigurado) {
  console.warn(
    'Supabase: defina EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY no arquivo .env e reinicie com "npx expo start -c".',
  );
}

// Sem configuração, usamos valores de mentira só para o app abrir normalmente
// (o createClient lança erro com URL vazia); cadastrar/entrar avisam o usuário.
export const supabase = createClient(supabaseUrl || 'https://nao-configurado.supabase.co', supabaseKey || 'nao-configurado', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
