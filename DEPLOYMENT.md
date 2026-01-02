# Deployment Guide for Chat Together

This guide will help you deploy the backend to **Supabase** and the frontend to **Vercel** (via GitHub).

## 1. Backend Setup (Supabase)

### Step 1.1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click "New Project".
3. Enter your organization, project name (e.g., `chat-together`), and database password.
4. Select a region close to you.
5. Click "Create new project".

### Step 1.2: Set up the Database Schema
1. Once the project is ready, go to the **SQL Editor** (icon on the left sidebar).
2. Click "New query".
3. Open the `supabase/schema.sql` file in your project folder.
4. Copy the entire content of `supabase/schema.sql`.
5. Paste it into the SQL Editor in Supabase.
6. Click "Run" to execute the query. This will create all necessary tables and security policies.

### Step 1.3: Enable Realtime (Included in Schema)
The `supabase/schema.sql` file now includes commands to automatically enable Realtime for the necessary tables. You **do not** need to change any settings in the dashboard (avoid the "Replication" menu as that often refers to paid features).

Simply running the SQL query in Step 1.2 is enough.

### Step 1.4: Authentication Settings (Important!)
By default, Supabase requires users to verify their email address before logging in.

**Option A: Disable Email Confirmation (Recommended for Dev)**
1. Go to **Authentication** -> **Providers** -> **Email**.
2. **Disable** "Confirm email".
3. Click "Save".

**Option B: Keep Email Confirmation (Production)**
If you want to keep email confirmation enabled:
1. Go to **Authentication** -> **URL Configuration**.
2. In **Site URL**, enter your Vercel URL (e.g., `https://chat-together-xyz.vercel.app`).
3. In **Redirect URLs**, add the same URL.
4. Click "Save".

### Step 1.5: Get API Credentials
1. Go to **Project Settings** (cog icon) -> **API**.
2. Copy the **Project URL**.
3. Copy the **anon public** key.

You will need these for the frontend deployment.

## 2. Frontend Setup (GitHub & Vercel)

### Step 2.1: Push to GitHub
1. Create a new repository on [GitHub](https://github.com/new).
2. Initialize git in your local project if you haven't already:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Link your local repo to GitHub (replace `<your-username>` and `<repo-name>`):
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```

### Step 2.2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click "Add New..." -> "Project".
3. Import your GitHub repository (`chat-together`).
4. In the **Configure Project** screen:
   - **Framework Preset**: Next.js (should be auto-detected).
   - **Environment Variables**: Expand this section and add the following:
     - `NEXT_PUBLIC_SUPABASE_URL`: Paste your Supabase Project URL.
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Paste your Supabase anon public key.
5. Click "Deploy".

## 3. Post-Deployment Verification

1. Once deployed, open your Vercel URL (e.g., `https://chat-together-xyz.vercel.app`).
2. Go to the Sign Up page (`/auth/register`).
3. Create a new account.
4. If successful, you should be redirected to the chat interface.
5. Open the app in another browser or incognito window.
6. Create another account.
7. Search for the first user and start a chat.
8. Verify that messages appear in real-time.

## Troubleshooting

- **Build Errors**: Check the "Logs" tab in Vercel. Common issues include missing environment variables.
- **Database Errors**: Ensure you ran the SQL schema correctly in Supabase.
- **Real-time not working**: Check Supabase "Replication" settings and ensure `messages` table has Realtime enabled.
