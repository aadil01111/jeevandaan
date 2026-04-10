/* ============================================================
   Life Link – Red Cross Dashboard  |  script.js
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

/* ── Disease Panel ── */
function toggleDisease(rowId) {
  const d = document.getElementById('drawer-' + rowId);
  const open = d.classList.contains('open');
  document.querySelectorAll('.disease-drawer').forEach(x => x.classList.remove('open'));
  if (!open) d.classList.add('open');
}

function updateSelectColor(sel) {
  if (sel.value === 'pos') {
    sel.style.background = '#fee2e2';
    sel.style.color = '#991b1b';
  } else {
    sel.style.background = '#d1fae5';
    sel.style.color = '#065f46';
  }
}

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
}