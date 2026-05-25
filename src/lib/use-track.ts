/**
 * useTrack — hook React pra instrumentar eventos do funil sem boilerplate.
 *
 * Wrapper enxuto sobre `logEvent` (server fn POST → tabela `events`). Garante:
 *  - Fire-and-forget: erro de tracking nunca quebra a UI (`.catch(() => {})`)
 *  - Sanitização suave: number/boolean → string antes do server (schema esperado)
 *  - Null/undefined são removidos (evita poluir props com `null` literal)
 *  - Allowlist enforced server-side: nome fora da lista cai silenciosamente
 *
 * NUNCA passar PII (nome, e-mail, telefone, foto, URL privada). O server
 * já trunca a 200 chars + max 12 chaves, mas a regra é não enviar.
 *
 * Uso:
 *
 *   const track = useTrack();
 *   track("hero_upload_click", { source: "header_button" });
 *   track("generation_started", { roomType, style, source: "upload_modal" });
 *
 * O retorno é estável por instância de hook (mesmo padrão de `useServerFn`),
 * então é seguro usar em deps de useEffect/useCallback.
 */
import { useServerFn } from "@tanstack/react-start";
import { logEvent } from "./tracking.functions";

type TrackValue = string | number | boolean | null | undefined;

export function useTrack() {
  const track = useServerFn(logEvent);
  return (event: string, props?: Record<string, TrackValue>) => {
    const stringProps: Record<string, string> = {};
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (v === null || v === undefined) continue;
        stringProps[k] = String(v);
      }
    }
    void track({ data: { event, props: stringProps } }).catch(() => {
      // Tracking nunca pode quebrar fluxo de usuário.
    });
  };
}
