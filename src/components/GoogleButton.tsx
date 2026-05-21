import { Loader2 } from "lucide-react";

/**
 * Botão "Continuar com Google" seguindo o branding oficial.
 * Refs: https://developers.google.com/identity/branding-guidelines
 *
 * Padrão "neutral" — fundo branco, texto cinza escuro, ícone G colorido oficial.
 * Cobre login E signup (Google trata ambos no mesmo fluxo OAuth).
 */
interface GoogleButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
}

export function GoogleButton({
  onClick,
  loading = false,
  disabled = false,
  label = "Continuar com Google",
}: GoogleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className="inline-flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
      aria-label={label}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <GoogleIcon className="h-[18px] w-[18px]" />
      )}
      <span>{label}</span>
    </button>
  );
}

/** Logo "G" oficial do Google (4 cores). SVG inline, sem dependência externa. */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}
