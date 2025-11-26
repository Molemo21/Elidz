# Environment Variables Setup

## Quick Setup

1. **Create `.env.local` file** in the project root:
   ```bash
   touch .env.local
   # or on Windows: type nul > .env.local
   ```

2. **Add your Supabase credentials** to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

3. **Get your keys from Supabase:**
   - Go to: Supabase Dashboard → Settings → API
   - Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (optional but recommended for tests)

4. **Run the test:**
   ```bash
   pnpm test:onboarding
   ```

## File Locations

The script looks for environment variables in this order:
1. `.env.local` (project root) - **Recommended**
2. `.env` (project root)
3. System environment variables

## Troubleshooting

**Error: Missing environment variables**
- Make sure `.env.local` exists in the project root (same folder as `package.json`)
- Check that variable names start with `NEXT_PUBLIC_` (for client-side access)
- No spaces around the `=` sign: `NEXT_PUBLIC_SUPABASE_URL=value`
- No quotes needed (unless value contains spaces)

**Error: dotenv not found**
- Install it: `pnpm add -D dotenv`
- Or set environment variables in your system/terminal instead

**Still not working?**
- Check the file path: Should be `ai-funding-platform/.env.local`
- Verify file has no extra extensions: `.env.local` not `.env.local.txt`
- Restart your terminal after creating the file


