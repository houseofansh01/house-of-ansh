import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const cfg = {
  apiKey: "AIzaSyBwqpavjzi15Zt9qHoufjJFI05k7AAHLRs",
  authDomain: "house-of-ansh.firebaseapp.com",
  projectId: "house-of-ansh",
  storageBucket: "house-of-ansh.firebasestorage.app",
  messagingSenderId: "386185011014",
  appId: "1:386185011014:web:fef798d4e17c84170bcf47"
};
const app = getApps().length ? getApps()[0] : initializeApp(cfg);
const auth = getAuth(app);
const db   = getFirestore(app);

// ── inject CSS ──
const style = document.createElement('style');
style.textContent = `
#prof-menu{position:absolute;top:calc(100% + 10px);right:0;background:rgba(9,9,9,.98);backdrop-filter:blur(18px);border:1px solid #242424;min-width:230px;z-index:1200;box-shadow:0 12px 40px rgba(0,0,0,.7);}
.prof-head{padding:14px 18px 12px;border-bottom:1px solid #1a1a1a;}
.prof-name{font-family:'Cinzel',serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#f5f5f5;margin-bottom:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.prof-email{font-family:'Cormorant Garamond',serif;font-size:13px;color:#555;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.prof-div{height:1px;background:#1a1a1a;margin:3px 0;}
.prof-item{display:flex;align-items:center;gap:11px;width:100%;background:none;border:none;text-align:left;font-family:'Cinzel',serif;font-size:8.5px;letter-spacing:2px;text-transform:uppercase;color:#b8b8b8;text-decoration:none;padding:12px 18px;cursor:pointer;transition:color .2s,background .2s;-webkit-tap-highlight-color:transparent;}
.prof-item:hover{color:#f5f5f5;background:rgba(255,255,255,.04);}
.prof-item svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0;}
.prof-signout{color:#e05555!important;}
.prof-signout:hover{color:#ff7070!important;background:rgba(224,85,85,.07)!important;}
.nav-icon.prof-live{color:#d8d8d8;}
.nav-icon.prof-live::after{content:'';position:absolute;bottom:5px;right:5px;width:5px;height:5px;background:#4caf7d;border-radius:50%;border:1px solid #090909;}
.nav-icon.prof-live{position:relative;}
@media(max-width:480px){#prof-menu{min-width:200px;right:-8px;}}
`;
document.head.appendChild(style);

let _cust = null;

document.addEventListener('DOMContentLoaded', () => {
  // close on outside click or Escape
  document.addEventListener('click', () => { const m=document.getElementById('prof-menu'); if(m) m.remove(); });
  document.addEventListener('keydown', e => { if(e.key==='Escape'){ const m=document.getElementById('prof-menu'); if(m) m.remove(); } });

  onAuthStateChanged(auth, async user => {
    const btn = document.querySelector('.nav-icon[title="Account"]');
    if (!btn) return;

    if (user) {
      try {
        const snap = await getDoc(doc(db,'customers',user.uid));
        _cust = snap.exists() ? snap.data() : {};
      } catch(_) { _cust = {}; }

      btn.removeAttribute('onclick');
      btn.classList.add('prof-live');
      btn.addEventListener('click', e => { e.stopPropagation(); _toggle(btn); });
    } else {
      _cust = null;
      btn.removeAttribute('onclick');
      btn.classList.remove('prof-live');
      btn.onclick = () => { window.location.href = 'login.html'; };
    }
  });
});

function _toggle(btn) {
  const existing = document.getElementById('prof-menu');
  if (existing) { existing.remove(); return; }

  const name  = (_cust && _cust.name)  ? _cust.name  : 'My Account';
  const email = (_cust && _cust.email) ? _cust.email : '';

  const menu = document.createElement('div');
  menu.id = 'prof-menu';
  menu.innerHTML = `
    <div class="prof-head">
      <div class="prof-name">${name}</div>
      ${email ? `<div class="prof-email">${email}</div>` : ''}
    </div>
    <a href="my-account.html" class="prof-item">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.582-7 8-7s8 3 8 7"/></svg>My Profile
    </a>
    <a href="my-orders.html" class="prof-item">
      <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>My Orders
    </a>
    <a href="my-account.html#returns" class="prof-item">
      <svg viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.83"/></svg>Returns &amp; Exchanges
    </a>
    <a href="my-account.html#queries" class="prof-item">
      <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>My Queries
    </a>
    <div class="prof-div"></div>
    <button class="prof-item" id="_prof-pin">
      <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>Change PIN
    </button>
    <button class="prof-item" id="_prof-pw">
      <svg viewBox="0 0 24 24"><path d="M15 7h3a5 5 0 010 10h-3m-6 0H6A5 5 0 016 7h3"/><line x1="8" y1="12" x2="16" y2="12"/></svg>Change Password
    </button>
    <div class="prof-div"></div>
    <button class="prof-item prof-signout" id="_prof-out">
      <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>Sign Out
    </button>`;

  const parent = btn.closest('.nav-icons') || btn.parentElement;
  parent.style.position = 'relative';
  parent.appendChild(menu);
  menu.addEventListener('click', e => e.stopPropagation());

  document.getElementById('_prof-pin').onclick = () => { menu.remove(); window.location.href='my-account.html#change-pin'; };
  document.getElementById('_prof-pw').onclick  = () => { menu.remove(); window.location.href='my-account.html#change-password'; };
  document.getElementById('_prof-out').onclick  = _doSignOut;
}

async function _doSignOut() {
  try { await signOut(auth); } catch(_) {}
  window.location.href = 'home.html';
}
