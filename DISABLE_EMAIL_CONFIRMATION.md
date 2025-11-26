# How to Disable Email Confirmation in Supabase

## Quick Fix: Disable Email Confirmation for Development

If you want to disable email confirmation during development (recommended), follow these steps:

### Option 1: Disable in Supabase Dashboard (Recommended for Development)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **Settings** → **Email Auth** (left sidebar)
4. Find the **"Enable email confirmations"** toggle
5. **Turn it OFF** (uncheck the box)
6. Click **Save**

### Option 2: Auto-Confirm Existing Users (SQL)

If you want to keep email confirmation enabled but confirm existing users:

1. Go to **SQL Editor** in Supabase Dashboard
2. Run the `AUTO_CONFIRM_EXISTING_USERS.sql` script
3. This will confirm all existing users' email addresses

### Option 3: Confirm Users Manually

1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Click on a user to open details
3. Find the **"Confirm email"** button or check the **"Email Confirmed"** checkbox
4. Click **Save**

---

## Production Setup

For production, **keep email confirmation enabled** for security. Instead:

1. Set up proper email templates
2. Configure email SMTP settings
3. Use the "Resend Confirmation Email" button on the login page
4. Users will receive confirmation emails automatically during registration

---

## Troubleshooting

### Users still can't log in after disabling confirmation?

1. **Clear browser cache** - Old sessions might be cached
2. **Confirm existing users manually** - Run the SQL script to auto-confirm
3. **Check Supabase logs** - Look for auth errors in the dashboard
4. **Verify settings** - Make sure the toggle is actually OFF

### Want to re-enable email confirmation?

1. Follow Option 1 above
2. Turn the toggle **ON**
3. New registrations will require email confirmation
4. Existing users remain confirmed


