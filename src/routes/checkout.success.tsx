/**
 * /checkout/success — landing pós-pagamento bem-sucedido (placeholder Sprint 3).
 *
 * Stripe redireciona pra cá com `?session_id=cs_test_...` quando o user
 * conclui a Checkout Session. Sincronização real de subscription → user_credits
 * acontece no webhook (Sprint 4), não aqui. Esta rota apenas confirma visualmente.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/checkout/success")({
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  component: CheckoutSuccessPage,
});

function CheckoutSuccessPage() {
  const { session_id } = Route.useSearch();

  return (
    <div className="min-h-screen bg-background text-foreground grid place-items-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-accent/15 text-accent grid place-items-center">
          <Check className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-2xl sm:text-3xl font-semibold tracking-[-0.01em]">
          Pagamento concluído!
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Você vai receber um e-mail de confirmação em instantes. O seu plano fica ativo assim que
          processarmos o pagamento.
        </p>
        <Button
          asChild
          className="mt-7 h-11 rounded-full px-6 bg-foreground text-background hover:bg-foreground/90"
        >
          <Link to="/">
            Voltar ao app <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </Button>
        {session_id && (
          <p className="mt-6 text-[10px] text-muted-foreground/70 break-all">
            ref: {session_id}
          </p>
        )}
      </div>
    </div>
  );
}
