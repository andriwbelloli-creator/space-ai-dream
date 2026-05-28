/**
 * useCepLookup — autocomplete de endereço via ViaCEP (API pública gratuita BR).
 *
 * Dispara fetch quando o CEP tem 8 dígitos completos. Debounce 500ms pra
 * evitar chamadas em cada keystroke. Cancela on unmount ou se o CEP mudar
 * antes do debounce disparar.
 *
 * Uso:
 *
 *   const { status, data, error } = useCepLookup(cep);
 *   if (status === "success") console.log(data.localidade); // "São Paulo"
 *
 * ViaCEP é público, sem auth, sem rate limit declarado.
 * https://viacep.com.br/
 */
import { useEffect, useState } from "react";

export type CepData = {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
};

export type CepLookupState =
  | { status: "idle"; data: null; error: null }
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: CepData; error: null }
  | { status: "error"; data: null; error: string };

const IDLE: CepLookupState = { status: "idle", data: null, error: null };

export function useCepLookup(cepRaw: string): CepLookupState {
  const [state, setState] = useState<CepLookupState>(IDLE);
  const digits = cepRaw.replace(/\D/g, "");

  useEffect(() => {
    if (digits.length !== 8) {
      setState(IDLE);
      return;
    }

    let cancelled = false;
    setState({ status: "loading", data: null, error: null });

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        if (!res.ok) throw new Error(`http_${res.status}`);
        const json = (await res.json()) as {
          erro?: boolean;
          logradouro?: string;
          bairro?: string;
          localidade?: string;
          uf?: string;
        };
        if (cancelled) return;
        if (json.erro) {
          setState({ status: "error", data: null, error: "CEP não encontrado." });
          return;
        }
        setState({
          status: "success",
          data: {
            logradouro: json.logradouro ?? "",
            bairro: json.bairro ?? "",
            localidade: json.localidade ?? "",
            uf: json.uf ?? "",
          },
          error: null,
        });
      } catch {
        if (cancelled) return;
        setState({
          status: "error",
          data: null,
          error: "Não conseguimos validar o CEP agora. Você pode continuar mesmo assim.",
        });
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [digits]);

  return state;
}

/** Máscara CEP brasileira: XXXXX-XXX */
export function maskCep(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}
