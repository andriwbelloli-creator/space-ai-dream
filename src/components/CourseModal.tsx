import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTrack } from "@/lib/use-track";
import {
  X,
  GraduationCap,
  Sparkles,
  Check,
  Clock,
  Users,
  PlayCircle,
  BadgeCheck,
  Wand2,
  Layers,
  Compass,
  ShoppingBag,
  Award,
} from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEnroll?: () => void;
};

const MODULES = [
  {
    icon: <Wand2 className="h-4 w-4" />,
    title: "Fundamentos da decoração com IA",
    duration: "1h 20min",
    lessons: 6,
    desc: "Como ler um ambiente, escolher estilos e gerar variações que realmente convencem o cliente.",
  },
  {
    icon: <Layers className="h-4 w-4" />,
    title: "Briefing visual e direção de estilo",
    duration: "1h 45min",
    lessons: 7,
    desc: "Transforme conversa de cliente em referências, paletas e um direcionamento claro para a IA.",
  },
  {
    icon: <Compass className="h-4 w-4" />,
    title: "Do 2D ao 5D: planejamento e medidas",
    duration: "2h 10min",
    lessons: 9,
    desc: "Aprenda planta baixa, layout funcional e planejamento ampliado para validar circulação, mobiliário e iluminação dos seus projetos.",
  },
  {
    icon: <ShoppingBag className="h-4 w-4" />,
    title: "Lista de compras e orçamento que vendem",
    duration: "1h 30min",
    lessons: 6,
    desc: "Construa orçamentos preliminares, PDF profissional e links de afiliados que aumentam ticket médio.",
  },
  {
    icon: <Award className="h-4 w-4" />,
    title: "Apresentação e fechamento de projeto",
    duration: "1h 15min",
    lessons: 5,
    desc: "Antes/depois, storytelling visual e roteiro de reunião que encurta o ciclo de aprovação.",
  },
];

const PERKS = [
  "Acesso vitalício a todas as aulas e atualizações",
  "Templates de briefing, paleta e proposta comercial",
  "Comunidade fechada com revisão semanal de projetos",
  "Certificado digital ao concluir os 5 módulos",
];

const FOR = [
  { icon: <Users className="h-3.5 w-3.5" />, t: "Designers" },
  { icon: <Users className="h-3.5 w-3.5" />, t: "Arquitetos" },
  { icon: <Users className="h-3.5 w-3.5" />, t: "Imobiliárias" },
  { icon: <Users className="h-3.5 w-3.5" />, t: "Home stagers" },
];

export function CourseModal({ open, onOpenChange, onEnroll }: Props) {
  const [activeModule, setActiveModule] = useState(0);
  const totalHours = "8h+";
  const totalLessons = MODULES.reduce((s, m) => s + m.lessons, 0);
  const track = useTrack();
  // Tracking de abertura — mede interesse no curso (lead magnet B2B).
  useEffect(() => {
    if (open) track("course_modal_opened");
  }, [open, track]);
  // Wrapper de enroll: registra evento ANTES de chamar callback do pai.
  const handleEnroll = () => {
    track("course_enrolled");
    onEnroll?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-1.5rem)] sm:max-w-3xl lg:max-w-5xl rounded-3xl p-0 overflow-hidden border-0 shadow-2xl max-h-[92vh] overflow-y-auto">
        <DialogTitle className="sr-only">Curso de design de interiores com IA</DialogTitle>
        <DialogDescription className="sr-only">
          Conheça os 5 módulos, o conteúdo e o investimento do curso de decoração com IA do Ideal
          Space.
        </DialogDescription>
        <button
          aria-label="Fechar"
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 z-30 h-9 w-9 rounded-full bg-background/85 backdrop-blur grid place-items-center hover:bg-background"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Hero */}
        <div className="relative bg-foreground text-background p-6 sm:p-9 overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full blur-3xl opacity-40"
            style={{
              background: "radial-gradient(circle, oklch(0.72 0.13 55 / 0.7), transparent 60%)",
            }}
          />
          <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-8 items-end">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-accent">
                <GraduationCap className="h-3.5 w-3.5" /> Curso oficial Ideal Space
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl tracking-[-0.02em] font-semibold leading-tight">
                Decoração com IA{" "}
                <span className="font-serif italic font-normal text-accent">
                  do briefing à entrega
                </span>
                .
              </h2>
              <p className="mt-3 text-background/70 max-w-xl text-sm sm:text-base">
                Em 5 módulos práticos você aprende a transformar a Ideal Space numa máquina de
                projetos, do estudo visual ao orçamento aprovado pelo cliente.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-background/80">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1.5">
                  <Clock className="h-3.5 w-3.5 text-accent" /> {totalHours} de conteúdo
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1.5">
                  <PlayCircle className="h-3.5 w-3.5 text-accent" /> {totalLessons} aulas
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1.5">
                  <BadgeCheck className="h-3.5 w-3.5 text-accent" /> Certificado
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur p-5">
              <div className="text-[10px] uppercase tracking-[0.22em] text-background/60">
                Investimento
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-semibold tracking-tight">R$ 497</span>
                <span className="text-xs text-background/60 line-through">R$ 897</span>
              </div>
              <div className="text-xs text-background/70 mt-0.5">ou 12× R$ 49,70 no cartão</div>
              <Button
                onClick={handleEnroll}
                className="mt-4 w-full h-11 rounded-full bg-accent text-accent-foreground hover:opacity-95"
              >
                Garantir minha vaga <Sparkles className="ml-1.5 h-4 w-4" />
              </Button>
              <p className="mt-2 text-[10px] text-center text-background/60">
                7 dias de garantia incondicional
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-9 grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Modules */}
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-accent">Programa</div>
            <h3 className="mt-1 text-xl sm:text-2xl font-semibold tracking-[-0.01em]">
              5 módulos, <span className="font-serif italic font-normal">um método</span>.
            </h3>

            <div className="mt-5 space-y-2">
              {MODULES.map((m, i) => {
                const active = i === activeModule;
                return (
                  <button
                    key={m.title}
                    onClick={() => setActiveModule(i)}
                    className={`w-full text-left rounded-2xl border p-4 transition ${
                      active ? "border-accent bg-accent/8 ring-1 ring-accent" : "hover:bg-muted/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-9 w-9 rounded-xl grid place-items-center shrink-0 ${
                          active ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"
                        }`}
                      >
                        {m.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground tabular-nums">
                            Módulo {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-[10px] text-muted-foreground">·</span>
                          <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {m.duration}
                          </span>
                          <span className="text-[10px] text-muted-foreground">·</span>
                          <span className="text-[10px] text-muted-foreground">
                            {m.lessons} aulas
                          </span>
                        </div>
                        <div className="mt-0.5 text-sm font-medium leading-tight">{m.title}</div>
                        {active && (
                          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                            {m.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Side: para quem é + bônus */}
          <aside className="space-y-5 lg:sticky lg:top-4 self-start">
            <div className="rounded-2xl border bg-card/60 p-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Para quem é
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {FOR.map((f) => (
                  <span
                    key={f.t}
                    className="inline-flex items-center gap-1 rounded-full border bg-background px-2.5 py-1 text-[11px]"
                  >
                    <span className="text-accent">{f.icon}</span> {f.t}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                Profissionais que entregam estudos visuais, projetos residenciais ou virtual staging
                e querem ganhar tempo sem perder qualidade.
              </p>
            </div>

            <div className="rounded-2xl border bg-card/60 p-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Está incluso
              </div>
              <ul className="mt-2 space-y-2">
                {PERKS.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-xs">
                    <span className="mt-0.5 h-4 w-4 rounded-full bg-accent/15 text-accent grid place-items-center shrink-0">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                    <span className="text-foreground/80 leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              onClick={() => onEnroll?.()}
              className="w-full h-11 rounded-full bg-foreground text-background hover:bg-foreground/90"
            >
              Quero me inscrever <Sparkles className="ml-1.5 h-4 w-4" />
            </Button>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}
