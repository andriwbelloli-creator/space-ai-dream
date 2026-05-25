/**
 * useSmartAnchor — resolve o bug silencioso de clicar em link de anchor
 * (ex: "#galeria", "#pro") fora da home.
 *
 * Quando o usuário está na home (`/`), faz scroll suave pro elemento.
 * Quando está em outra rota (`/vs/planner-5d`, `/ambientes/closet`, etc),
 * navega pra home com hash — TanStack Router resolve, browser faz o
 * scroll automático na hidratação.
 *
 * Uso típico:
 *
 *   const smartAnchor = useSmartAnchor();
 *   <a href="#galeria" onClick={smartAnchor("galeria")}>Ideias</a>
 *
 * Em botões puros (sem href):
 *
 *   <button onClick={smartAnchor("galeria")}>Ideias</button>
 */
import { useCallback } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";

type SmartAnchorHandler = (e?: { preventDefault?: () => void }) => void;

export function useSmartAnchor() {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (anchor: string): SmartAnchorHandler =>
      (e) => {
        e?.preventDefault?.();
        if (location.pathname === "/") {
          // Já na home — scroll suave pro anchor (se o elemento existe)
          if (typeof document !== "undefined") {
            const el = document.getElementById(anchor);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
              // Atualiza a hash na URL sem causar jump bruto
              if (typeof window !== "undefined") {
                window.history.replaceState(null, "", `#${anchor}`);
              }
              return;
            }
          }
          // Elemento não existe ainda — fallback: usa hash nativa
          if (typeof window !== "undefined") {
            window.location.hash = `#${anchor}`;
          }
        } else {
          // Fora da home — navega pra "/" com hash. O router resolve e
          // o browser faz scroll pro id após render.
          navigate({ to: "/", hash: anchor });
        }
      },
    [navigate, location.pathname],
  );
}
