# 🏆 Employee of the Month — Anonymous Voting Dashboard

A mobile-first, interactive, and completely anonymous voting web app that works right out of the box with **zero database configuration required**. 

🔗 **Live URL:** [https://employee-of-the-month-pink.vercel.app](https://employee-of-the-month-pink.vercel.app)

---

## ✨ Features

- **📱 Mobile-First & WhatsApp-Ready:** Direct "Share on WhatsApp" button with pre-filled message and link preview.
- **🗳️ Anonymous Voting:** Staff enter a one-time voting code (e.g. `VOTE01`, `VOTE02`, etc.) and confirm their vote with a two-tap confirmation. Ballots store only the employee ID and month—never the voter or code.
- **💬 Anonymous Feedback:** Submit compliments or constructive suggestions for each employee, viewable exclusively by the admin.
- **🔍 Pinch & Touch Photo Zoom:** Smooth modal zoom supporting touch pinch, double-tap, mouse wheel, panning, and zoom controls.
- **⚙️ Admin Dashboard (PIN: `1234`):**
  - Add new staff candidates with photo upload (auto-compressed on device).
  - Remove employees with two-tap confirm.
  - Generate and view batches of single-use voting codes.
  - Read all anonymous compliments and suggestions.
  - Toggle **Reveal Winner** to announce the winner with crown badges and vote counts.
  - Reset to default demo data anytime with 1 tap.
- **⚡ Zero Configuration:** Everything persists cleanly in the client browser (`localStorage`), eliminating the need for external database setup, API keys, or SQL migrations.

---

## 🚀 Instant Quick Start

1. Open [https://employee-of-the-month-pink.vercel.app](https://employee-of-the-month-pink.vercel.app).
2. Tap one of the **Quick test codes** (e.g. `VOTE01`) and tap **Submit Code**.
3. Tap **Vote for [Employee]** and tap again within 3 seconds to confirm.
4. Tap **Admin Login** at the bottom, enter PIN `1234`, and explore the admin controls!
5. Tap **Share on WhatsApp** in the top bar to share the link with colleagues.
