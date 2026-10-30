import { put } from '@vercel/blob';

const BLOB_NAME = 'eom-live-db.json';
const BLOB_URL = 'https://goqu5eu4jodzu0ws.public.blob.vercel-storage.com/eom-live-db.json';

const DEFAULT_DATA = {
  admin_pin: '1234',
  rev: false,
  employees: [
    {
      id: 'e1',
      name: 'Sarah Chen',
      role: 'Lead UI/UX Designer',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      pin: '1111',
      created_at: 1000
    },
    {
      id: 'e2',
      name: 'Marcus Johnson',
      role: 'Senior Backend Engineer',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      pin: '1111',
      created_at: 2000
    },
    {
      id: 'e3',
      name: 'Priya Sharma',
      role: 'Customer Success Lead',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
      pin: '1111',
      created_at: 3000
    },
    {
      id: 'e4',
      name: 'Alex Rivera',
      role: 'DevOps & Cloud Architect',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      pin: '1111',
      created_at: 4000
    }
  ],
  ballots: [],
  feedback: []
};

// Helper: fetch latest cloud database
async function getDb() {
  try {
    const url = `${BLOB_URL}?t=${Date.now()}&_r=${Math.random()}`;
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.employees)) return data;
    }
  } catch(e) {
    console.error('Error fetching blob db:', e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

// Helper: persist updated database to Vercel Blob
async function saveDb(data) {
  const blob = await put(BLOB_NAME, JSON.stringify(data, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    cacheControlMaxAge: 0
  });
  return blob;
}

function getMonthStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default async function handler(req, res) {
  // CORS & Zero-Cache headers so all devices stay in sync
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Return entire cloud database
  if (req.method === 'GET') {
    const db = await getDb();
    return res.status(200).json(db);
  }

  // POST: Server-side atomic operations
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { action } = body || {};
      const db = await getDb();
      const curMonth = getMonthStr();

      // 1. Employee Self-Registration
      if (action === 'register') {
        const { name, role, photo, pin } = body.data || {};
        const cleanName = String(name || '').trim();
        const cleanPin = String(pin || '').trim();
        if (!cleanName) return res.status(400).json({ error: 'Name is required' });
        if (!cleanPin) return res.status(400).json({ error: 'PIN is required' });

        const existing = db.employees.find(e => e.name.toLowerCase() === cleanName.toLowerCase());
        if (existing) {
          return res.status(400).json({ error: `"${cleanName}" is already registered. Please sign in with your PIN.` });
        }

        const newEmp = {
          id: 'e' + Date.now(),
          name: cleanName,
          role: String(role || '').trim() || 'Team Member',
          photo: String(photo || '').trim(),
          pin: cleanPin,
          created_at: Date.now()
        };

        db.employees.push(newEmp);
        const savedBlob = await saveDb(db);
        return res.status(200).json({ ok: true, emp: newEmp, db, blobUrl: savedBlob?.url });
      }

      // 2. Cast Vote
      if (action === 'vote') {
        const { voter_id, cid } = body.data || {};
        const voter = db.employees.find(e => e.id === voter_id);
        if (!voter) return res.status(400).json({ error: 'Please log in or register first' });
        if (voter_id === cid) return res.status(400).json({ error: 'You cannot vote for yourself!' });

        const existingVote = db.ballots.find(b => b.month === curMonth && b.voter_id === voter_id);
        if (existingVote) return res.status(400).json({ error: 'You have already voted this month' });

        const candidate = db.employees.find(e => e.id === cid);
        if (!candidate) return res.status(400).json({ error: 'Candidate not found' });

        const d = new Date();
        const timeStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
                        d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        db.ballots.push({
          month: curMonth,
          voter_id: voter.id,
          voter_name: voter.name,
          cid: candidate.id,
          cname: candidate.name,
          timestamp: timeStr
        });

        await saveDb(db);
        return res.status(200).json({
          ok: true,
          candidateId: candidate.id,
          candidateName: candidate.name,
          timeStr,
          db
        });
      }

      // 3. Submit Anonymous Feedback
      if (action === 'feedback') {
        const { voter_id, eid, kind, text } = body.data || {};
        const cleanText = String(text || '').trim();
        if (!cleanText) return res.status(400).json({ error: 'Please write something first' });

        const candidate = db.employees.find(e => e.id === eid);
        if (!candidate) return res.status(404).json({ error: 'Employee not found' });

        const voter = db.employees.find(e => e.id === voter_id);
        db.feedback.push({
          month: curMonth,
          eid,
          voter_name: voter ? voter.name : 'Staff Member',
          kind: kind === 'suggestion' ? 'suggestion' : 'compliment',
          text: cleanText.slice(0, 600),
          timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });

        await saveDb(db);
        return res.status(200).json({ ok: true, db });
      }

      // 4. Admin Add Employee
      if (action === 'add_emp') {
        const { pin: adminPin, name, role, photo } = body;
        if (String(adminPin || '').trim() !== String(db.admin_pin)) {
          return res.status(403).json({ error: 'Wrong admin PIN' });
        }
        const cleanName = String(name || '').trim();
        if (!cleanName) return res.status(400).json({ error: 'Name is required' });

        const existing = db.employees.find(e => e.name.toLowerCase() === cleanName.toLowerCase());
        if (existing) {
          return res.status(400).json({ error: `An employee named "${cleanName}" already exists.` });
        }

        const newEmp = {
          id: 'e' + Date.now(),
          name: cleanName,
          role: String(role || '').trim() || 'Team Member',
          photo: String(photo || '').trim(),
          pin: '1111',
          created_at: Date.now()
        };

        db.employees.push(newEmp);
        const savedBlob = await saveDb(db);
        return res.status(200).json({ ok: true, emp: newEmp, db, blobUrl: savedBlob?.url });
      }

      // 5. Admin Edit Employee
      if (action === 'edit_emp') {
        const { pin: adminPin, id, name, role, photo, emp_pin } = body;
        if (String(adminPin || '').trim() !== String(db.admin_pin)) {
          return res.status(403).json({ error: 'Wrong admin PIN' });
        }
        const emp = db.employees.find(e => e.id === id);
        if (!emp) return res.status(404).json({ error: 'Employee not found' });

        emp.name = String(name || '').trim();
        emp.role = String(role || '').trim();
        if (photo !== undefined) emp.photo = String(photo || '').trim();
        if (emp_pin) emp.pin = String(emp_pin).trim();

        // Update ballots with new name
        db.ballots.forEach(b => {
          if (b.voter_id === id) b.voter_name = emp.name;
          if (b.cid === id) b.cname = emp.name;
        });

        await saveDb(db);
        return res.status(200).json({ ok: true, emp, db });
      }

      // 6. Admin Delete Employee
      if (action === 'del_emp') {
        const { pin: adminPin, id } = body;
        if (String(adminPin || '').trim() !== String(db.admin_pin)) {
          return res.status(403).json({ error: 'Wrong admin PIN' });
        }
        db.employees = db.employees.filter(e => e.id !== id);
        db.ballots = db.ballots.filter(b => b.cid !== id && b.voter_id !== id);
        db.feedback = db.feedback.filter(f => f.eid !== id);

        await saveDb(db);
        return res.status(200).json({ ok: true, db });
      }

      // 7. Admin Toggle Winner Reveal
      if (action === 'set_rev') {
        const { pin: adminPin, rev } = body;
        if (String(adminPin || '').trim() !== String(db.admin_pin)) {
          return res.status(403).json({ error: 'Wrong admin PIN' });
        }
        db.rev = !!rev;
        await saveDb(db);
        return res.status(200).json({ ok: true, rev: db.rev, db });
      }

      // 8. Admin Change PIN
      if (action === 'change_pin') {
        const { pin: oldPin, new_pin } = body;
        if (String(oldPin || '').trim() !== String(db.admin_pin)) {
          return res.status(403).json({ error: 'Wrong current admin PIN' });
        }
        const cleanNewPin = String(new_pin || '').trim();
        if (!cleanNewPin || cleanNewPin.length < 4) {
          return res.status(400).json({ error: 'PIN must be at least 4 characters' });
        }
        db.admin_pin = cleanNewPin;
        await saveDb(db);
        return res.status(200).json({ ok: true, admin_pin: db.admin_pin, db });
      }

      // 9. Admin Reset to Default Demo Data
      if (action === 'reset') {
        const { pin: adminPin } = body;
        if (String(adminPin || '').trim() !== String(db.admin_pin)) {
          return res.status(403).json({ error: 'Wrong admin PIN' });
        }
        const resetData = JSON.parse(JSON.stringify(DEFAULT_DATA));
        await saveDb(resetData);
        return res.status(200).json({ ok: true, db: resetData });
      }

      return res.status(400).json({ error: 'Unknown action' });
    } catch(err) {
      console.error('API error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
