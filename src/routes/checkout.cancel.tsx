/**
 * /checkout/cancel — landing quando o user cancela a Checkout Session do Stripe.
 * Placeholder Sprint 3. Sem ação no banco; user pode tentar de novo em /pricing.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { X, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/checkout/cancel")({
  component: CheckoutCancelPage,
});

function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-background text-foreground grid place-items-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-muted text-muted-foreground grid place-items-center">
          <X className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-2xl sm:text-3xl font-semibold tracking-[-0.01em]">
          Compra não concluída
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Sem cobrança. Você pode escolher um plano quando quiser.
        </p>
        <Button
          asChild
          className="mt-7 h-11 rounded-full px-6 bg-foreground text-background hover:bg-foreground/90"
        >
          <Link to="/pricing">
            Voltar para planos <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
