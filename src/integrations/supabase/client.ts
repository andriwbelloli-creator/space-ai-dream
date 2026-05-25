// Patched (não-auto): aceita 3 fontes de env (Lovable só usava 2).
// Motivo: Cloudflare Workers Builds não embeda `VITE_*` no bundle se as
// vars estiverem cadastradas só como runtime (não build-time). O fallback
// `window.__SUPABASE_ENV__` é populado em SSR pelo `__root.tsx` e funciona
// em qualquer cenário sem precisar reconfigurar o CI.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

type SupabaseEnvBootstrap = { url?: string; key?: string };

function readClientEnv(): { url: string; key: string } {
  // 1) Build-time (Vite string replacement) — funciona se VITE_* estiver no env do build
  const viteUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const viteKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
  // 2) SSR-injected (window.__SUPABASE_ENV__) — populado pelo RootShell em runtime do Worker
  let winUrl: string | undefined;
  let winKey: string | undefined;
  if (typeof window !== 'undefined') {
    const w = window as Window & { __SUPABASE_ENV__?: SupabaseEnvBootstrap };
    winUrl = w.__SUPABASE_ENV__?.url;
    winKey = w.__SUPABASE_ENV__?.key;
  }
  // 3) Runtime do Worker / Node (fallback final pra server-side)
  const procUrl =
    typeof process !== 'undefined' ? (process.env?.SUPABASE_URL as string | undefined) : undefined;
  const procKey =
    typeof process !== 'undefined'
      ? (process.env?.SUPABASE_PUBLISHABLE_KEY as string | undefined)
      : undefined;

  return {
    url: viteUrl || winUrl || procUrl || '',
    key: viteKey || winKey || procKey || '',
  };
}

function createSupabaseClient() {
  const { url: SUPABASE_URL, key: SUPABASE_PUBLISHABLE_KEY } = readClientEnv();

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    const missing = [
      ...(!SUPABASE_URL ? ['SUPABASE_URL'] : []),
      ...(!SUPABASE_PUBLISHABLE_KEY ? ['SUPABASE_PUBLISHABLE_KEY'] : []),
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(', ')}. Connect Supabase in Lovable Cloud.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    }
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});

