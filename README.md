# 🏆 Employee of the Month — Voting, Recognition & Winner Showcase

A mobile-first, interactive, and verified employee voting system where staff can self-register or sign in, view colleague cards with their photos, cast their vote using a clear **Vote** button, submit compliments/suggestions via the **Feedback** button, and view the winner and results leaderboard!

🔗 **Live URL:** [https://employee-of-the-month-pink.vercel.app](https://employee-of-the-month-pink.vercel.app)

---

## 🎯 The Complete User Flow

1. **Step 1: Open Link & Sign In / Register:**
   - When an employee opens the link (shared on WhatsApp or web), they arrive at the **Employee Access** gateway:
     - **🔑 Sign In (Existing Staff):** Select your name from the dropdown roster, enter your secret 4-digit PIN, and tap **"Sign In & Cast Vote"**.
     - **✨ Register (New Employee):** Enter full name, role/department, photo (from camera/gallery or URL), choose a 4-digit PIN, and tap **"Register & Start Voting"**.
   - If someone just wants to check the results or who won, they can tap **"🏆 Winner & Results"** right from the top navigation bar!

2. **Step 2: Employee List & Two Clear Action Buttons:**
   - Once logged in, the user sees their active profile badge (`Logged in as: [Name]`) and the list of nominated candidates with their photos and roles.
   - Each employee card has **two distinct buttons**:
     1. **`🗳️ Vote for [Name]`**:
        - Bright orange, prominent button.
        - Has a two-tap confirmation (`⚠️ Tap again to confirm!`) with an animated 3.5s safety timer to prevent misclicks.
        - Employees cannot vote for themselves (`✕ Cannot vote for yourself`).
        - Once a vote is cast, their choice is marked with `✓ Your Vote`, and voting locks for the current month.
     2. **`💬 Feedback`**:
        - Allows any staff member to submit an anonymous **👏 Compliment** or **💡 Suggestion** for that colleague.

3. **Step 3: Winner & Results Showcase:**
   - Tap **"🏆 Winner & Results"** in the top navigation bar at any time:
     - **While voting is active:** Shows participation turnout (*"X of Y staff have voted so far"*) and lets users know the winner will be declared soon.
     - **Once voting concludes / Admin reveals results:** Displays a festive winner podium with crown, winner's photo, name, role, vote count, and a full ranked leaderboard of all candidates!

4. **Step 4: Admin Portal (`⚙️ Admin Portal` at footer):**
   - Secured with a secret Admin PIN (completely hidden from public UI).
   - Admin features:
     - **"🎉 Reveal Winner to Everyone" / "🔒 Hide Winner & Results"** toggle button.
     - Live audit table: Voter Name → Candidate Voted For → Date & Time.
     - List of pending voters with a 1-tap **"Copy WhatsApp Reminder"** button.
     - Add employees, edit employee names/roles, upload/replace photos, or reset employee PINs.
     - Change the secret Admin PIN anytime.
