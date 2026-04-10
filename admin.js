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
}