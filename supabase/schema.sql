-- AgencyOS Supabase schema for agency project management.
-- Run this in Supabase SQL editor or via psql after creating a project.

create type user_role as enum ('owner', 'employee', 'client');

create table profiles (
  id uuid primary key,
  email text not null unique,
  full_name text,
  company text,
  role user_role not null default 'client',
  avatar_url text,
  created_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete restrict,
  client_id uuid not null references profiles(id) on delete restrict,
  name text not null,
  description text,
  status text not null default 'active',
  progress int not null default 0 check (progress >= 0 and progress <= 100),
  deadline date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  assigned_to uuid references profiles(id),
  title text not null,
  status text not null default 'todo',
  flagged boolean not null default false,
  due_date date,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  receiver_id uuid references profiles(id) on delete cascade,
  recipients uuid[] not null default array[]::uuid[],
  body text not null,
  content text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table attendance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  employee_id uuid not null references profiles(id) on delete cascade,
  date date not null,
  day date not null,
  checked_in_at timestamptz,
  check_in timestamptz,
  check_out timestamptz,
  status text not null default 'present',
  notes text,
  created_at timestamptz not null default now()
);

create unique index attendance_unique_day_employee on attendance(employee_id, day);
create unique index attendance_unique_date_user on attendance(user_id, date);

-- Seed sample data for dashboard testing.

insert into profiles (id, email, full_name, company, role, avatar_url)
values
  ('11111111-1111-1111-1111-111111111111', 'owner@agencyos.com', 'Avery Owner', 'AgencyOS Studio', 'owner', 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=80&q=80'),
  ('22222222-2222-2222-2222-222222222222', 'emily@agencyos.com', 'Emily Talent', 'AgencyOS Studio', 'employee', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80'),
  ('33333333-3333-3333-3333-333333333333', 'client@acme.com', 'Jordan Client', 'Acme Co.', 'client', 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=80&q=80');

insert into projects (id, owner_id, client_id, name, description, status, progress, deadline)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Website Refresh', 'Redesign client landing pages and improve conversion flows.', 'active', 55, '2026-06-15');

insert into tasks (id, project_id, assigned_to, title, status, flagged, due_date)
values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Design homepage hero section', 'in_progress', false, '2026-05-20'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Draft project kickoff brief', 'todo', true, '2026-05-18');

insert into messages (id, project_id, sender_id, receiver_id, recipients, body, content, is_read)
values
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', array['33333333-3333-3333-3333-333333333333']::uuid[], 'The team has launched the homepage refresh draft. Please review the latest design and share feedback by the end of the week.', 'The team has launched the homepage refresh draft. Please review the latest design and share feedback by the end of the week.', false),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', array['11111111-1111-1111-1111-111111111111']::uuid[], 'I tagged the kickoff deck with next steps and blocked items. I need the client review before Friday.', 'I tagged the kickoff deck with next steps and blocked items. I need the client review before Friday.', false);

insert into attendance (id, user_id, employee_id, date, day, checked_in_at, check_in, check_out, status, notes)
values
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', current_date, current_date, now() - interval '2 hours', now() - interval '2 hours', null, 'present', 'Checked in early for the daily scrum.');
