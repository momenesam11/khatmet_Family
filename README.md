# ختمة عيلة — Next.js + Supabase Starter

## 1) Install

```bash
npm install
cp .env.example .env.local
npm run dev
```

## 2) Supabase setup

1. Create a new Supabase project.
2. Open SQL Editor.
3. Paste and run `supabase/schema.sql`.
4. Go to Project Settings > API.
5. Copy:
   - Project URL
   - anon public key
6. Put them in `.env.local`.

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 3) Make yourself super admin

1. Run the app.
2. Create an account from `/signup`.
3. Go to Supabase SQL Editor and run:

```sql
update public.profiles
set role = 'super_admin'
where email = 'your-email@example.com';
```

## 4) Main routes

- `/` landing page
- `/signup` create family owner account
- `/login` login
- `/dashboard` family owner dashboard
- `/admin` your platform admin dashboard
- `/member/[token]` member portal without login

## 5) Deploy to Vercel

1. Push project to GitHub.
2. Import repo in Vercel.
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy.
5. Update `NEXT_PUBLIC_SITE_URL` to your Vercel production URL.
"# khatmet_Family" 
"# khatmet_Family" 
