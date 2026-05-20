import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { IdealSpaceLogo } from "@/components/IdealSpaceLogo";
import { BeforeAfter } from "@/components/BeforeAfter";
import { PresentationModal } from "@/components/PresentationModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ArrowRight, ArrowUpRight, Sparkles, Check, Lock, Image as ImageIcon,
  Wand2, ShoppingBag, Download, Menu, ShieldCheck, FileText,
  Building2, Briefcase, HomeIcon, Stethoscope, Star, ChevronRight, Zap, Heart, PlayCircle, Trophy,
} from "lucide-react";

import emptyLiving from "@/assets/empty-living.jpg";
import decoratedLiving from "@/assets/decorated-living.jpg";
import emptyBedroom from "@/assets/empty-bedroom.jpg";
import emptyKitchen from "@/assets/empty-kitchen.jpg";
import emptyOffice from "@/assets/empty-office.jpg";
import emptyStudio from "@/assets/empty-studio.jpg";
import emptyBathroom from "@/assets/empty-bathroom.jpg";
import styleScandi from "@/assets/style-scandi.jpg";
import styleIndustrial from "@/assets/style-industrial.jpg";
import styleJapandi from "@/assets/style-japandi.jpg";
import styleModern from "@/assets/style-modern.jpg";
import galleryOffice from "@/assets/gallery-office.jpg";
import galleryClinic from "@/assets/gallery-clinic.jpg";
import decoratedBedroom from "@/assets/decorated-bedroom.jpg";
import decoratedKitchen from "@/assets/decorated-kitchen.jpg";
import decoratedDining from "@/assets/decorated-dining.jpg";
import rankMinimalBedroom from "@/assets/rank-minimal-bedroom.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Ideal Space — Design de interiores com IA" },
      { name: "description", content: "Transforme ambientes vazios em projetos decorados com IA. Escolha um estilo, gere o projeto, veja a lista de compras e baixe o orçamento." },
    ],
  }),
});

/* ----------------------------- DATA ----------------------------- */

const emptyRooms = [
  { img: emptyLiving,  title: "Sala vazia",        badge: "Mais usado",       sub: "Transforme em estar acolhedor" },
  { img: emptyBedroom, title: "Quarto vazio",      badge: "Aconchegante",     sub: "Sono, descanso e estilo" },
  { img: emptyKitchen, title: "Cozinha simples",   badge: "Premium",          sub: "Funcional e bonita" },
  { img: emptyOffice,  title: "Home office vazio", badge: "Profissional",     sub: "Foco, conforto e estética" },
  { img: emptyStudio,  title: "Studio compacto",   badge: "Espaço pequeno",   sub: "Aproveite cada metro" },
  { img: emptyBathroom,title: "Banheiro vazio",    badge: "Reforma virtual",  sub: "Visualize antes de comprar" },
] as const;

const styles = [
  { img: styleJapandi,   name: "Japandi",      sub: "Calma, oak e linho" },
  { img: styleScandi,    name: "Escandinavo",  sub: "Claro, leve, neutro" },
  { img: styleModern,    name: "Contemporâneo", sub: "Linhas suaves e arte" },
  { img: styleIndustrial,name: "Industrial",   sub: "Tijolo, metal e couro" },
  { img: decoratedBedroom, name: "Aconchegante", sub: "Linho, oak e luz quente" },
  { img: decoratedKitchen, name: "Luxo discreto",sub: "Madeira nobre e brass" },
  { img: decoratedDining,  name: "Natural",      sub: "Fibras, plantas e cerâmica" },
  { img: galleryClinic,    name: "Acolhedor",    sub: "Tons suaves e textura" },
];

const shoppingList = [
  { tag: "Essencial",   name: "Sofá 3 lugares",        cat: "Móveis principais", price: "R$ 1.200–3.500" },
  { tag: "Essencial",   name: "Mesa de centro oval",   cat: "Móveis principais", price: "R$ 300–900" },
  { tag: "Recomendado", name: "Luminária de piso",     cat: "Iluminação",        price: "R$ 180–600" },
  { tag: "Recomendado", name: "Poltrona linho",        cat: "Móveis",            price: "R$ 700–1.800" },
  { tag: "Opcional",    name: "Tapete neutro 2x3",     cat: "Decoração",         price: "R$ 250–900" },
  { tag: "Opcional",    name: "Vaso + planta grande",  cat: "Decoração",         price: "R$ 120–450" },
  { tag: "Opcional",    name: "Quadro emoldurado",     cat: "Arte",              price: "R$ 90–350" },
] as const;

const plans = [
  {
    name: "Starter", price: "R$ 19,90", per: "/mês",
    desc: "Para testar ideias em casa ou em poucos ambientes.",
    features: ["10 gerações por mês","Ambientes residenciais","Estilos básicos","Antes e depois","Lista de compras parcial","Download em resolução padrão","Projetos salvos limitados"],
    cta: "Começar no Starter",
  },
  {
    name: "Premium", price: "R$ 49,90", per: "/mês",
    desc: "Para decorar a casa inteira e baixar orçamento completo.",
    features: ["40 gerações por mês","Todos os ambientes","Estilos premium","Lista de compras completa","Orçamento em PDF","Sem marca d'água","Projetos ilimitados","Variações da IA"],
    cta: "Assinar Premium", featured: true,
  },
  {
    name: "Pro", price: "R$ 149,90", per: "/mês",
    desc: "Para designers, arquitetos, corretores e imobiliárias.",
    features: ["150 gerações por mês","Módulos profissionais","Alta resolução","PDF profissional","Organização por cliente","Virtual staging","Prioridade de processamento","Sem marca d'água"],
    cta: "Começar no Pro",
  },
];

const faqs = [
  { q: "Como funciona a geração com IA?", a: "Você envia uma foto do ambiente vazio, escolhe um estilo e a IA gera uma versão decorada preservando a estrutura do espaço." },
  { q: "As medidas e produtos são reais?", a: "As imagens são ilustrativas. Os produtos sugeridos têm faixas de preço estimadas e podem variar conforme loja e disponibilidade." },
  { q: "Minhas fotos ficam públicas?", a: "Não. Suas fotos são privadas e nunca são publicadas sem sua autorização explícita." },
  { q: "Posso cancelar a assinatura quando quiser?", a: "Sim. O cancelamento é simples e pode ser feito a qualquer momento dentro da sua conta." },
  { q: "Vocês têm planos para profissionais?", a: "Sim, o plano Pro inclui módulos para designers, arquitetos, imobiliárias e clínicas, com PDF profissional e organização por cliente." },
];

/* ----------------------------- PAGE ----------------------------- */

function Index() {
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [affiliateOpen, setAffiliateOpen] = useState<null | string>(null);
  const [budgetDone, setBudgetDone] = useState(false);
  const [presentationOpen, setPresentationOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const seen = window.localStorage.getItem("is_presentation_seen");
      if (!seen) {
        const t = window.setTimeout(() => setPresentationOpen(true), 900);
        return () => window.clearTimeout(t);
      }
    } catch {}
  }, []);

  const handlePresentation = (open: boolean) => {
    setPresentationOpen(open);
    if (!open) {
      try { window.localStorage.setItem("is_presentation_seen", "1"); } catch {}
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onDemo={() => handlePresentation(true)} />
      <Hero onBudget={() => setBudgetOpen(true)} onAffiliate={setAffiliateOpen} onDemo={() => handlePresentation(true)} />
      <Marquee />
      <EmptyRoomsCarousel />
      <StylesCarousel />
      <HowItWorks />
      <FeaturedBeforeAfter />
      <ResultShowcase onBudget={() => setBudgetOpen(true)} onAffiliate={setAffiliateOpen} />
      <Ranking />
      <Testimonials />
      <Professionals />
      <Pricing />
      <Trust />
      <FAQ />
      <Footer />

      <PresentationModal open={presentationOpen} onOpenChange={handlePresentation} before={emptyLiving} after={decoratedLiving} />

      {/* Lead-capture / orçamento */}
      <Dialog open={budgetOpen} onOpenChange={(o) => { setBudgetOpen(o); if (!o) setBudgetDone(false); }}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          {!budgetDone ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif">Receba seu orçamento completo</DialogTitle>
                <DialogDescription>
                  Informe seus dados para baixar a estimativa do projeto e salvar as recomendações.
                </DialogDescription>
              </DialogHeader>
              <form
                className="space-y-3"
                onSubmit={(e) => { e.preventDefault(); setBudgetDone(true); }}
              >
                <Input type="email" required placeholder="seu@email.com" className="h-11 rounded-xl" />
                <Input type="tel" required placeholder="WhatsApp com DDD" className="h-11 rounded-xl" />
                <label className="flex gap-2 text-xs text-muted-foreground items-start pt-1">
                  <Checkbox required className="mt-0.5" />
                  <span>Li e aceito a Política de Privacidade e autorizo o uso dos meus dados para receber este orçamento.</span>
                </label>
                <label className="flex gap-2 text-xs text-muted-foreground items-start">
                  <Checkbox className="mt-0.5" />
                  <span>Quero receber sugestões de produtos, novidades e recomendações sobre meu projeto.</span>
                </label>
                <Button type="submit" className="w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90">
                  Baixar orçamento
                </Button>
                <p className="text-[11px] text-muted-foreground">
                  Seus dados são tratados conforme a LGPD. Você pode solicitar exclusão a qualquer momento.
                </p>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="mx-auto h-14 w-14 rounded-full bg-accent/15 text-accent grid place-items-center mb-3">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif">Orçamento enviado!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Acabamos de enviar o orçamento para o seu e-mail.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal afiliados */}
      <Dialog open={!!affiliateOpen} onOpenChange={(o) => !o && setAffiliateOpen(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif">Escolha onde comprar</DialogTitle>
            <DialogDescription>Opções parecidas em lojas parceiras e marketplaces.</DialogDescription>
          </DialogHeader>
          <div className="rounded-2xl border bg-muted/40 p-4">
            <div className="text-sm font-medium">{affiliateOpen ?? "Item"}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Conforto · R$ 500–1.800</div>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {["Amazon", "Mercado Livre", "Magalu", "Shopee", "Buscar no Google Shopping"].map((m) => (
              <Button key={m} variant="outline" className="h-11 rounded-xl justify-between">
                <span>Ver na {m.replace("Buscar no ", "")}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Alguns links podem gerar comissão para o Ideal Space, sem custo adicional para você. Os preços e disponibilidade podem variar.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ----------------------------- HEADER ----------------------------- */

function Header({ onDemo }: { onDemo: () => void }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <IdealSpaceLogo />
        <nav className="hidden lg:flex items-center gap-7 text-sm text-muted-foreground">
          <button onClick={onDemo} className="hover:text-foreground transition">Como funciona</button>
          <a className="hover:text-foreground transition" href="#ambientes">Ambientes</a>
          <a className="hover:text-foreground transition" href="#estilos">Estilos</a>
          <a className="hover:text-foreground transition" href="#ranking">Ranking</a>
          <a className="hover:text-foreground transition" href="#pro">Para profissionais</a>
          <a className="hover:text-foreground transition" href="#planos">Planos</a>
        </nav>
        <div className="hidden lg:flex items-center gap-2">
          <Button variant="ghost" className="text-sm">Entrar</Button>
          <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-4 h-9 text-sm">
            Começar agora <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <button className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[86%] sm:w-[380px]">
            <SheetHeader><SheetTitle><IdealSpaceLogo /></SheetTitle></SheetHeader>
            <div className="mt-6 flex flex-col gap-1 text-base">
              {["Criar com IA","Ambientes","Estilos","Para profissionais","Planos"].map(l =>
                <a key={l} href="#" className="py-3 border-b border-border/60">{l}</a>)}
            </div>
            <Button className="mt-6 w-full h-11 rounded-xl bg-foreground text-background">Começar agora</Button>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

/* ----------------------------- HERO ----------------------------- */

function Hero({ onBudget, onAffiliate, onDemo }: { onBudget: () => void; onAffiliate: (s: string) => void; onDemo: () => void }) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full blur-3xl opacity-50"
        style={{ background: "radial-gradient(circle, oklch(0.72 0.13 55 / 0.35), transparent 60%)" }} />
      <div aria-hidden className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle, oklch(0.72 0.13 55 / 0.25), transparent 60%)" }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center relative">
        <div className="lg:col-span-6 is-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" /> Nova versão · Studio com IA
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[68px] leading-[1.02] tracking-[-0.02em] font-semibold">
            Transforme espaços vazios em{" "}
            <span className="font-serif italic font-normal text-accent">ambientes decorados</span>{" "}
            com IA.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl">
            Escolha ou envie uma foto do ambiente, selecione um estilo e veja a IA criar uma versão
            mobiliada, bonita e pronta para inspirar seu projeto — com lista de compras e orçamento.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Button className="h-12 rounded-full bg-foreground text-background hover:bg-foreground/90 px-6 text-sm">
              <Sparkles className="mr-2 h-4 w-4" /> Criar projeto com IA
            </Button>
            <Button onClick={onDemo} variant="outline" className="h-12 rounded-full px-6 text-sm">
              <PlayCircle className="mr-2 h-4 w-4" /> Ver demonstração
            </Button>
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-muted-foreground max-w-md">
            {["1 geração grátis","Sem cartão no início","Fotos privadas","Resultado em segundos"].map(t =>
              <li key={t} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent" /> {t}</li>)}
          </ul>
        </div>

        <div className="lg:col-span-6 relative">
          <div className="relative is-fade-up">
            <BeforeAfter before={emptyLiving} after={decoratedLiving} auto priority
              alt="Antes e depois — sala decorada com IA"
              className="aspect-[5/4] w-full shadow-2xl shadow-black/10 ring-1 ring-black/5" />

            {/* Floating style chip */}
            <div className="absolute -left-2 sm:left-4 top-6 bg-card/95 backdrop-blur rounded-2xl shadow-xl border p-3 pr-4 flex items-center gap-3 is-float">
              <img src={styleJapandi} alt="" className="h-10 w-10 rounded-lg object-cover" />
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Estilo aplicado</div>
                <div className="text-sm font-medium">Japandi · Sala</div>
              </div>
            </div>

            {/* Floating mini shopping list */}
            <div className="absolute -right-2 sm:-right-4 bottom-6 w-[240px] bg-card/95 backdrop-blur rounded-2xl shadow-xl border p-4 is-float" style={{ animationDelay: "1.2s" }}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Lista de compras</div>
                <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                {shoppingList.slice(0,3).map(i => (
                  <div key={i.name} className="flex items-center justify-between text-xs">
                    <span className="truncate pr-2">{i.name}</span>
                    <span className="text-muted-foreground whitespace-nowrap">{i.price.split("–")[0]}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onAffiliate("Sofá 3 lugares")}
                className="mt-3 w-full text-[11px] font-medium text-foreground/80 hover:text-foreground inline-flex items-center justify-between border-t pt-2">
                Ver lista completa <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <button
              onClick={onBudget}
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground text-xs font-medium px-4 py-2 shadow-lg hover:opacity-95">
              <Download className="h-3.5 w-3.5" /> Baixar orçamento
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- MARQUEE ----------------------------- */

function Marquee() {
  const items = ["Salas","Quartos","Cozinhas","Banheiros","Home office","Consultórios","Salas comerciais","Studios","Imóveis vazios","Varandas","Designers","Arquitetos","Imobiliárias"];
  return (
    <div className="border-y border-border/60 bg-card/40 overflow-hidden">
      <div className="is-pause-hover py-4">
        <div className="flex gap-10 is-marquee whitespace-nowrap text-sm text-muted-foreground">
          {[...items, ...items, ...items].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-3">
              <span className="h-1 w-1 rounded-full bg-accent" /> {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- EMPTY ROOMS ----------------------------- */

function SectionHead({ kicker, title, sub }: { kicker: string; title: React.ReactNode; sub?: string }) {
  return (
    <div className="max-w-2xl">
      <div className="text-[11px] uppercase tracking-[0.22em] text-accent">{kicker}</div>
      <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl tracking-[-0.02em] font-semibold leading-tight">{title}</h2>
      {sub && <p className="mt-3 text-muted-foreground">{sub}</p>}
    </div>
  );
}

function EmptyRoomsCarousel() {
  return (
    <section id="ambientes" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHead
            kicker="Ambientes"
            title={<>Escolha um <span className="font-serif italic font-normal">ambiente vazio</span> para transformar</>}
            sub="Selecione um espaço e veja como ele pode ficar decorado com IA — ou envie uma foto sua."
          />
          <div className="hidden sm:flex gap-2 text-sm text-muted-foreground">
            <button className="px-3 py-1.5 rounded-full border hover:bg-muted">Todos</button>
            <button className="px-3 py-1.5 rounded-full border hover:bg-muted">Casa</button>
            <button className="px-3 py-1.5 rounded-full border hover:bg-muted">Profissional</button>
          </div>
        </div>

        <div className="mt-10 -mx-4 sm:mx-0 overflow-x-auto sm:overflow-visible">
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 px-4 sm:px-0 snap-x snap-mandatory">
            {emptyRooms.map((r) => (
              <article key={r.title}
                className="group snap-start shrink-0 w-[78%] sm:w-auto rounded-3xl overflow-hidden bg-card border hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={r.img} alt={r.title}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.04] transition-transform duration-[1200ms]"
                    loading="lazy" />
                  <span className="absolute top-3 left-3 rounded-full bg-background/85 backdrop-blur text-[10px] uppercase tracking-widest px-2.5 py-1">
                    {r.badge}
                  </span>
                  <button className="absolute bottom-3 right-3 h-9 w-9 rounded-full bg-foreground text-background grid place-items-center opacity-0 group-hover:opacity-100 transition">
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-5 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-medium">{r.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{r.sub}</div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs">Criar aqui</Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- STYLES ----------------------------- */

function StylesCarousel() {
  return (
    <section id="estilos" className="py-20 sm:py-28 bg-card/40 border-y border-border/60 is-pause-hover overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          kicker="Estilos"
          title={<>Escolha o <span className="font-serif italic font-normal">estilo</span> do projeto</>}
          sub="A IA aplica o estilo escolhido ao ambiente selecionado, preservando a estrutura."
        />
      </div>

      <div className="mt-12 relative">
        <div className="flex gap-5 is-marquee-slow whitespace-nowrap will-change-transform">
          {[...styles, ...styles].map((s, i) => (
            <div key={i} className="shrink-0 w-[260px] sm:w-[300px] rounded-3xl overflow-hidden bg-card border">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img src={s.img} alt={s.name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                <span className="absolute bottom-3 left-3 rounded-full bg-background/85 backdrop-blur text-[10px] uppercase tracking-widest px-2.5 py-1">
                  {s.name}
                </span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">{s.sub}</div>
                <Button size="sm" variant="ghost" className="text-xs">Usar estilo →</Button>
              </div>
            </div>
          ))}
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
}

/* ----------------------------- HOW IT WORKS ----------------------------- */

function HowItWorks() {
  const steps = [
    { n: "01", icon: <ImageIcon className="h-5 w-5" />, t: "Escolha o ambiente", d: "Selecione uma foto vazia ou envie uma imagem do espaço." },
    { n: "02", icon: <Wand2 className="h-5 w-5" />,     t: "Escolha o estilo",   d: "Japandi, Moderno, Industrial, Luxo discreto e mais." },
    { n: "03", icon: <Sparkles className="h-5 w-5" />,  t: "A IA decora",        d: "Geração em segundos preservando a estrutura do ambiente." },
    { n: "04", icon: <ShoppingBag className="h-5 w-5" />,t: "Lista + orçamento", d: "Veja itens sugeridos por categoria e baixe o orçamento." },
  ];
  return (
    <section id="criar" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead kicker="Como funciona" title={<>Do <span className="font-serif italic font-normal">espaço vazio</span> ao projeto, em 4 passos</>} />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-3xl border bg-card p-6 hover:-translate-y-0.5 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent grid place-items-center">{s.icon}</div>
                <div className="font-serif text-3xl text-muted-foreground/60">{s.n}</div>
              </div>
              <div className="mt-5 text-lg font-medium">{s.t}</div>
              <div className="mt-1.5 text-sm text-muted-foreground">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- RESULT SHOWCASE ----------------------------- */

function ResultShowcase({ onBudget, onAffiliate }: { onBudget: () => void; onAffiliate: (s: string) => void }) {
  return (
    <section className="py-20 sm:py-28 bg-card/40 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          kicker="Tela de resultado"
          title={<>Seu projeto fica <span className="font-serif italic font-normal">pronto em segundos</span></>}
          sub="Imagem como protagonista, lista de compras ao lado e orçamento a um clique."
        />

        <div className="mt-12 grid lg:grid-cols-[1fr_360px] gap-6 items-start">
          <div className="rounded-3xl overflow-hidden border bg-card">
            <div className="p-3 sm:p-4 flex items-center gap-2 border-b">
              <Badge variant="secondary" className="rounded-full text-[10px] uppercase tracking-wider">Cozinha · Luxo discreto</Badge>
              <span className="text-xs text-muted-foreground">12 itens · estimativa R$ 3.000–8.000</span>
              <div className="ml-auto flex gap-2">
                <Button size="sm" variant="ghost" className="text-xs">Salvar</Button>
                <Button size="sm" variant="ghost" className="text-xs"><Zap className="h-3.5 w-3.5 mr-1" /> Variação</Button>
              </div>
            </div>
            <BeforeAfter before={emptyKitchen} after={decoratedKitchen} className="aspect-[5/3.4]" />
          </div>

          <aside className="rounded-3xl border bg-card p-5">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-base font-medium">Lista de compras</div>
                <div className="text-xs text-muted-foreground">Itens sugeridos para esse ambiente</div>
              </div>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-4 rounded-xl bg-muted/60 p-3">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Estimativa total</div>
              <div className="text-lg font-medium">R$ 3.000 – 8.000</div>
              <div className="text-xs text-muted-foreground">12 itens sugeridos</div>
            </div>

            <ul className="mt-4 divide-y">
              {shoppingList.map((it) => (
                <li key={it.name} className="py-3 flex items-start gap-3">
                  <TagBadge tag={it.tag} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{it.name}</div>
                    <div className="text-[11px] text-muted-foreground">{it.cat} · {it.price}</div>
                  </div>
                  <button onClick={() => onAffiliate(it.name)}
                    className="text-[11px] font-medium text-foreground/70 hover:text-foreground whitespace-nowrap">
                    Ver opções →
                  </button>
                </li>
              ))}
            </ul>

            <Button onClick={onBudget} className="mt-4 w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90">
              <Download className="h-4 w-4 mr-2" /> Baixar orçamento
            </Button>
            <p className="mt-2 text-[10px] text-muted-foreground">
              Alguns links podem gerar comissão para o Ideal Space, sem custo adicional para você.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

function TagBadge({ tag }: { tag: string }) {
  const map: Record<string, string> = {
    Essencial:   "bg-accent/15 text-accent",
    Recomendado: "bg-foreground/8 text-foreground",
    Opcional:    "bg-muted text-muted-foreground",
  };
  return (
    <span className={`mt-0.5 inline-flex h-5 items-center rounded-full px-2 text-[10px] uppercase tracking-wider ${map[tag] ?? ""}`}>
      {tag}
    </span>
  );
}

/* ----------------------------- GALLERY ----------------------------- */

function Gallery() {
  const filters = ["Todos","Salas","Quartos","Cozinhas","Escritórios","Consultórios","Moderno","Minimalista","Premium"];
  const items = [
    { img: decoratedLiving, t: "Sala · Japandi",        size: "lg" },
    { img: styleScandi,     t: "Sala · Escandinavo",    size: "sm" },
    { img: styleJapandi,    t: "Quarto · Japandi",      size: "sm" },
    { img: galleryOffice,   t: "Home office · Natural", size: "lg" },
    { img: styleModern,     t: "Sala · Contemporâneo",  size: "lg" },
    { img: galleryClinic,   t: "Consultório · Acolhedor", size: "sm" },
    { img: styleIndustrial, t: "Loft · Industrial",     size: "sm" },
  ];
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHead
            kicker="Inspirações"
            title={<>Ideias para <span className="font-serif italic font-normal">transformar</span> seus ambientes</>}
            sub="Explore estilos, cômodos e projetos gerados por IA."
          />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {filters.map((f, i) => (
            <button key={f}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${i===0 ? "bg-foreground text-background border-foreground" : "hover:bg-muted"}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 auto-rows-[200px] sm:auto-rows-[240px] gap-4">
          {items.map((it, i) => (
            <figure key={i}
              className={`relative overflow-hidden rounded-3xl group ${
                it.size === "lg" ? "col-span-2 row-span-2" : ""
              }`}>
              <img src={it.img} alt={it.t} loading="lazy"
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.05] transition-transform duration-[1200ms]" />
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/55 to-transparent text-white">
                <div className="text-xs sm:text-sm font-medium">{it.t}</div>
                <button className="text-[11px] opacity-90 hover:opacity-100 inline-flex items-center">
                  Gerar parecido <ArrowRight className="h-3 w-3 ml-1" />
                </button>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- PROFESSIONALS ----------------------------- */

function Professionals() {
  const modules = [
    { icon: <Briefcase className="h-5 w-5" />, t: "Designer",    d: "Variações visuais para apresentar conceitos ao cliente." },
    { icon: <Building2 className="h-5 w-5" />, t: "Arquiteto",   d: "Estudos rápidos e apresentações visuais." },
    { icon: <HomeIcon className="h-5 w-5" />,  t: "Imobiliário", d: "Virtual staging para vender ou alugar melhor." },
    { icon: <Stethoscope className="h-5 w-5" />,t: "Clínicas",   d: "Ambientes acolhedores, confiáveis e profissionais." },
  ];
  return (
    <section id="pro" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 rounded-[2rem] bg-foreground text-background p-8 sm:p-14 relative overflow-hidden">
        <div aria-hidden className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.13 55 / 0.7), transparent 60%)" }} />

        <div className="grid lg:grid-cols-12 gap-10 items-end relative">
          <div className="lg:col-span-7">
            <div className="text-[11px] uppercase tracking-[0.22em] text-accent">Para profissionais</div>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl tracking-[-0.02em] font-semibold leading-tight">
              IA para designers, <span className="font-serif italic font-normal text-accent">arquitetos</span> e imobiliárias.
            </h2>
            <p className="mt-4 text-background/70 max-w-xl">
              Acelere estudos visuais, apresente ideias a clientes e crie versões rápidas de ambientes.
              Organize projetos por cliente, exporte em PDF profissional e ofereça virtual staging premium.
            </p>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <Button className="h-12 rounded-full bg-accent text-accent-foreground hover:opacity-95 px-6">
              Conhecer recursos profissionais <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
          {modules.map(m => (
            <div key={m.t} className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-5 hover:bg-white/10 transition">
              <div className="h-10 w-10 rounded-xl bg-white/10 grid place-items-center text-accent">{m.icon}</div>
              <div className="mt-4 font-medium">{m.t}</div>
              <div className="text-sm text-background/70 mt-1">{m.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- PRICING ----------------------------- */

function Pricing() {
  return (
    <section id="planos" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <div className="text-[11px] uppercase tracking-[0.22em] text-accent">Planos</div>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl tracking-[-0.02em] font-semibold">
            Comece grátis, evolua quando <span className="font-serif italic font-normal">precisar</span>.
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Teste o Premium por 7 dias. Cancele a qualquer momento.
          </p>
        </div>

        <div className="mt-12 grid lg:grid-cols-3 gap-5 items-stretch">
          {plans.map(p => (
            <div key={p.name}
              className={`relative rounded-3xl p-7 flex flex-col border bg-card ${p.featured ? "ring-2 ring-accent shadow-2xl" : ""}`}>
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent text-accent-foreground text-[10px] uppercase tracking-widest px-3 py-1">
                  Mais escolhido
                </span>
              )}
              <div className="text-sm text-muted-foreground">{p.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.per}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>

              <ul className="mt-6 space-y-2.5 text-sm flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex gap-2"><Check className="h-4 w-4 mt-0.5 text-accent shrink-0" />{f}</li>
                ))}
              </ul>

              <Button className={`mt-7 h-11 rounded-xl ${p.featured
                ? "bg-accent text-accent-foreground hover:opacity-95"
                : "bg-foreground text-background hover:bg-foreground/90"}`}>
                {p.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border bg-card p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div>
            <div className="text-sm font-medium">Prefere pagar por uso? Compre créditos avulsos.</div>
            <div className="text-xs text-muted-foreground mt-1">Sem mensalidade. Use quando quiser.</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[["5 gerações","R$ 14,90"],["20 gerações","R$ 49,90"],["50 gerações","R$ 99,90"]].map(([q,v]) => (
              <button key={q} className="rounded-full border px-4 py-2 text-sm hover:bg-muted">
                <span className="font-medium">{q}</span> <span className="text-muted-foreground">· {v}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- TRUST ----------------------------- */

function Trust() {
  const items = [
    { icon: <Lock className="h-5 w-5" />,        t: "Fotos privadas",        d: "Suas fotos não são publicadas sem autorização." },
    { icon: <Sparkles className="h-5 w-5" />,    t: "IA ilustrativa",        d: "Imagens geradas são sugestões visuais e podem variar." },
    { icon: <ShieldCheck className="h-5 w-5" />, t: "LGPD",                  d: "Tratamos seus dados conforme a LGPD." },
    { icon: <FileText className="h-5 w-5" />,    t: "Afiliados transparentes", d: "Comissões sem custo adicional para você." },
  ];
  return (
    <section className="py-20 sm:py-28 bg-card/40 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead kicker="Segurança" title={<>Suas fotos e dados com <span className="font-serif italic font-normal">segurança</span></>} />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(i => (
            <div key={i.t} className="rounded-3xl border bg-card p-6">
              <div className="h-10 w-10 rounded-xl bg-muted text-foreground grid place-items-center">{i.icon}</div>
              <div className="mt-4 font-medium">{i.t}</div>
              <div className="text-sm text-muted-foreground mt-1">{i.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- FAQ ----------------------------- */

function FAQ() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHead kicker="Perguntas frequentes" title={<>FAQ</>} />
        <Accordion type="single" collapsible className="mt-8">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`i-${i}`} className="border-b">
              <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* ----------------------------- FOOTER ----------------------------- */

function Footer() {
  const cols = [
    { t: "Produto",       l: ["Criar com IA","Ambientes","Estilos","Galeria","Planos"] },
    { t: "Ambientes",     l: ["Salas","Quartos","Cozinhas","Banheiros","Escritórios","Consultórios"] },
    { t: "Profissionais", l: ["Designers","Arquitetos","Imobiliárias","Clínicas","Corretores"] },
    { t: "Legal",         l: ["Termos de Uso","Política de Privacidade","Política de Imagens","LGPD","Afiliados","Aviso sobre IA"] },
  ];
  return (
    <footer className="bg-foreground text-background/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-[1.4fr_3fr] gap-10">
          <div>
            <div className="text-background"><IdealSpaceLogo /></div>
            <p className="mt-5 text-sm text-background/60 max-w-sm">
              Plataforma de design de interiores com IA. Transforme ambientes vazios em projetos
              decorados, com lista de compras e orçamento.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-xs">
              <Star className="h-3 w-3 text-accent" /> Teste o Premium por 7 dias
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
            {cols.map(c => (
              <div key={c.t}>
                <div className="text-background text-xs uppercase tracking-widest">{c.t}</div>
                <ul className="mt-4 space-y-2">
                  {c.l.map(x => <li key={x}><a className="hover:text-background transition" href="#">{x}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-between text-xs text-background/50">
          <div>© {new Date().getFullYear()} Ideal Space. Todos os direitos reservados.</div>
          <div className="max-w-2xl">
            Ideal Space usa IA para gerar ideias visuais de ambientes. As imagens são ilustrativas e
            os produtos sugeridos podem conter links de afiliados.
          </div>
        </div>
      </div>
    </footer>
  );
}
