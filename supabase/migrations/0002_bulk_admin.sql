-- Upgrade migration for bulk Media Library uploads.
-- Safe to run after 0001 on an existing Yone International deployment.
create table if not exists pending_media_uploads (
  id text primary key,
  batch_id text not null,
  admin_user_id text not null references admin_users(id) on delete cascade,
  object_key text not null unique,
  original_name text not null,
  expected_mime text not null,
  expected_size integer not null,
  kind text not null,
  visibility text not null,
  expires_at integer not null,
  created_at integer not null
);
create index if not exists pending_media_batch_idx
  on pending_media_uploads(batch_id,admin_user_id,expires_at);

revoke all on table pending_media_uploads from anon, authenticated;
