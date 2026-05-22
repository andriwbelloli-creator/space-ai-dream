# Ideal Space - Diretrizes de Governança e Configuração Operacional

Este documento é a Fonte Única de Verdade (Single Source of Truth) para o desenvolvimento do projeto **Ideal Space**. Ele define a divisão de papéis entre as IAs (Antigravity/Gemini e Claude Code), regras estritas de segurança, fluxo de roteamento de modelos e o estado funcional atual do projeto.

---

## 1. Governança Oficial de Inteligência Artificial

O projeto conta com um ecossistema cooperativo de IAs com responsabilidades estritas e separação de escopos para garantir a máxima qualidade, segurança e conformidade arquitetural.

### 🤖 Antigravity / Gemini (Auditor, Arquiteto e QA)

- **Função Principal:** Planejamento, Auditoria, Garantia de Qualidade (QA), Revisão de Experiência do Usuário (UX) e SEO Estrutural.
- **Escopo de Ação:**
  - Cria planos detalhados de implementação (arquivos `.md` de planejamento).
  - Valida a integridade do código após alterações.
  - Realiza QA visual e funcional.
  - Garante conformidade com as regras de SEO e UX.
  - Avalia segurança da informação, arquitetura de dados e integridade de banco de dados (Supabase/RLS).
  - **NÃO** realiza implementações de código diretas em lote sem consentimento explícito.

### 💻 Claude Code (Executor Principal)

- **Função Principal:** Escrita, alteração física de arquivos, correção de bugs pontuais e aplicação direta do escopo técnico.
- **CLI Oficial:** `/Users/andriwbelloli/.bun/bin/claude`
- **Regra de Ativação:** O Claude Code só tem permissão para operar e executar no terminal após o usuário conceder autorização explícita via chat (ex: _"pode executar no Claude"_).

---

## 2. Roteamento de Modelos

Os modelos de IA são selecionados estrategicamente com base na complexidade e criticidade do escopo de trabalho:

| Modelo / Ferramenta | Especialidade e Casos de Uso                                                                                                                                                                                                         |
| :------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Gemini Flash**    | QA rápido, ajustes de chamadas para ação (CTAs), redação de textos, inspeção de console, ajustes responsivos simples, validação visual e análise de diffs pequenos.                                                                  |
| **Gemini Pro**      | Planejamento de arquitetura, modificações backend complexas, integração de IA, integrações Supabase/RLS, auditoria sensível de segurança, SEO estrutural, mapeamento de funil de dados e alterações multi-arquivo de grande impacto. |
| **Claude Code**     | Escrita física de código, criação/modificação de arquivos e componentes, depuração de erros em tempo real e aplicação de escopo técnico pré-aprovado pelo Gemini Pro.                                                                |

---

## 3. Regras Operacionais Fixas (Proibições e Controles)

Para blindar o ambiente de produção e o fluxo de desenvolvimento contra regressões e acessos indevidos, as seguintes restrições são aplicadas a todas as ferramentas de IA:

### 🚫 Ações Estritamente Proibidas (Sem Autorização Manual Prévia)

1.  **Build & Dev:** Não rodar `npm run build` / `bun run build` ou `npm run dev` / `bun run dev` de forma autônoma sem consentimento.
2.  **Deploy:** Não realizar deploys ou modificações de ambiente de produção de forma automática.
3.  **Banco de Dados & RLS:** Não executar migrations, alterar o Supabase diretamente ou modificar regras de RLS (Row Level Security).
4.  **Git:** Não fazer `git push` automáticos.
5.  **Dependências:** Não instalar novos pacotes ou alterar os arquivos `package.json`, `bun.lock` ou `bunfig.toml`.
6.  **Escopo:** Não alterar arquivos que estejam fora do escopo do planejamento previamente aprovado.
7.  **Auto-Correção:** Não executar loops autônomos de tentativa-e-erro para correção de código.
8.  **SQL:** Operações e scripts SQL devem sempre ser exibidos e acordados manualmente.

### 🔍 Fluxo de Auditoria Obrigatório

- Após **qualquer execução** ou alteração de arquivos pelo Claude Code, o Antigravity **deve** auditar o `git diff` antes de prosseguir com novas tarefas.

---

## 4. Estado Funcional Atual do Projeto (Lote 1 Concluído)

Este é o histórico oficial de integridade e funcionalidades ativas no código:

### 💰 Estrutura de Pricing (4 Planos)

- **Grátis:** R$ 0, 3 gerações 2D/mês (possui marca d'água nas imagens).
- **Starter:** R$ 29,90/mês, 15 gerações 2D/mês.
- **Premium:** R$ 49,90/mês, 50 gerações 2D/mês (destacado como **"Mais escolhido"**).
- **Pro:** R$ 149,90/mês, 200 gerações 2D/mês.
- _Fonte única da verdade de planos:_ `src/lib/plans.ts`

### 🔍 SEO Estrutural

- Arquivos `public/robots.txt` e `public/sitemap.xml` criados e integrados para indexação básica.

### 🛍️ Fluxo de Compras & Recomendações (Passos 4A, 4B, 4C)

- **Fallbacks por Ambiente:** Mecanismo robusto via `getShoppingFallback` em `src/lib/shopping.ts` para garantir que o fluxo de compras não quebre mesmo offline ou sem produtos cadastrados.
- **Autodetecção inteligente:** Detecção automática do tipo de cômodo (`roomType`) propagada transparentemente para o modal de upload e persistida de forma flexível em metadados para compatibilidade com rascunhos (drafts).

### 📈 Funil de Captação de Leads (Passo 5)

- **Componente:** `LeadFormModal.tsx` integrado com a API `src/lib/leads.ts`.
- **Banco de Dados:** Conexão direta com a tabela `public.leads` gravando obrigatoriamente a coluna `idea_slug = "lead-form"` (sem alteração do slug no banco).
- **Campos de Lead Ativos:** Telefone (`phone`), tipo de cômodo (`room_type`), interesse (`interest`), plano de interesse (`plan_interest`), orçamento (`budget_range`), estilo de decoração (`style`), mensagem (`message`) e consentimento LGPD (`consent_lgpd`).
- **Pontos de Entrada:** CTAs da Home, Pricing e aba de Compras (Shopping) conectados diretamente ao funil de leads.

---

## 5. Próximo Fluxo de Desenvolvimento Recomendado

Quando novas tarefas ou correções forem iniciadas:

1.  **Fase 1 (Pesquisa & Design):** Gemini Pro analisa as demandas, lê o código existente e descreve o plano arquitetural.
2.  **Fase 2 (Aprovação):** O plano é exibido para o usuário para feedback e sinal verde.
3.  **Fase 3 (Execução):** Claude Code recebe a autorização explícita para escrever os arquivos físicos.
4.  **Fase 4 (QA & Auditoria):** Antigravity analisa o `git diff`, executa testes de leitura de validação e atesta o funcionamento de UX/SEO.
