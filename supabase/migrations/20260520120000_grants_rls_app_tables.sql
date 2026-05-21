-- ============================================================
-- Ideal Space — correção da camada de permissão (GRANTs + RLS)
-- Projeto Supabase: tuftobschhomtwsuerus
--
-- Por quê: o projeto tinha as tabelas mas SEM os GRANTs e as
-- políticas RLS para o role `authenticated`. Resultado: usuário
-- comum tomava 403 (42501 permission denied for table projects).
--
-- O que faz: adiciona GRANTs + políticas RLS nas 5 tabelas do app
-- e garante o bucket de storage público.
--
-- Seguro: IDEMPOTENTE (pode rodar mais de uma vez) e NÃO-DESTRUTIVO
-- — não apaga dados, não dropa tabelas, não altera colunas.
--
-- Fonte: políticas extraídas das migrations do Home Office Life.
-- ============================================================

begin;

-- ---- função has_role (usada pelas políticas de user_roles / ideas) ----
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- ============================ projects ============================
grant select, insert, update, delete on public.projects to authenticated;
alter table public.projects enable row level security;

drop policy if exists "projects owner read" on public.projects;
create policy "projects owner read" on public.projects
  for select using (auth.uid() = user_id or is_public = true);

drop policy if exists "projects owner write" on public.projects;
create policy "projects owner write" on public.projects
  for insert with check (auth.uid() = user_id);

drop policy if exists "projects owner update" on public.projects;
create policy "projects owner update" on public.projects
  for update using (auth.uid() = user_id);

drop policy if exists "projects owner delete" on public.projects;
create policy "projects owner delete" on public.projects
  for delete using (auth.uid() = user_id);

-- ========================== user_credits ==========================
grant select, insert, update on public.user_credits to authenticated;
alter table public.user_credits enable row level security;

drop policy if exists "Users view own credits" on public.user_credits;
create policy "Users view own credits" on public.user_credits
  for select using (auth.uid() = user_id);

drop policy if exists "Users insert own credits" on public.user_credits;
create policy "Users insert own credits" on public.user_credits
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users update own credits" on public.user_credits;
create policy "Users update own credits" on public.user_credits
  for update using (auth.uid() = user_id);

-- ====================== credit_transactions ======================
grant select, insert on public.credit_transactions to authenticated;
alter table public.credit_transactions enable row level security;

drop policy if exists "Users view own transactions" on public.credit_transactions;
create policy "Users view own transactions" on public.credit_transactions
  for select using (auth.uid() = user_id);

drop policy if exists "Users insert own transactions" on public.credit_transactions;
create policy "Users insert own transactions" on public.credit_transactions
  for insert with check (auth.uid() = user_id);

-- =========================== user_roles ===========================
grant select on public.user_roles to authenticated;
alter table public.user_roles enable row level security;

drop policy if exists "user_roles self read" on public.user_roles;
create policy "user_roles self read" on public.user_roles
  for select using (
    auth.uid() = user_id
    or public.has_role(auth.uid(), 'admin'::public.app_role)
  );

drop policy if exists "user_roles admin manage" on public.user_roles;
create policy "user_roles admin manage" on public.user_roles
  for all using (public.has_role(auth.uid(), 'admin'::public.app_role));

-- ============================== ideas ==============================
grant select on public.ideas to anon, authenticated;
alter table public.ideas enable row level security;

drop policy if exists "ideas public read" on public.ideas;
create policy "ideas public read" on public.ideas
  for select using (
    is_active = true
    or public.has_role(auth.uid(), 'admin'::public.app_role)
  );

drop policy if exists "ideas admin manage" on public.ideas;
create policy "ideas admin manage" on public.ideas
  for all using (public.has_role(auth.uid(), 'admin'::public.app_role));

-- ==================== storage: bucket homeoffice ====================
-- garante que o bucket existe e é público (URLs das imagens geradas)
insert into storage.buckets (id, name, public)
values ('homeoffice', 'homeoffice', true)
on conflict (id) do update set public = true;

commit;

-- recarrega o cache de schema do PostgREST
notify pgrst, 'reload schema';
