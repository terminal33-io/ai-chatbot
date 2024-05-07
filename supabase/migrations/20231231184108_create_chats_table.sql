create table chats (
  id text primary key,
  user_id uuid references users(id) not null,
  title text not null,
  messages jsonb not null,
  additional_info jsonb null,
  created_at timestamptz default now(),
  deleted_at timestamptz null
)
