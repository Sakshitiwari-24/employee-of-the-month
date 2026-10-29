-- Employee of the Month: run this whole file once in Supabase > SQL Editor
-- STEP 1: change CHANGE_ME_PIN in the INSERT near the bottom to your own secret admin PIN.

create table if not exists employees(
  id text primary key default 'e'||floor(extract(epoch from clock_timestamp())*1000)::text,
  name text not null, role text default '', photo text default '', created_at timestamptz default now());
create table if not exists ballots(month text not null, cid text not null);          -- no voter info stored
create table if not exists codes(code text primary key, used_month text);
create table if not exists feedback(month text not null, eid text not null, kind text not null, body text not null); -- no author stored
create table if not exists settings(key text primary key, value text);

-- Lock every table: the website can only use the functions below, never read tables directly
alter table employees enable row level security;
alter table ballots   enable row level security;
alter table codes     enable row level security;
alter table feedback  enable row level security;
alter table settings  enable row level security;

create or replace function _mon() returns text language sql stable as $$
  select to_char(now() at time zone 'Asia/Kolkata','YYYY-MM') $$;

create or replace function _auth(p text) returns void language plpgsql security definer set search_path=public as $$
begin if p is distinct from (select value from settings where key='admin_pin') then raise exception 'Wrong admin PIN'; end if; end $$;
revoke execute on function _auth(text) from public, anon, authenticated;

create or replace function pub() returns jsonb language sql security definer set search_path=public as $$
  select jsonb_build_object(
    'm', _mon(),
    'rev', coalesce((select value=_mon() from settings where key='rev'), false),
    'total', (select count(*) from ballots where month=_mon()),
    'counts', case when coalesce((select value=_mon() from settings where key='rev'), false)
      then coalesce((select jsonb_object_agg(cid,n) from (select cid,count(*) n from ballots where month=_mon() group by cid) x),'{}'::jsonb)
      else '{}'::jsonb end,
    'emps', coalesce((select jsonb_agg(jsonb_build_object('id',id,'name',name,'role',role,'photo',photo) order by created_at) from employees),'[]'::jsonb)) $$;

create or replace function chk(p_code text) returns jsonb language plpgsql security definer set search_path=public as $$
declare r codes;
begin
  select * into r from codes where code=upper(trim(p_code));
  if not found then raise exception 'Invalid code. Please check with your admin.'; end if;
  return jsonb_build_object('used', r.used_month is not distinct from _mon());
end $$;

create or replace function vote(p_code text, p_cid text) returns void language plpgsql security definer set search_path=public as $$
declare r codes;
begin
  select * into r from codes where code=upper(trim(p_code)) for update;
  if not found then raise exception 'Invalid code'; end if;
  if r.used_month = _mon() then raise exception 'This code has already voted this month'; end if;
  if not exists(select 1 from employees where id=p_cid) then raise exception 'Employee not found'; end if;
  insert into ballots(month,cid) values(_mon(),p_cid);
  update codes set used_month=_mon() where code=r.code;
end $$;

create or replace function fb(p_code text, p_eid text, p_kind text, p_text text) returns void language plpgsql security definer set search_path=public as $$
begin
  perform chk(p_code);
  if length(trim(coalesce(p_text,'')))=0 then raise exception 'Please write something'; end if;
  insert into feedback values(_mon(), p_eid, case when p_kind='suggestion' then 'suggestion' else 'compliment' end, left(trim(p_text),600));
end $$;

create or replace function adm(p_pin text) returns jsonb language plpgsql security definer set search_path=public as $$
begin
  perform _auth(p_pin);
  return jsonb_build_object(
    'counts', coalesce((select jsonb_object_agg(cid,n) from (select cid,count(*) n from ballots where month=_mon() group by cid) x),'{}'::jsonb),
    'total', (select count(*) from ballots where month=_mon()),
    'codes', (select count(*) from codes),
    'used', (select count(*) from codes where used_month=_mon()),
    'fb', coalesce((select jsonb_agg(jsonb_build_object('eid',eid,'kind',kind,'text',body)) from feedback where month=_mon()),'[]'::jsonb));
end $$;

create or replace function add_emp(p_pin text, p_name text, p_role text, p_photo text) returns void language plpgsql security definer set search_path=public as $$
begin
  perform _auth(p_pin);
  if length(trim(coalesce(p_name,'')))=0 then raise exception 'Name required'; end if;
  insert into employees(name,role,photo) values(trim(p_name), trim(coalesce(p_role,'')), left(coalesce(p_photo,''),150000));
end $$;

create or replace function del_emp(p_pin text, p_id text) returns void language plpgsql security definer set search_path=public as $$
begin perform _auth(p_pin); delete from employees where id=p_id; end $$;

create or replace function set_rev(p_pin text, p_on boolean) returns void language plpgsql security definer set search_path=public as $$
begin
  perform _auth(p_pin);
  if p_on then insert into settings values('rev',_mon()) on conflict(key) do update set value=excluded.value;
  else delete from settings where key='rev'; end if;
end $$;

create or replace function mk_codes(p_pin text, p_n int) returns jsonb language plpgsql security definer set search_path=public as $$
declare a text:='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; c text; o text[]:='{}'; i int;
begin
  perform _auth(p_pin);
  p_n := least(greatest(coalesce(p_n,1),1),300);
  while coalesce(array_length(o,1),0) < p_n loop
    c:=''; for i in 1..6 loop c:=c||substr(a,1+floor(random()*32)::int,1); end loop;
    if not exists(select 1 from codes where code=c) and not (c = any(o)) then o:=o||c; end if;
  end loop;
  insert into codes(code) select unnest(o);
  return to_jsonb(o);
end $$;

-- STEP 1 (important): set your admin PIN here
insert into settings(key,value) values('admin_pin','CHANGE_ME_PIN') on conflict(key) do update set value=excluded.value;
