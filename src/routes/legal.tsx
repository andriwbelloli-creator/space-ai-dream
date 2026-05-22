import { useEffect, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

const CONTACT_EMAIL = "contato@idealspace.com.br";
const LAST_UPDATED = "21 de maio de 2026";

const SECTIONS = [
  { id: "termos", label: "Termos de Uso" },
  { id: "privacidade", label: "Política de Privacidade" },
  { id: "imagens", label: "Política de Imagens" },
  { id: "lgpd", label: "LGPD" },
  { id: "afiliados", label: "Afiliados" },
  { id: "aviso-ia", label: "Aviso sobre IA" },
] as const;

export const Route = createFileRoute("/legal")({
  head: () => ({
    meta: [
      { title: "Termos e políticas — Ideal Space" },
      {
        name: "description",
        content:
          "Termos de Uso, Política de Privacidade, LGPD, política de imagens, divulgação de afiliados e aviso sobre IA do Ideal Space.",
      },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://idealspace.com.br/legal" }],
  }),
  component: LegalPage,
});

function Mail() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline underline-offset-2">
      {CONTACT_EMAIL}
    </a>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-12 scroll-mt-24">
      <h2 className="text-xl font-semibold tracking-[-0.01em] text-foreground sm:text-2xl">
        {title}
      </h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function LegalPage() {
  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    // Espera o scroll-reset de navegação do router antes de ancorar na seção.
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView();
    }, 120);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-xl bg-foreground text-xs text-background">
              IS
            </span>
            Ideal Space
          </Link>
          <Link
            to="/"
            className="inline-flex h-9 items-center rounded-full border px-4 text-sm hover:bg-muted"
          >
            Voltar
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="text-[11px] uppercase tracking-[0.22em] text-accent">Documentos legais</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
          Termos e políticas
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Última atualização: {LAST_UPDATED}</p>

        <nav className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-xl border px-3 py-2 text-sm transition hover:bg-muted"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <Section id="termos" title="Termos de Uso">
          <p>
            O Ideal Space é uma plataforma que usa inteligência artificial para gerar imagens de
            ambientes decorados a partir de fotos enviadas pelo usuário. Ao criar uma conta ou usar
            o serviço, você concorda com estes Termos de Uso.
          </p>
          <p>
            <strong className="text-foreground">Conta.</strong> Você é responsável por manter a
            confidencialidade das suas credenciais e por toda atividade na sua conta. É necessário
            ter 18 anos ou mais, ou autorização de um responsável.
          </p>
          <p>
            <strong className="text-foreground">Uso aceitável.</strong> Você concorda em não enviar
            conteúdo ilegal, ofensivo, que viole direitos de terceiros, nem fotos de pessoas sem o
            consentimento delas.
          </p>
          <p>
            <strong className="text-foreground">Resultados de IA.</strong> As imagens geradas são
            ilustrativas e produzidas automaticamente. Podem conter imprecisões e não constituem
            projeto arquitetônico, de engenharia ou garantia de resultado.
          </p>
          <p>
            <strong className="text-foreground">Créditos e planos.</strong> O plano gratuito oferece
            um número limitado de gerações. Planos pagos e seus limites estão descritos na página de{" "}
            <Link to="/pricing" className="text-foreground underline underline-offset-2">
              Planos
            </Link>
            .
          </p>
          <p>
            <strong className="text-foreground">Propriedade.</strong> Você mantém os direitos sobre
            as fotos que envia. O Ideal Space concede a você o direito de usar as imagens geradas
            para fins pessoais e não exclusivos.
          </p>
          <p>
            <strong className="text-foreground">Limitação de responsabilidade.</strong> O serviço é
            fornecido no estado em que se encontra. Não nos responsabilizamos por decisões de compra
            ou de reforma tomadas com base nas sugestões geradas.
          </p>
          <p>
            Podemos atualizar estes termos periodicamente. Mudanças relevantes serão comunicadas
            pelos nossos canais.
          </p>
        </Section>

        <Section id="privacidade" title="Política de Privacidade">
          <p>
            Esta política descreve como o Ideal Space coleta, usa e protege seus dados pessoais.
          </p>
          <p>
            <strong className="text-foreground">Dados coletados.</strong> E-mail e dados de conta no
            cadastro; fotos enviadas; imagens geradas; e dados de uso, como projetos criados e
            gerações realizadas.
          </p>
          <p>
            <strong className="text-foreground">Finalidade.</strong> Criar e manter sua conta, gerar
            e salvar seus projetos, melhorar o serviço e nos comunicarmos com você.
          </p>
          <p>
            <strong className="text-foreground">Onde seus dados ficam.</strong> Usamos a
            infraestrutura da Supabase para autenticação, banco de dados e armazenamento de
            arquivos. O processamento de imagens por IA é feito pelo Google (modelos Gemini).
          </p>
          <p>
            <strong className="text-foreground">Compartilhamento.</strong> Não vendemos seus dados.
            Compartilhamos informações apenas com os provedores necessários para operar o serviço e
            quando exigido por lei.
          </p>
          <p>
            <strong className="text-foreground">Armazenamento local.</strong> Usamos o armazenamento
            do seu navegador para manter sua sessão e seus rascunhos de projeto.
          </p>
          <p>
            <strong className="text-foreground">Retenção e segurança.</strong> Mantemos seus dados
            enquanto sua conta estiver ativa. Adotamos medidas técnicas razoáveis de proteção,
            embora nenhum sistema seja totalmente imune a riscos.
          </p>
          <p>
            Dúvidas sobre privacidade podem ser enviadas para <Mail />.
          </p>
        </Section>

        <Section id="imagens" title="Política de Imagens">
          <p>
            As fotos que você envia são suas. Ao enviá-las, você declara ter o direito de usá-las.
          </p>
          <p>
            Suas fotos e os ambientes gerados a partir delas são{" "}
            <strong className="text-foreground">privados por padrão</strong> — não os publicamos nem
            os exibimos a outras pessoas sem a sua autorização explícita.
          </p>
          <p>
            Usamos suas fotos apenas para gerar o seu resultado e para exibir os seus projetos a
            você dentro da plataforma.
          </p>
          <p>Não envie fotos com pessoas identificáveis sem o consentimento delas.</p>
          <p>
            Você pode excluir seus projetos e solicitar a remoção das suas imagens a qualquer
            momento, escrevendo para <Mail />.
          </p>
        </Section>

        <Section id="lgpd" title="LGPD — Lei Geral de Proteção de Dados">
          <p>O tratamento de dados pessoais pelo Ideal Space segue a Lei nº 13.709/2018 (LGPD).</p>
          <p>
            <strong className="text-foreground">Bases legais.</strong> Tratamos seus dados para a
            execução do contrato (prestar o serviço), com base no seu consentimento (por exemplo, ao
            optar por exibir um projeto publicamente) e no legítimo interesse de melhorar o produto
            e garantir a segurança.
          </p>
          <p>
            <strong className="text-foreground">Seus direitos.</strong> Você pode, a qualquer
            momento:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>confirmar a existência de tratamento e acessar seus dados;</li>
            <li>corrigir dados incompletos, inexatos ou desatualizados;</li>
            <li>solicitar a anonimização, o bloqueio ou a eliminação de dados;</li>
            <li>solicitar a portabilidade dos seus dados;</li>
            <li>obter informação sobre com quem compartilhamos seus dados;</li>
            <li>revogar o consentimento.</li>
          </ul>
          <p>
            Para exercer qualquer um desses direitos, envie um pedido para <Mail />. Responderemos
            dentro dos prazos previstos em lei.
          </p>
        </Section>

        <Section id="afiliados" title="Divulgação de Afiliados">
          <p>
            O Ideal Space participa de programas de afiliados, incluindo o Amazon Associates e o
            Magazine Você (Magalu), entre outros marketplaces.
          </p>
          <p>
            Alguns links para produtos podem gerar uma comissão para nós quando você realiza uma
            compra — <strong className="text-foreground">sem custo adicional para você</strong>.
            Essas comissões ajudam a manter o plano gratuito da plataforma.
          </p>
          <p>
            Preços e disponibilidade são definidos pelas lojas e podem variar. Confira sempre as
            informações no site da loja antes de comprar.
          </p>
          <p>
            As sugestões de produtos são geradas por IA e podem não corresponder exatamente a itens
            disponíveis em estoque.
          </p>
        </Section>

        <Section id="aviso-ia" title="Aviso sobre Inteligência Artificial">
          <p>
            As imagens do Ideal Space são geradas por inteligência artificial e têm caráter
            ilustrativo e de inspiração.
          </p>
          <p>
            A IA busca preservar a estrutura do ambiente original — paredes, janelas e perspectiva
            —, mas pode introduzir imprecisões. Proporções, medidas e itens exibidos são
            aproximados.
          </p>
          <p>
            O resultado <strong className="text-foreground">não substitui</strong> um projeto
            arquitetônico, de engenharia ou de design assinado por um profissional habilitado.
          </p>
          <p>
            Listas de compras, preços e orçamentos são estimativas automáticas. Confirme valores e
            medidas antes de comprar produtos ou iniciar uma reforma.
          </p>
        </Section>

        <p className="mt-12 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          Em caso de dúvidas sobre estes documentos, escreva para <Mail />.
        </p>
      </main>
    </div>
  );
}
