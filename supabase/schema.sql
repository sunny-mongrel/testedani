create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  nome       text not null default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "perfil: ler o proprio"    on public.profiles;
drop policy if exists "perfil: editar o proprio" on public.profiles;

create policy "perfil: ler o proprio" on public.profiles
  for select to authenticated using (id = (select auth.uid()));

create policy "perfil: editar o proprio" on public.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;

create or replace function public.criar_perfil_novo_usuario()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, nome)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nome', ''));
  return new;
end;
$$;

drop trigger if exists ao_criar_usuario on auth.users;
create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.criar_perfil_novo_usuario();
