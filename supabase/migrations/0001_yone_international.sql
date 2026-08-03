-- Yone International production schema for Supabase PostgreSQL.
-- Run once in Supabase SQL Editor. Public clients receive no table privileges;
-- all website access is validated server-side through DATABASE_URL.

create table if not exists site_settings (
  key text primary key, value text not null, is_private integer not null default 0 check (is_private in (0,1)),
  updated_by text, updated_at integer not null
);
create table if not exists admin_users (
  id text primary key, email text not null unique, display_name text,
  role text not null default 'editor' check (role in ('owner','editor')),
  status text not null default 'active', invited_by text, last_login_at integer,
  created_at integer not null, updated_at integer not null
);
create index if not exists admin_users_role_idx on admin_users(role,status);

create table if not exists categories (
  id text primary key, parent_id text references categories(id) on delete restrict,
  name text not null, slug text not null unique, description text, sort_order integer not null default 0,
  status text not null default 'draft', published_at integer, archived_at integer, deleted_at integer,
  created_by text, updated_by text, created_at integer not null, updated_at integer not null
);
create index if not exists categories_parent_idx on categories(parent_id,sort_order);

create table if not exists media_assets (
  id text primary key, kind text not null, visibility text not null default 'private',
  object_key text not null unique, original_name text not null, mime_type text not null, size_bytes integer not null,
  alt_text text, caption text, status text not null default 'draft', uploaded_by text,
  deleted_at integer, created_at integer not null
);
create table if not exists pending_media_uploads (
  id text primary key, batch_id text not null, admin_user_id text not null references admin_users(id) on delete cascade,
  object_key text not null unique, original_name text not null, expected_mime text not null,
  expected_size integer not null, kind text not null, visibility text not null,
  expires_at integer not null, created_at integer not null
);
create index if not exists pending_media_batch_idx on pending_media_uploads(batch_id,admin_user_id,expires_at);

create table if not exists products (
  id text primary key, category_id text not null references categories(id) on delete restrict,
  name text not null, slug text not null unique, sku text unique, short_description text,
  overview text, features text, applications text, intended_use text, packaging text,
  customization text, disclaimer text, featured integer not null default 0 check(featured in (0,1)),
  sort_order integer not null default 0, status text not null default 'draft', published_at integer,
  archived_at integer, deleted_at integer, created_by text, updated_by text,
  created_at integer not null, updated_at integer not null
);
create index if not exists products_public_idx on products(status,category_id,published_at);
create table if not exists product_specifications (
  id text primary key, product_id text not null references products(id) on delete cascade,
  label text not null, value text not null, verified integer not null default 0 check(verified in (0,1)),
  sort_order integer not null default 0, created_at integer not null
);
create table if not exists product_variants (
  id text primary key, product_id text not null references products(id) on delete cascade,
  name text not null, sku text, details text, sort_order integer not null default 0, created_at integer not null
);
create table if not exists product_media (
  product_id text not null references products(id) on delete cascade,
  media_id text not null references media_assets(id) on delete restrict,
  sort_order integer not null default 0, is_primary integer not null default 0 check(is_primary in (0,1)),
  primary key(product_id,media_id)
);
create table if not exists related_products (
  product_id text not null references products(id) on delete cascade,
  related_product_id text not null references products(id) on delete cascade,
  sort_order integer not null default 0, primary key(product_id,related_product_id)
);

create table if not exists authors (id text primary key, name text not null, bio text, created_at integer not null);
create table if not exists blog_categories (id text primary key, name text not null, slug text not null unique, created_at integer not null);
create table if not exists blog_posts (
  id text primary key, author_id text references authors(id), category_id text references blog_categories(id),
  hero_media_id text references media_assets(id), title text not null, slug text not null unique,
  excerpt text, body text, sources text, updated_date integer, status text not null default 'draft',
  published_at integer, archived_at integer, deleted_at integer, created_by text, updated_by text,
  created_at integer not null, updated_at integer not null
);

create table if not exists gallery_albums (
  id text primary key, name text not null, slug text not null unique, description text, event_date integer,
  status text not null default 'draft', published_at integer, archived_at integer, deleted_at integer,
  created_by text, updated_by text, created_at integer not null, updated_at integer not null
);
create table if not exists gallery_images (
  id text primary key, album_id text not null references gallery_albums(id) on delete cascade,
  media_id text not null references media_assets(id) on delete restrict, caption text, alt_text text,
  image_date integer, sort_order integer not null default 0, created_at integer not null,
  unique(album_id,media_id)
);

create table if not exists jobs (
  id text primary key, title text not null, slug text not null unique, department text, location text,
  employment_type text, description text, requirements text, application_instructions text, closing_date integer,
  status text not null default 'draft', published_at integer, archived_at integer, deleted_at integer,
  created_by text, updated_by text, created_at integer not null, updated_at integer not null
);
create table if not exists job_applications (
  id text primary key, reference text not null unique, job_id text not null references jobs(id) on delete restrict,
  full_name text not null, email text not null, phone text, cover_note text,
  resume_media_id text references media_assets(id), consent_at integer not null,
  status text not null default 'new', assigned_to text, deleted_at integer,
  created_at integer not null, updated_at integer not null
);

create table if not exists rfqs (
  id text primary key, reference text not null unique, full_name text not null, email text not null,
  company text not null, country text not null, phone text, target_market text, required_standard text,
  private_label text, packaging text, desired_date text, products_text text, message text not null,
  attachment_media_id text references media_assets(id), consent_at integer not null,
  status text not null default 'new', assigned_to text, deleted_at integer,
  created_at integer not null, updated_at integer not null
);
create table if not exists rfq_items (
  id text primary key, rfq_id text not null references rfqs(id) on delete cascade,
  product_id text references products(id), product_name text not null, sku text,
  quantity integer not null check(quantity>0), notes text, created_at integer not null
);
create table if not exists rfq_baskets (
  id text primary key, expires_at integer not null, created_at integer not null, updated_at integer not null
);
create table if not exists rfq_basket_items (
  id text primary key, basket_id text not null references rfq_baskets(id) on delete cascade,
  product_id text not null references products(id) on delete cascade, quantity integer not null default 1,
  notes text, created_at integer not null, unique(basket_id,product_id)
);
create table if not exists contact_inquiries (
  id text primary key, reference text not null unique, full_name text not null, email text not null,
  company text, country text, phone text, subject text, message text not null, consent_at integer not null,
  status text not null default 'new', assigned_to text, deleted_at integer,
  created_at integer not null, updated_at integer not null
);
create table if not exists inquiry_notes (
  id text primary key, inquiry_type text not null, inquiry_id text not null,
  note text not null, created_by text not null, created_at integer not null
);

create table if not exists verified_testimonials (
  id text primary key, customer_name text not null, role_company text, country text, review_text text not null,
  review_date integer, permission_status text not null default 'pending', verification_status text not null default 'pending',
  media_id text references media_assets(id), status text not null default 'draft', published_at integer,
  archived_at integer, deleted_at integer, created_by text, updated_by text,
  created_at integer not null, updated_at integer not null
);
create table if not exists certifications (
  id text primary key, name text not null, issuer text, scope text, certificate_number text,
  valid_from integer, valid_until integer, evidence_media_id text references media_assets(id),
  verified integer not null default 0 check(verified in (0,1)), status text not null default 'draft',
  published_at integer, archived_at integer, deleted_at integer, created_by text, updated_by text,
  created_at integer not null, updated_at integer not null
);

create table if not exists seo_metadata (
  id text primary key, page_path text not null unique, title text not null, description text not null,
  og_title text, og_description text, og_media_id text references media_assets(id),
  noindex integer not null default 0 check(noindex in (0,1)), status text not null default 'draft',
  published_at integer, archived_at integer, deleted_at integer, created_by text, updated_by text,
  created_at integer not null, updated_at integer not null
);
create table if not exists redirects (
  id text primary key, source_path text not null unique, destination_path text not null,
  status_code integer not null default 301, active integer not null default 1 check(active in (0,1)),
  created_by text, created_at integer not null
);
create table if not exists analytics_events (
  id text primary key, event_name text not null, path text not null, anonymous_id text,
  referrer_domain text, utm_source text, utm_medium text, utm_campaign text,
  country text, city text, device_class text, consent_mode text not null default 'cookieless',
  is_bot integer not null default 0 check(is_bot in (0,1)), occurred_at integer not null
);
create index if not exists analytics_time_idx on analytics_events(occurred_at,event_name);
create table if not exists retention_policies (
  record_type text primary key, retention_days integer not null, mode text not null default 'disabled', updated_at integer not null
);
create table if not exists rate_limits (bucket text primary key, count integer not null, reset_at integer not null, updated_at integer not null);
create table if not exists notification_outbox (
  id text primary key, channel text not null, recipient text not null, subject text not null, payload text not null,
  status text not null default 'pending', attempts integer not null default 0, last_error text,
  created_at integer not null, sent_at integer
);
create table if not exists audit_logs (
  id text primary key, actor_email text not null, action text not null, target_type text not null,
  target_id text, metadata text, created_at integer not null
);
create index if not exists audit_time_idx on audit_logs(created_at,actor_email);
create table if not exists push_subscriptions (
  id text primary key, admin_user_id text not null references admin_users(id) on delete cascade,
  endpoint text not null unique, p256dh text not null, auth text not null, user_agent text,
  active integer not null default 1 check(active in (0,1)), last_used_at integer,
  created_at integer not null, updated_at integer not null
);

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('yone-media','yone-media',false,20971520,array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

do $$ begin
  revoke all on all tables in schema public from anon, authenticated;
  revoke all on all sequences in schema public from anon, authenticated;
exception when undefined_object then null; end $$;

insert into categories(id,parent_id,name,slug,description,sort_order,status,published_at,created_by,updated_by,created_at,updated_at) values
('cat_dental',null,'Dental Instruments','dental','Precision instruments for dental examination, treatment and specialist requirements.',10,'published',extract(epoch from now())::integer,'system-seed','system-seed',extract(epoch from now())::integer,extract(epoch from now())::integer),
('cat_beauty',null,'Beauty Instruments','beauty','Professional beauty and salon instruments for controlled, repeatable handling.',20,'published',extract(epoch from now())::integer,'system-seed','system-seed',extract(epoch from now())::integer,extract(epoch from now())::integer),
('cat_surgical',null,'Surgical Instruments','surgical','Surgical and general precision instrument manufacturing categories.',30,'published',extract(epoch from now())::integer,'system-seed','system-seed',extract(epoch from now())::integer,extract(epoch from now())::integer),
('cat_other',null,'Other Instruments','other','Administrator-created and future precision instrument ranges.',40,'published',extract(epoch from now())::integer,'system-seed','system-seed',extract(epoch from now())::integer,extract(epoch from now())::integer)
on conflict(id) do nothing;

insert into site_settings(key,value,is_private,updated_by,updated_at) values
('email','yoneinternational@gmail.com',0,'system-seed',extract(epoch from now())::integer),
('phone_display','+92 344 8416718',0,'system-seed',extract(epoch from now())::integer),
('phone_href','tel:+923448416718',0,'system-seed',extract(epoch from now())::integer),
('whatsapp_display','+92 344 8416718',0,'system-seed',extract(epoch from now())::integer),
('whatsapp_href','https://wa.me/923448416718',0,'system-seed',extract(epoch from now())::integer),
('address','Head Marala Road, Machi Khokhar, Sialkot, Pakistan',0,'system-seed',extract(epoch from now())::integer),
('instagram','https://www.instagram.com/yoneinternational/',0,'system-seed',extract(epoch from now())::integer),
('linkedin','https://www.linkedin.com/company/yoneinternational/',0,'system-seed',extract(epoch from now())::integer),
('facebook','https://www.facebook.com/share/1EfGmSE4T1/',0,'system-seed',extract(epoch from now())::integer),
('twitter','https://x.com/yoneintl',0,'system-seed',extract(epoch from now())::integer),
('catalog','https://drive.google.com/drive/folders/1PhtEZyIS4sVxh_dYCHurykNlnI6Lgrbz?usp=drive_link',0,'system-seed',extract(epoch from now())::integer),
('notification_email','yoneinternational@gmail.com',1,'system-seed',extract(epoch from now())::integer)
on conflict(key) do nothing;

insert into authors(id,name,bio,created_at) values('author_yone','Yone International Editorial Team',null,extract(epoch from now())::integer) on conflict(id) do nothing;
insert into blog_categories(id,name,slug,created_at) values('blog_company','Company Updates','company-updates',extract(epoch from now())::integer) on conflict(id) do nothing;
insert into certifications(id,name,verified,status,created_by,updated_by,created_at,updated_at) values
('cert_iso13485_draft','ISO 13485',0,'draft','system-seed','system-seed',extract(epoch from now())::integer,extract(epoch from now())::integer),
('cert_ce_draft','CE documentation',0,'draft','system-seed','system-seed',extract(epoch from now())::integer,extract(epoch from now())::integer)
on conflict(id) do nothing;
insert into retention_policies(record_type,retention_days,mode,updated_at) values
('rfqs',730,'disabled',extract(epoch from now())::integer),('contacts',730,'disabled',extract(epoch from now())::integer),
('applications',365,'disabled',extract(epoch from now())::integer),('analytics',395,'disabled',extract(epoch from now())::integer)
on conflict(record_type) do nothing;
