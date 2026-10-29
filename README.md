# 🏆 Employee of the Month — Voting & Verification Dashboard

A mobile-first, interactive, and verified employee voting system where staff can self-register, log in, cast their vote for colleagues, and administrators can securely audit participation and view who voted for whom.

🔗 **Live URL:** [https://employee-of-the-month-pink.vercel.app](https://employee-of-the-month-pink.vercel.app)

---

## ✨ Key Features

### 👤 1. Self-Registration & Employee Login
- **Self-Registration on Shared Link:** When employees open the link (e.g. from WhatsApp), they can register themselves directly with their full name, role/department, photo (camera/upload or URL), and create their own secret PIN.
- **Sign In for Returning Staff:** Select their registered name, enter their secret PIN, and sign in.
- **Vote Once Per Month:** Tracks voting status. Once an employee votes, their ballot is locked for that month.
- **Self-Vote Prevention:** Employees cannot vote for themselves.
- **Two-Tap Confirmation:** Confirms vote intent with an animated 3-second confirmation step.
- **Session Switcher:** One-tap "Log Out / Switch User" so multiple colleagues can vote from a shared phone or tablet.

### 🔒 2. Hidden & Secure Admin PIN
- **Zero Public Exposure:** The admin PIN is completely hidden from the public UI. No hints, defaults, or badges are shown anywhere to employees or visitors.
- **Admin PIN Management:** Inside the admin portal, the admin can change their PIN anytime (`Change Admin PIN`).
- **Reset Employee PIN:** Admin can inspect or reset any employee's PIN if an employee forgets it.

### 📊 3. Admin Audit: Who Voted For Whom
- **Live Participation Stats:** Real-time summary of Total Employees, Votes Cast, Pending Voters, and Turnout percentage.
- **Who Voted For Whom Table:** Admin can inspect the full voting audit showing exactly which employee voted for which candidate, complete with date and time.
- **Pending Voters List:** Displays names of all employees who haven't voted yet, with a **"Copy WhatsApp Reminder"** button to nudge pending staff with one tap.

### 🖼️ 4. Employee Management & Photo Upload/Editing
- **Upload / Replace Photos Anytime:** In the Admin panel, tap **"📷 Edit / Photo"** next to any employee to upload/replace photos or edit their name and role.
- **Automatic Storage Optimization:** Photos are compressed to 150x150 Retina thumbnails (~6KB), ensuring permanent saving without browser storage quota issues.

---

## 🚀 Quick Start Guide

1. Open [https://employee-of-the-month-pink.vercel.app](https://employee-of-the-month-pink.vercel.app).
2. **Employee Registration & Login:**
   - Tap **"✨ New Employee? Register Here"**, enter your name, role, optional photo, and create a PIN.
   - Or tap **"🔑 Existing Employee Sign In"** to log into an existing profile.
   - Vote for a colleague by tapping **Vote for [Name]** → confirm within 3 seconds.
3. **Admin Portal:**
   - Tap **⚙️ Admin Portal** at the very bottom.
   - Enter your secret Admin PIN (default: `1234`).
   - View the live audit of who voted for whom, pending voters, manage staff profiles, or reveal the winner!
