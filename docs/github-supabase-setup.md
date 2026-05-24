# Casarei: GitHub and Supabase setup

## GitHub

This folder is now a local Git repository.

To connect it to GitHub:

1. Create an empty repository on GitHub.
2. Copy the repository URL, for example:
   `https://github.com/SEU_USUARIO/casarei.git`
3. Run:

```powershell
git remote add origin https://github.com/SEU_USUARIO/casarei.git
git branch -M main
git add .
git commit -m "Initial Casarei app"
git push -u origin main
```

If Git asks for login, use your GitHub account or a personal access token.

## Supabase

1. Create a project at Supabase.
2. Open SQL Editor.
3. Paste and run `docs/supabase-schema.sql`.
4. Go to Project Settings > API.
5. Copy:
   - Project URL
   - anon public key
   - service_role key
6. Create `.env.local` from `.env.example`:

```powershell
Copy-Item .env.example .env.local
```

7. Fill:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=SUA_SERVICE_ROLE_KEY
```

Never commit `.env.local`.

## Recommended data flow

- Onboarding creates a row in `weddings`.
- Guests use `guests` and `guest_groups`.
- Presence and tables use `guests`, `seating_tables`, and `seating_assignments`.
- Vendors use `vendors`.
- Quotes use `quotes`.
- Finance uses `payments`.
- Tasks use `tasks`.
- Vendor contracts, proofs, quotes, and images use Supabase Storage plus the `files` table.

The current app still uses mock/localStorage data in many screens. The next step is migrating one module at a time to these tables.
