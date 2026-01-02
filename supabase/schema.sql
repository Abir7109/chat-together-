-- Reset Schema (Drop existing tables and functions to avoid conflicts)
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists messages cascade;
drop table if exists chat_members cascade;
drop table if exists chats cascade;
drop table if exists profiles cascade;

-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  push_token text,
  public_key text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for chats
create table chats (
  id uuid default uuid_generate_v4() primary key,
  type text check (type in ('direct', 'group')) not null,
  name text,
  created_by uuid references auth.users,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  e2ee boolean default false
);

-- Create a table for chat members
create table chat_members (
  chat_id uuid references chats on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (chat_id, user_id)
);

-- Create a table for messages
create table messages (
  id uuid default uuid_generate_v4() primary key,
  chat_id uuid references chats on delete cascade not null,
  author_id uuid references profiles(id) on delete cascade not null,
  content text,
  reply_to_id uuid references messages(id) on delete set null,
  media jsonb default '[]'::jsonb,
  reactions jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone
);

-- Set up Row Level Security (RLS)

-- Profiles Policies
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Chats Policies
alter table chats enable row level security;

create policy "Chats are viewable by members."
  on chats for select
  using (
    exists (
      select 1 from chat_members
      where chat_id = chats.id
      and user_id = auth.uid()
    )
  );

create policy "Users can create chats."
  on chats for insert
  with check ( true );

-- Chat Members Policies
alter table chat_members enable row level security;

create policy "Members are viewable by chat members."
  on chat_members for select
  using (
    exists (
      select 1 from chat_members cm
      where cm.chat_id = chat_members.chat_id
      and cm.user_id = auth.uid()
    )
  );

create policy "Users can add themselves or others to chats."
  on chat_members for insert
  with check ( true ); -- You might want to restrict this in a real app

-- Messages Policies
alter table messages enable row level security;

create policy "Messages are viewable by chat members."
  on messages for select
  using (
    exists (
      select 1 from chat_members
      where chat_id = messages.chat_id
      and user_id = auth.uid()
    )
  );

create policy "Users can insert messages in chats they belong to."
  on messages for insert
  with check (
    auth.uid() = author_id and
    exists (
      select 1 from chat_members
      where chat_id = messages.chat_id
      and user_id = auth.uid()
    )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable Realtime for these tables
-- This automatically enables the free "Replication" feature for these tables
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table chats;
alter publication supabase_realtime add table chat_members;
