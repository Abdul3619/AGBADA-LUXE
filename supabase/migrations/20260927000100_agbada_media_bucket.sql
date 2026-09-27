-- Public image bucket for Agbada Luxe product photos. Anyone can view images (public bucket); uploading is
-- only allowed to a path reserved by a signed-in admin through agbada_admin_create_upload() within the last
-- 10 minutes. Paths are random UUIDs, and existing files cannot be overwritten (no UPDATE/DELETE policies).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('agbada-media', 'agbada-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "agbada_media_ticketed_upload" on storage.objects;
create policy "agbada_media_ticketed_upload" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'agbada-media' and public.agbada_upload_allowed(name));

-- Lets the upload request read back the row it just created (the bucket is public anyway).
drop policy if exists "agbada_media_read" on storage.objects;
create policy "agbada_media_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'agbada-media');
