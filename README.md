# 🏆 Employee of the Month — Anonymous Voting Website

A lightweight, mobile-first anonymous voting web app with no user accounts, built with vanilla HTML/JS and powered by Supabase.

---

## 🚀 Architecture & Security

- **Frontend:** Single static [index.html](file:///index.html) hosted on Vercel via GitHub (no build step, no npm build required).
- **Backend:** Supabase (PostgreSQL). All tables have Row Level Security (RLS) enabled with no direct access policies.
- **Access Control:** Browser communicates strictly with PostgreSQL functions (`pub`, `chk`, `vote`, `fb`, `adm`, `add_emp`, `del_emp`, `set_rev`, `mk_codes`) via `supabase.rpc(...)`.
- **Anonymity:** Ballots store only the employee ID and month (`cid`, `month`). Voting codes and employee compliments/suggestions are never linked to voters or ballots.
- **Client Security:** Uses **only** the public Supabase `anon` key. The `service_role` key is **never** used in client code.

---

## 📋 Setup & Deployment Steps

Follow these steps to deploy and start using the voting system:

### 1. Set Up Supabase
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In your Supabase project dashboard, open the **SQL Editor** from the left navigation.
3. Open [`supabase/schema.sql`](file:///supabase/schema.sql) in this repository and copy all its contents.
4. Near the very bottom of the file, find:
   ```sql
   insert into settings(key,value) values('admin_pin','CHANGE_ME_PIN') on conflict(key) do update set value=excluded.value;
   ```
   Replace `'CHANGE_ME_PIN'` with your desired secret Admin PIN (e.g. `'4829'` or any strong passphrase).
5. Paste the SQL into the Supabase SQL Editor and click **Run**. All tables and security-definer RPC functions will be created and locked.

---

### 2. Configure Credentials in `index.html`
1. In your Supabase dashboard, navigate to **Project Settings** > **API**.
2. Find and copy:
   - **Project URL** (e.g., `https://xyzcompany.supabase.co`)
   - **Project API Keys** > `anon` `public` key
3. Open [`index.html`](file:///index.html) in your editor and locate lines 49:
   ```javascript
   const SUPABASE_URL='PASTE_YOUR_SUPABASE_PROJECT_URL',SUPABASE_ANON_KEY='PASTE_YOUR_SUPABASE_ANON_PUBLIC_KEY';
   ```
4. Replace the two placeholder strings with your actual Supabase Project URL and public `anon` key. Save the file.

---

### 3. Push to GitHub
1. Create a new repository on [github.com](https://github.com) (e.g., `employee-of-the-month`).
2. In your local terminal, commit and push:
   ```bash
   git add .
   git commit -m "Initial commit: Employee of the Month anonymous voting app"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git push -u origin main
   ```

---

### 4. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **Add New** > **Project**.
3. Import your GitHub repository.
4. In the configuration:
   - **Framework Preset:** Select **Other**.
   - **Build Command:** Leave blank (no build step).
   - **Output Directory:** Leave blank (root).
5. Click **Deploy**.
6. Once deployed, copy your production Vercel URL and share it with your team on WhatsApp or Slack.

---

### 5. Admin Initial Setup
1. Open your live site URL in your browser or phone.
2. Scroll to the bottom of the page and tap **Admin**.
3. Enter the secret PIN you configured in Step 1.
4. **Add Employees:**
   - Enter name and optional role.
   - Attach a photo (photos are automatically scaled and compressed to fit Supabase payload limits).
   - Tap **Add employee**.
5. **Generate Voting Codes:**
   - Choose the number of codes (e.g., 10 or 25).
   - Tap **Generate voting codes**.
   - Copy the generated codes list and distribute **one unique code to each staff member**.

---

### 6. Verification & Testing Checklist
- [ ] **Cast a vote:** On the public site, enter a voting code and tap **Continue**. Tap **Vote** on an employee, then tap **Tap again to confirm** within 3 seconds. The vote should succeed.
- [ ] **Check one-time code restriction:** Refresh and enter the same voting code again. The site should indicate that the code was already used for this month and refuse further votes.
- [ ] **Anonymous feedback:** Enter a code and tap **✍️ Compliment or suggestion** on an employee card. Write a note and submit.
- [ ] **Admin verification:** Log into the Admin panel with your PIN. Verify:
  - Vote counts increment in real-time.
  - The anonymous compliment/suggestion is displayed in the admin feedback section.
- [ ] **Reveal results:** In the Admin panel, tap **Reveal winner to everyone**. The top employee card will be highlighted with a crown banner and vote counts will be publicly visible to all staff.

