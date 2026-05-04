/* ============================================================
<<<<<<< HEAD
   Life Link – Red Cross Dashboard  |  redcross.js
=======
   Life Link – Red Cross Dashboard  |  script.js
>>>>>>> e35ae448d79a9f7d5ee857b99933db6359243a6d
   ============================================================ */

function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  el.classList.add('active');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); });
  });
});

<<<<<<< HEAD
/* ── Disease Panel (main drawer) ── */
=======
/* ── Disease Panel ── */
>>>>>>> e35ae448d79a9f7d5ee857b99933db6359243a6d
function toggleDisease(rowId) {
  const d = document.getElementById('drawer-' + rowId);
  const open = d.classList.contains('open');
  document.querySelectorAll('.disease-drawer').forEach(x => x.classList.remove('open'));
  if (!open) d.classList.add('open');
}

<<<<<<< HEAD
/* ── Infectious Disease Sub-sections (Blood Infection / Other) ── */
function toggleSubsection(sectionId, toggleEl) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  const isOpen = section.classList.contains('open');
  section.classList.toggle('open', !isOpen);
  toggleEl.classList.toggle('open', !isOpen);
}

/* ── Add Custom Disease Row ── */
function addCustomDisease(sectionId) {
  const input = document.getElementById('input-' + sectionId);
  const name  = input ? input.value.trim() : '';
  if (!name) { showToast('Please enter a disease / infection name.'); return; }

  const container = document.getElementById('extra-' + sectionId);
  if (!container) return;

  const uid = 'ddr-' + sectionId + '-' + Date.now();
  const row = document.createElement('div');
  row.className = 'dynamic-disease-row';
  row.id = uid;
  row.innerHTML = `
    <div class="ddr-label">${escapeHtml(name)}</div>
    <div class="ddr-controls">
      <select class="disease-val" style="background:#d1fae5;color:#065f46;border:none;font-size:12px;padding:3px 8px;border-radius:99px;font-weight:600" onchange="updateSelectColor(this)">
        <option value="neg">Negative</option>
        <option value="pos">Positive</option>
      </select>
      <button class="ddr-remove" onclick="removeCustomDisease('${uid}')" title="Remove">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  `;
  container.appendChild(row);
  input.value = '';
  showToast('"' + name + '" added to panel.');
}

function removeCustomDisease(uid) {
  const el = document.getElementById(uid);
  if (el) { el.remove(); showToast('Entry removed.'); }
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── Select color update ── */
=======
>>>>>>> e35ae448d79a9f7d5ee857b99933db6359243a6d
function updateSelectColor(sel) {
  if (sel.value === 'pos') {
    sel.style.background = '#fee2e2';
    sel.style.color = '#991b1b';
  } else {
    sel.style.background = '#d1fae5';
    sel.style.color = '#065f46';
  }
}

<<<<<<< HEAD
/* ── Hemoglobin badge ── */
=======
>>>>>>> e35ae448d79a9f7d5ee857b99933db6359243a6d
function updateHbBadge(rowId) {
  const v = parseFloat(document.getElementById('hb-' + rowId).value);
  const b = document.getElementById('hb-badge-' + rowId);
  if (isNaN(v)) { b.textContent = '—'; b.className = 'disease-val'; return; }
  if (v < 12)        { b.textContent = 'Low';    b.className = 'disease-val dv-pos'; }
  else if (v > 17.5) { b.textContent = 'High';   b.className = 'disease-val dv-warn'; }
  else               { b.textContent = 'Normal'; b.className = 'disease-val dv-normal'; }
}

/* ── Edit Modal ── */
const editConfig = {
  appointments: [
    { label: 'Donor Name',     col: 0, type: 'text' },
    { label: 'Blood Group',    col: 1, type: 'text' },
    { label: 'Requested Date', col: 2, type: 'date' },
    { label: 'Last Donation',  col: 3, type: 'date' },
    { label: 'Status', col: 4, type: 'select', options: ['Scheduled','Pending','Cancelled'], isBadge: true }
  ],
  inventory: [
    { label: 'Blood Group',     col: 0, type: 'text' },
    { label: 'Units Available', col: 1, type: 'number' },
    { label: 'Storage Date',    col: 2, type: 'date' },
    { label: 'Expire Date',     col: 3, type: 'date' }
  ]
};

const badgeClass = {
  Scheduled: 'badge-green', Pending: 'badge-red', Cancelled: 'badge-red',
  Approved: 'badge-green', Rejected: 'badge-red'
};

let _editCtx = null;

function openEdit(type, rowId, btn) {
  const row = btn.closest('tr');
  const cells = row.querySelectorAll('td');
  const fields = editConfig[type];
  if (!fields) return;
  document.getElementById('edit-modal-title').textContent = 'Edit Record';
  const c = document.getElementById('edit-modal-fields');
  c.innerHTML = '';
  fields.forEach(f => {
    const cell = cells[f.col];
    const val  = f.isBadge ? cell.querySelector('.badge').textContent.trim() : cell.textContent.trim();
    const div  = document.createElement('div');
    div.className = 'form-group';
    div.innerHTML = `<label class="form-label">${f.label}</label>`;
    if (f.type === 'select') {
      const sel = document.createElement('select');
      sel.className = 'form-select';
      sel.dataset.col = f.col;
      sel.dataset.isBadge = f.isBadge || false;
      f.options.forEach(o => {
        const op = document.createElement('option');
        op.value = o; op.textContent = o;
        if (o === val) op.selected = true;
        sel.appendChild(op);
      });
      div.appendChild(sel);
    } else {
      div.innerHTML += `<input class="form-input" type="${f.type}" data-col="${f.col}" value="${val}"/>`;
    }
    c.appendChild(div);
  });
  _editCtx = { row };
  document.getElementById('edit-modal').classList.add('open');
}

function saveEdit() {
  if (!_editCtx) return;
  const { row } = _editCtx;
  const cells = row.querySelectorAll('td');
  document.querySelectorAll('#edit-modal-fields input, #edit-modal-fields select').forEach(i => {
    const col     = parseInt(i.dataset.col);
    const isBadge = i.dataset.isBadge === 'true';
    const val     = i.value.trim();
    if (isBadge) {
      const b = cells[col].querySelector('.badge');
      b.textContent = val;
      b.className = 'badge ' + (badgeClass[val] || 'badge-yellow');
    } else {
      cells[col].textContent = val;
    }
  });
  closeModal('edit-modal');
  showToast('Record updated successfully.');
}

/* ── Delete Modal ── */
let _deleteCtx = null;

function openDelete(rowId, tableId) {
  _deleteCtx = { rowId, tableId };
  document.getElementById('delete-modal').classList.add('open');
}

function confirmDelete() {
  if (!_deleteCtx) return;
  const tbl = document.getElementById(_deleteCtx.tableId);
  const row = tbl.querySelector(`tr[data-id="${_deleteCtx.rowId}"]`);
  if (row) row.remove();
  closeModal('delete-modal');
  showToast('Record deleted.');
  _deleteCtx = null;
}

/* ── Blood Testing ── */
function testingAction(rowId, action) {
  const row = document.querySelector(`#tbl-bloodtesting tr[data-id="${rowId}"]`);
  if (!row) return;
  const td = row.querySelector('td:last-child');
  const b  = document.createElement('span');
  b.className  = 'badge ' + (action === 'Accepted' ? 'badge-green' : 'badge-red');
  b.textContent = action;
  td.innerHTML  = '';
  td.appendChild(b);
  showToast('Sample ' + action.toLowerCase() + '.');
}

/* ── Blood Request ── */
function requestAction(rowId, status) {
  const row = document.querySelector(`#tbl-bloodrequest tr[data-id="${rowId}"]`);
  if (!row) return;
  const b = row.querySelector('.badge');
  b.textContent = status;
  b.className   = 'badge ' + (status === 'Approved' ? 'badge-green' : 'badge-red');
  showToast('Request ' + status.toLowerCase() + '.');
}

/* ── Assign Modal ── */
let _assignRowId = null;

function openAssign(rowId) {
  _assignRowId = rowId;
  document.getElementById('assign-donor-input').value = '';
  document.getElementById('assign-notes-input').value  = '';
  document.getElementById('assign-modal').classList.add('open');
}

function confirmAssign() {
  const d = document.getElementById('assign-donor-input').value.trim();
  if (!d) { showToast('Please enter a donor name.'); return; }
  closeModal('assign-modal');
  showToast('Assigned to ' + d + '.');
  _assignRowId = null;
}

/* ── Add Units Modal ── */
let _addRowId = null;

function openAdd(rowId) {
  _addRowId = rowId;
  document.getElementById('add-units-input').value = 1;
  document.getElementById('add-modal').classList.add('open');
}

function adjUnits(d) {
  const i = document.getElementById('add-units-input');
  i.value = Math.max(1, (parseInt(i.value) || 1) + d);
}

function confirmAdd() {
  const n = parseInt(document.getElementById('add-units-input').value);
  if (!n || n < 1) { showToast('Enter a valid number.'); return; }
  const row = document.querySelector(`#tbl-inventory tr[data-id="${_addRowId}"]`);
  if (row) {
    const c = row.querySelectorAll('td')[1];
    c.textContent = parseInt(c.textContent) + n;
  }
  closeModal('add-modal');
  showToast(n + ' unit(s) added.');
  _addRowId = null;
}

/* ── Expire Monitoring ── */
function removeExpiry(rowId, tableId) {
  const tbl = document.getElementById(tableId);
  const row = tbl.querySelector(`tr[data-id="${rowId}"]`);
  if (row) row.remove();
  showToast('Expiry record removed.');
}

/* ── Donor History Modal ── */
const donorHistory = {
  dn1: [
    { date: 'Apr 08, 2026', units: 1, type: 'A-' },
    { date: 'Oct 12, 2025', units: 1, type: 'A-' },
    { date: 'Apr 20, 2025', units: 1, type: 'A-' }
  ],
  dn2: [
    { date: 'Apr 08, 2026', units: 1, type: 'A-' },
    { date: 'Aug 05, 2025', units: 1, type: 'A-' },
    { date: 'Dec 01, 2024', units: 1, type: 'A-' }
  ]
};

const hColors = [
  'linear-gradient(180deg,#9B1B0F,#C0392B)',
  'linear-gradient(180deg,#C0392B,#e06050)',
  'linear-gradient(180deg,#e06050,#fdecea)'
];

function viewHistory(donorId) {
  const row  = document.querySelector(`#tbl-donors tr[data-id="${donorId}"]`);
  const name = row ? row.querySelectorAll('td')[0].textContent : 'Donor';
  document.getElementById('history-modal-title').textContent = name + ' — Donation History';
  const list    = document.getElementById('history-list');
  list.innerHTML = '';
  const records = donorHistory[donorId] || [];
  if (!records.length) {
    list.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:18px 0">No history found.</p>';
  } else {
    records.forEach((r, i) => {
      const d = document.createElement('div');
      d.className = 'history-item';
      d.innerHTML = `
        <div class="h-line" style="background:${hColors[i] || hColors[2]}"></div>
        <div class="h-date">${r.date}</div>
        <div class="h-type">${r.type} Blood</div>
        <span class="h-badge">${r.units} unit</span>
      `;
      list.appendChild(d);
    });
  }
  document.getElementById('history-modal').classList.add('open');
<<<<<<< HEAD
}
const rcNotifications = [
  { id:'rc1', type:'urgent',      read:false, time:'5 min ago',   msg:'<strong>CRITICAL:</strong> Rh-null blood request from <strong>Jane Smith</strong> — immediate attention required at Bhaktapur Hospital.' },
  { id:'rc2', type:'request',     read:false, time:'20 min ago',  msg:'New blood request: <strong>John Doe</strong> needs <strong>B+ (2 units)</strong>. Please review and assign donor.' },
  { id:'rc3', type:'expiry',      read:false, time:'1 hr ago',    msg:'<strong>A+ (3 units)</strong> will expire in <strong>6 days</strong>. Consider redistribution or urgent use.' },
  { id:'rc4', type:'appointment', read:false, time:'2 hrs ago',   msg:'New appointment scheduled: <strong>Jane Smith (O+)</strong> — donation on 2026-04-05. Awaiting confirmation.' },
  { id:'rc5', type:'request',     read:true,  time:'3 hrs ago',   msg:'Blood request from <strong>Raj Kumar</strong> for O- (3 units) updated to <strong>Approved</strong> status.' },
  { id:'rc6', type:'expiry',      read:true,  time:'4 hrs ago',   msg:'<strong>O- (5 units)</strong> expiring in 13 days. Flag for priority use in upcoming requests.' },
  { id:'rc7', type:'approved',    read:true,  time:'Yesterday',   msg:'Donation from <strong>John Doe (B+)</strong> passed all tests — blood added to inventory successfully.' },
  { id:'rc8', type:'system',      read:true,  time:'Yesterday',   msg:'Monthly inventory report generated. Total units: <strong>220</strong>. Download available in reports.' },
];

const rcIconMap = {
  urgent:      { cls:'ni-urgent',      svg:'<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },
  request:     { cls:'ni-request',     svg:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>' },
  expiry:      { cls:'ni-expiry',      svg:'<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/>' },
  appointment: { cls:'ni-appointment', svg:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>' },
  approved:    { cls:'ni-approved',    svg:'<circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/>' },
  system:      { cls:'ni-system',      svg:'<circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>' },
};

function rcGetUnread(){ return rcNotifications.filter(n=>!n.read).length; }

function rcUpdateBadges(){
  const c = rcGetUnread();
  const bell = document.getElementById('rc-bell-badge');
  const dot  = document.getElementById('rc-nav-dot');
  if(bell){bell.textContent=c;bell.style.display=c?'flex':'none';}
  if(dot){dot.textContent=c;dot.style.display=c?'inline-flex':'none';}
}

function rcRenderDd(filter='all'){
  const list = document.getElementById('rc-dropdown-list');
  if(!list)return;
  const items = rcNotifications.filter(n=>filter==='all'||n.type===filter).slice(0,6);
  if(!items.length){list.innerHTML='<div class="notif-empty"><svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>No notifications</div>';return;}
  list.innerHTML=items.map(n=>{
    const ic=rcIconMap[n.type]||rcIconMap.system;
    return `<div class="notif-item${n.read?'':' unread'}" onclick="rcMarkRead('${n.id}')">
      <div class="notif-icon ${ic.cls}"><svg viewBox="0 0 24 24">${ic.svg}</svg></div>
      <div class="notif-content"><div class="notif-msg">${n.msg}</div><div class="notif-time">${n.time}</div></div>
    </div>`;
  }).join('');
}

function rcRenderPage(filter='all'){
  const list=document.getElementById('rc-page-list');
  if(!list)return;
  const items=rcNotifications.filter(n=>filter==='all'||n.type===filter);
  if(!items.length){list.innerHTML='<div class="notif-empty" style="padding:48px"><svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>No notifications here.</div>';return;}
  list.innerHTML=items.map(n=>{
    const ic=rcIconMap[n.type]||rcIconMap.system;
    return `<div class="notif-full-item${n.read?'':' unread'}">
      <div class="notif-full-icon ${ic.cls}"><svg viewBox="0 0 24 24">${ic.svg}</svg></div>
      <div class="notif-full-content">
        <div class="notif-full-msg">${n.msg}</div>
        <div class="notif-full-meta">
          <span class="notif-full-time">${n.time}</span>
          <span class="notif-type-tag tag-${n.type}">${n.type.charAt(0).toUpperCase()+n.type.slice(1)}</span>
          ${!n.read?'<span style="font-size:11px;color:var(--crimson);font-weight:600">● New</span>':''}
        </div>
      </div>
      <button class="notif-dismiss-btn" onclick="rcDismiss('${n.id}')">✕</button>
    </div>`;
  }).join('');
}

function rcMarkRead(id){const n=rcNotifications.find(x=>x.id===id);if(n)n.read=true;rcUpdateBadges();rcRenderDd(_rcDdF);rcRenderPage(_rcPageF);}
function rcMarkAll(){rcNotifications.forEach(n=>n.read=true);rcUpdateBadges();rcRenderDd(_rcDdF);rcRenderPage(_rcPageF);showToast('All notifications marked as read.');}
function rcDismiss(id){const i=rcNotifications.findIndex(x=>x.id===id);if(i>-1)rcNotifications.splice(i,1);rcUpdateBadges();rcRenderDd(_rcDdF);rcRenderPage(_rcPageF);}

let _rcDdF='all',_rcPageF='all';
function rcFilterDd(f,btn){_rcDdF=f;document.querySelectorAll('#rc-notif-dropdown .notif-tab').forEach(t=>t.classList.remove('active'));btn.classList.add('active');rcRenderDd(f);}
function rcFilterPage(f,btn){_rcPageF=f;document.querySelectorAll('.nf-pill').forEach(p=>p.classList.remove('active'));btn.classList.add('active');rcRenderPage(f);}

function toggleRcDropdown(){const dd=document.getElementById('rc-notif-dropdown');dd.classList.toggle('open');if(dd.classList.contains('open'))rcRenderDd(_rcDdF);}
function closeRcDropdown(){document.getElementById('rc-notif-dropdown').classList.remove('open');}

document.addEventListener('click',e=>{const w=document.querySelector('.notif-bell-wrap');if(w&&!w.contains(e.target))closeRcDropdown();});
document.addEventListener('DOMContentLoaded',()=>{rcUpdateBadges();});

const _origRcShow=window.showPage;
window.showPage=function(id,btn){_origRcShow(id,btn);if(id==='rc-notifications')rcRenderPage(_rcPageF);};
=======
}
>>>>>>> e35ae448d79a9f7d5ee857b99933db6359243a6d
