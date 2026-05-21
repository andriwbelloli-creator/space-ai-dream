// Sobe uma imagem (data URL base64) pro Supabase Storage e devolve a URL
// pública. Existe pra evitar gravar base64 gigante direto em colunas do
// Postgres — isso inchava a tabela `projects` e degradava o dashboard.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// "homeoffice" — bucket que já existe no Supabase compartilhado (nome legado).
const BUCKET = "homeoffice";

/**
 * Faz upload de uma imagem em data URL base64 e retorna a URL pública.
 * Retorna null se o data URL for inválido ou o upload falhar — o caller
 * decide o fallback (ex.: usar o próprio data URL pra não perder a geração).
 */
export async function uploadImageToStorage(
  dataUrl: string,
  prefix: string,
  userId: string,
): Promise<string | null> {
  const match = dataUrl.match(/^data:(image\/[a-z]+);base64,(.+)$/);
  if (!match) {
    console.error("[storage] data URL inválido");
    return null;
  }
  const mime = match[1];
  const ext = mime.split("/")[1] === "jpeg" ? "jpg" : mime.split("/")[1];
  const bytes = Uint8Array.from(atob(match[2]), (c) => c.charCodeAt(0));
  const path = `${prefix}/${userId}/${Date.now()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: mime, upsert: false });
  if (error) {
    console.error("[storage] upload falhou", error);
    return null;
  }
  return supabaseAdmin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
