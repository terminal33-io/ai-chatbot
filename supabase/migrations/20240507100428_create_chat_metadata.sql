create table chat_metadata (
    id uuid primary key default uuid_generate_v4(),
    chat_id text not null,
    message_id text not null,
    metadata jsonb null,
    created_at timestamptz default now(),
    constraint chat_id_message_id_unqiue_key unique (chat_id, message_id)
  )