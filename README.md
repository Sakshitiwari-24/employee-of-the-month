# 🏆 Employee of the Month — Voting & Verification Dashboard

A mobile-first, interactive, and verified employee voting system where staff log in, cast their vote for colleagues, and administrators can audit participation, verify who has voted for whom, and manage employee profiles and photos.

🔗 **Live URL:** [https://employee-of-the-month-pink.vercel.app](https://employee-of-the-month-pink.vercel.app)

---

## ✨ Key Features

### 👤 1. Employee Login & Voting Verification
- **Verified Staff Voting:** Employees select their profile from the roster and enter their PIN (default PIN: `1111`) to log in.
- **Vote Once Per Month:** The system tracks voting status for the current month. Once an employee votes, their ballot is permanently locked for that month.
- **Self-Vote Prevention:** Employees cannot vote for themselves.
- **Two-Tap Confirmation:** Confirms intent with an animated 3-second confirmation step.
- **Session Switcher:** One-tap "Switch Employee / Log Out" so multiple team members can vote from a shared office tablet or phone.

### 📊 2. Admin Audit: Who Voted For Whom
- **Live Participation Stats:** Real-time summary of Total Employees, Votes Cast, Pending Voters, and Turnout percentage.
- **Who Voted For Whom Table:** Admin can inspect the full voting audit showing exactly which employee voted for which candidate, complete with date and time.
- **Pending Voters List:** Displays names of all employees who haven't voted yet, with a **"Copy WhatsApp Reminder"** button to nudge pending staff with one tap.

### 🖼️ 3. Employee Management & Photo Upload/Editing
- **Permanent Saving:** Optimized, compact image compression (150x150 Retina square thumbnails, ~6KB) prevents storage quota failures and ensures newly added employees are permanently saved.
- **Upload / Replace Photos Anytime:** Added an **"📷 Edit / Photo"** option for every employee. If an employee was added with only a name, admin can upload a photo file or paste an image URL at any time.
- **Update Names & Roles:** Edit employee details, roles, or remove photos back to initials.

### 📲 4. Instant WhatsApp Sharing with Roster Sync
- **Share on WhatsApp:** Tap the WhatsApp button to share the voting link with team members.
- **Automatic Roster Syncing:** Newly added employees are encoded into the share link, ensuring that when staff tap the WhatsApp link on their phones, the latest roster is automatically updated and saved in their local session!

---

## 🚀 Quick Start Guide

1. Open [https://employee-of-the-month-pink.vercel.app](https://employee-of-the-month-pink.vercel.app).
2. **Employee Login:**
   - Select an employee name from the dropdown.
   - Enter PIN `1111` and tap **Login to Vote**.
   - Browse colleague cards and tap **Vote for [Name]** → tap again within 3 seconds to confirm.
3. **Admin Dashboard:**
   - Tap **⚙️ Admin Login** at the bottom.
   - Enter Admin PIN `1234`.
   - View **"Who Has Voted For Whom"** and **"Pending Voters"**.
   - Add new employees or tap **📷 Edit / Photo** on existing staff to upload photos.
   - Tap **🎉 Reveal Winner to Everyone** when voting is complete!
