/**
 * Bloco centralizado pra estados vazios, sem permissão ou erro. Usado em
 * todas as telas admin no lugar de tela inteira em branco.
 */
export function StatusBlock({
  icon,
  tone,
  title,
  text,
  action,
}: {
  icon: React.ReactNode;
  tone: "destructive" | "muted";
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mt-6 rounded-3xl border border-border bg-card p-10 text-center">
      <div
        className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${
          tone === "destructive"
            ? "bg-destructive/10 text-destructive"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </div>
      <p className="mt-4 text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      {action}
    </div>
  );
}
