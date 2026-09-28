# Agbada Luxe

I built this website and owner dashboard for Agbada Luxe. It has a public collection, product pages, consultation bookings, a contact form and a newsletter sign-up, and the owner manages all of it from a password-protected studio at `/admin`.

## Stack

- React 19 + Vite + Tailwind CSS 4, deployed on Vercel as a static single-page app (`vercel.json` forces the Vite preset).
- Supabase (Postgres + Storage) for all data. There is no custom server.

## How the data is protected

The browser talks to Supabase with the public (publishable) key only. That key cannot read or write any table:

- Every `agbada_*` table has row level security enabled, no policies, and all grants revoked.
- The site can only call a fixed set of `agbada_*` database functions (see
  `supabase/migrations/20260927000000_agbada_store.sql`). Public functions return published products and site text,
  and accept bookings and newsletter sign-ups, with rate limits.
- Every admin function requires a session token. Tokens come from `agbada_admin_login`: the password is checked
  against a bcrypt hash, the token is stored only as a SHA-256 hash, sessions last 12 hours, and 5 failed attempts lock
  the account for 15 minutes. Changing the password signs out every other session.
- Image uploads go to the public `agbada-media` bucket (5 MB, JPEG/PNG/WebP/AVIF). Storage only accepts an upload
  to a random path that a signed-in admin reserved in the last 10 minutes. Photos are resized to 2000 px in the browser
  before upload.

## Using the studio

Go to `/admin` and sign in.

| Section | What it does |
| --- | --- |
| Products | Add, edit, hide or delete pieces, including name, category, price (blank means "Price on request"), description, image and display order. Changes appear on the website as soon as you save. |
| Bookings | Consultation requests and contact-form messages. You can set a status on each one. |
| Newsletter | Footer sign-ups. You can remove an address or export the list as CSV. |
| Site content | Homepage headline, introduction and image; About page text; and contact details (email, phone, WhatsApp, Instagram, address and hours). Empty fields are hidden on the site. |
| Account | Change the password. |

### Adding another admin or resetting a password

Run this in the Supabase SQL editor:

```sql
-- new admin
insert into agbada_admins (email, password_hash)
values (lower('person@example.com'), extensions.crypt('a-long-unique-password', extensions.gen_salt('bf', 12)));

-- reset a password (also signs out that admin's sessions)
update agbada_admins set password_hash = extensions.crypt('new-long-password', extensions.gen_salt('bf', 12)),
       password_changed_at = now() where email = 'person@example.com';
delete from agbada_sessions where admin_id = (select id from agbada_admins where email = 'person@example.com');
```

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint     # type check
npm run build    # production build in dist/
```

The Supabase URL and publishable key are built in (they are public by design). To point a build at another project,
set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (see `.env.example`). If you do, apply both files in
`supabase/migrations/` to that project first.

## Notes for handover

- The data currently lives in a Supabase project shared with the developer's portfolio. All objects are prefixed
  `agbada_`, as is the `agbada-media` storage bucket. To move them to the client's own project, apply the two
  migrations there, create the admin with the SQL above, and set the two `VITE_` variables in Vercel.
- The three photographs in `src/assets/images` are placeholders. Replace them with the house's own photography, or
  upload a homepage image under Site content.
- Deleting or replacing a product image does not remove the old file from storage. You can clean up unused files in
  the Supabase Storage dashboard.
