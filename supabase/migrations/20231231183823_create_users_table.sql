create table users (
  id uuid primary key default uuid_generate_v4(),
  username text not null unique,
  name text not null,
  email text not null,
  role text null default 'BM',
  additional_info jsonb null,
  status boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz
);

create extension if not exists moddatetime schema extensions;
create trigger handle_updated_at before update on users
  for each row execute procedure moddatetime (updated_at);
