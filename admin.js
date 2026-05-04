/* ============================================================
   Life Link – Admin Dashboard  |  script.js
   ============================================================ */

function showPage(id, btn) {
  document.querySelectorAll('.page').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  btn.classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); });
  });
});

/* ── Edit Modal ── */
const editFields = {
  users: [
    { label: 'Name',   key: 0, type: 'text' },
    { label: 'Email',  key: 1, type: 'email' },
    { label: 'Role',   key: 2, type: 'text' },
    { label: 'Status', key: 3, type: 'select', options: ['Active','Inactive'] },
  ],
  redcross: [
    { label: 'Center Name', key: 0, type: 'text' },
    { label: 'Location',    key: 1, type: 'text' },
    { label: 'Contact',     key: 2, type: 'text' },
    { label: 'Status',      key: 3, type: 'select', options: ['Active','Inactive'] },
  ],
  request: [
    { label: 'Patient',     key: 0, type: 'text' },
    { label: 'Blood Group', key: 1, type: 'text' },
    { label: 'Units',       key: 2, type: 'number' },
    { label: 'Status',      key: 3, type: 'select', options: ['Approved','Pending','Rejected'] },
  ],
  donors: [
    { label: 'Name',           key: 0, type: 'text' },
    { label: 'Blood Group',    key: 1, type: 'text' },
    { label: 'Total Donation', key: 2, type: 'number' },
    { label: 'Status',         key: 3, type: 'select', options: ['Active','Inactive'] },
  ],
};

let _editContext = null;

function openEdit(type, rowId, btn) {
  const row    = btn.closest('tr');
  const cells  = row.querySelectorAll('td');
  const fields = editFields[type];
  const container = document.getElementById('modal-fields');
  container.innerHTML = '';

  fields.forEach(f => {
    const val = f.key === 3
      ? cells[f.key].querySelector('.badge').textContent.trim()
      : cells[f.key].textContent.trim();

    const div = document.createElement('div');
    div.className = 'form-group';
    div.innerHTML = `<label class="form-label">${f.label}</label>`;

    if (f.type === 'select') {
      const sel = document.createElement('select');
      sel.className = 'form-select';
      sel.dataset.key = f.key;
      f.options.forEach(o => {
        const opt = document.createElement('option');
        opt.value = o; opt.textContent = o;
        if (o === val) opt.selected = true;
        sel.appendChild(opt);
      });
      div.appendChild(sel);
    } else {
      div.innerHTML += `<input class="form-input" type="${f.type}" data-key="${f.key}" value="${val}"/>`;
    }
    container.appendChild(div);
  });

  _editContext = { type, row, fields };
  document.getElementById('edit-modal').classList.add('open');
}

function saveEdit() {
  if (!_editContext) return;
  const { row } = _editContext;
  const cells = row.querySelectorAll('td');

  document.querySelectorAll('#modal-fields input, #modal-fields select').forEach(inp => {
    const key = parseInt(inp.dataset.key);
    const val = inp.value.trim();

    if (key === 3) {
      const badge = cells[key].querySelector('.badge');
      badge.textContent = val;
      badge.className = 'badge';
      if (val === 'Active' || val === 'Approved')   badge.classList.add('badge-active');
      else if (val === 'Inactive' || val === 'Rejected') badge.classList.add('badge-inactive');
      else badge.classList.add('badge-pending');
    } else {
      cells[key].textContent = val;
    }
  });

  closeModal('edit-modal');
  showToast('Record updated successfully.');
}

/* ── Delete Modal ── */
let _deleteContext = null;

function openDelete(rowId, tableId) {
  _deleteContext = { rowId, tableId };
  document.getElementById('delete-modal').classList.add('open');
}

function confirmDelete() {
  if (!_deleteContext) return;
  const table = document.getElementById(_deleteContext.tableId);
  const row   = table.querySelector(`tr[data-id="${_deleteContext.rowId}"]`);
  if (row) row.remove();
  closeModal('delete-modal');
  showToast('Record deleted.');
  _deleteContext = null;
}

/* ── Verification ── */
function verifyAction(rowId, newStatus) {
  const row = document.querySelector(`#verification-table tr[data-id="${rowId}"]`);
  if (!row) return;
  const badge = row.querySelector('.badge');
  badge.textContent = newStatus;
  badge.className = 'badge';
  badge.classList.add(newStatus === 'Approved' ? 'badge-active' : 'badge-inactive');
  showToast('Verification ' + newStatus.toLowerCase() + '.');
<<<<<<< HEAD
}

const adminNotifications = [
  { id:'n1', type:'urgent',   read:false, time:'2 min ago',   msg:'<strong>URGENT:</strong> Rh-null blood request submitted by <strong>Jane Smith</strong> — critical case at Bhaktapur Hospital.' },
  { id:'n2', type:'request',  read:false, time:'15 min ago',  msg:'New blood request from <strong>Emma Davis</strong> — needs <strong>A+ (2 units)</strong> by tomorrow.' },
  { id:'n3', type:'user',     read:false, time:'30 min ago',  msg:'<strong>23 new users</strong> registered today. 3 are awaiting email verification.' },
  { id:'n4', type:'verify',   read:false, time:'1 hr ago',    msg:'<strong>John Doe</strong> submitted ID verification — pending your review.' },
  { id:'n5', type:'request',  read:false, time:'2 hrs ago',   msg:'Blood request from <strong>Raj Kumar</strong> — O- blood, 3 units needed urgently.' },
  { id:'n6', type:'approved', read:true,  time:'3 hrs ago',   msg:'Request for <strong>Emma Davis (A+)</strong> has been approved and fulfilled.' },
  { id:'n7', type:'system',   read:true,  time:'5 hrs ago',   msg:'New Red Cross Center <strong>North District</strong> has been added to the system.' },
  { id:'n8', type:'rejected', read:true,  time:'6 hrs ago',   msg:'Donor registration for <strong>Mike Chen</strong> was rejected — failed hemoglobin test.' },
  { id:'n9', type:'verify',   read:true,  time:'Yesterday',   msg:'<strong>Jane Smith</strong> donor certificate approved and verified.' },
  { id:'n10',type:'system',   read:true,  time:'Yesterday',   msg:'System backup completed successfully. All data secured.' },
];

const iconMap = {
  urgent:   { cls:'ni-urgent',   svg:'<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },
  request:  { cls:'ni-request',  svg:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>' },
  approved: { cls:'ni-approved', svg:'<circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/>' },
  rejected: { cls:'ni-rejected', svg:'<circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/>' },
  user:     { cls:'ni-user',     svg:'<circle cx="9" cy="7" r="4"/><path d="M2 21v-1a7 7 0 0 1 14 0v1"/>' },
  verify:   { cls:'ni-verify',   svg:'<circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/>' },
  system:   { cls:'ni-system',   svg:'<circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>' },
};

function getUnreadCount() { return adminNotifications.filter(n=>!n.read).length; }

function updateBadges() {
  const c = getUnreadCount();
  const bell = document.getElementById('bell-badge');
  const navDot = document.getElementById('nav-notif-dot');
  if(bell) { bell.textContent=c; bell.style.display=c?'flex':'none'; }
  if(navDot){ navDot.textContent=c; navDot.style.display=c?'inline-flex':'none'; }
}

function renderDropdownList(filter='all') {
  const list = document.getElementById('dropdown-list');
  if(!list) return;
  const items = adminNotifications.filter(n=> filter==='all' || n.type===filter).slice(0,6);
  if(!items.length){ list.innerHTML='<div class="notif-empty"><svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>No notifications</div>'; return; }
  list.innerHTML = items.map(n=>{
    const ic = iconMap[n.type]||iconMap.system;
    return `<div class="notif-item${n.read?'':' unread'}" onclick="markRead('${n.id}')">
      <div class="notif-icon ${ic.cls}"><svg viewBox="0 0 24 24">${ic.svg}</svg></div>
      <div class="notif-content">
        <div class="notif-msg">${n.msg}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>`;
  }).join('');
}

function renderPageList(filter='all') {
  const list = document.getElementById('page-notif-list');
  if(!list) return;
  const items = adminNotifications.filter(n=> filter==='all' || n.type===filter);
  if(!items.length){ list.innerHTML='<div class="notif-empty" style="padding:48px"><svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>No notifications here.</div>'; return; }
  list.innerHTML = items.map(n=>{
    const ic = iconMap[n.type]||iconMap.system;
    return `<div class="notif-full-item${n.read?'':' unread'}" id="fi-${n.id}">
      <div class="notif-full-icon ${ic.cls}"><svg viewBox="0 0 24 24">${ic.svg}</svg></div>
      <div class="notif-full-content">
        <div class="notif-full-msg">${n.msg}</div>
        <div class="notif-full-meta">
          <span class="notif-full-time">${n.time}</span>
          <span class="notif-type-tag tag-${n.type}">${n.type.charAt(0).toUpperCase()+n.type.slice(1)}</span>
          ${!n.read?'<span style="font-size:11px;color:var(--crimson);font-weight:600">● New</span>':''}
        </div>
      </div>
      <button class="notif-dismiss-btn" onclick="dismissNotif('${n.id}')" title="Dismiss">✕</button>
    </div>`;
  }).join('');
}

function markRead(id) {
  const n = adminNotifications.find(x=>x.id===id);
  if(n) n.read=true;
  updateBadges(); renderDropdownList(_ddFilter); renderPageList(_pageFilter);
}

function markAllRead() {
  adminNotifications.forEach(n=>n.read=true);
  updateBadges(); renderDropdownList(_ddFilter); renderPageList(_pageFilter);
  showToast('All notifications marked as read.');
}

function dismissNotif(id) {
  const idx = adminNotifications.findIndex(x=>x.id===id);
  if(idx>-1){ adminNotifications.splice(idx,1); }
  updateBadges(); renderDropdownList(_ddFilter); renderPageList(_pageFilter);
}

let _ddFilter='all', _pageFilter='all';

function filterDropdown(f,btn) {
  _ddFilter=f;
  document.querySelectorAll('.notif-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  renderDropdownList(f);
}

function filterPage(f,btn) {
  _pageFilter=f;
  document.querySelectorAll('.nf-pill').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  renderPageList(f);
}

function toggleNotifDropdown() {
  const dd = document.getElementById('notif-dropdown');
  dd.classList.toggle('open');
  if(dd.classList.contains('open')) renderDropdownList(_ddFilter);
}

function closeNotifDropdown() {
  document.getElementById('notif-dropdown').classList.remove('open');
}

document.addEventListener('click', e=>{
  const wrap = document.querySelector('.notif-bell-wrap');
  if(wrap && !wrap.contains(e.target)) closeNotifDropdown();
});

// Init
document.addEventListener('DOMContentLoaded', ()=>{ updateBadges(); });

// Override showPage to re-render notification page
const _origShowPage = window.showPage;
window.showPage = function(id, btn) {
  _origShowPage(id, btn);
  if(id==='notifications') renderPageList(_pageFilter);
=======
>>>>>>> e35ae448d79a9f7d5ee857b99933db6359243a6d
}