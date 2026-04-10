/* ============================================================
   Life Link – User Dashboard  |  user-script.js
   ============================================================ */

const RARE_BLOOD_TYPES = ['A-', 'B-', 'O-', 'AB-', 'Rh-null'];

const RARE_LABELS = {
  'A-':      'A Negative (A−)',
  'B-':      'B Negative (B−)',
  'O-':      'O Negative (O−)',
  'AB-':     'AB Negative (AB−)',
  'Rh-null': 'Rh-null (Golden Blood)',
};

/* ── User data (replace with real session/API data) ── */
const userData = {
  firstName:  'Riya',
  fullName:   'Riya Thapa',
  email:      'Riya@gmail.com',
  bloodGroup: 'A+',
  donations:  '5'
};

/* ══════════════════════════════
   INIT
   ══════════════════════════════ */
window.onload = function () {
  document.getElementById('display-firstname').innerText = userData.firstName;
  document.getElementById('display-fullname').innerText  = userData.fullName;
  document.getElementById('display-email').innerText     = userData.email;
  document.getElementById('display-bloodgroup').innerText = userData.bloodGroup;
  document.getElementById('display-donations').innerText  = userData.donations;

  // Default to request tab
  selectTab('request');

  // Close modals on overlay click
  document.querySelectorAll('.rare-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });
};

/* ══════════════════════════════
   TAB SWITCHING
   ══════════════════════════════ */
function selectTab(tab) {
  const donateBtn   = document.getElementById('donateBtn');
  const requestBtn  = document.getElementById('requestBtn');
  const donorForm   = document.getElementById('donorForm');
  const requestForm = document.getElementById('requestForm');

  if (tab === 'donate') {
    donateBtn.className  = 'action-btn active-red';
    requestBtn.className = 'action-btn inactive';
    donorForm.classList.add('visible');
    requestForm.classList.remove('visible');
  } else {
    requestBtn.className = 'action-btn active-red';
    donateBtn.className  = 'action-btn inactive';
    requestForm.classList.add('visible');
    donorForm.classList.remove('visible');
  }
}

/* ══════════════════════════════
   TOAST
   ══════════════════════════════ */
function showToast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + (type || '');
  setTimeout(() => { t.className = 'toast'; }, 3500);
}

/* ══════════════════════════════
   RARE BLOOD CHECKS
   ══════════════════════════════ */
function checkRareBloodDonor() {
  const val = document.getElementById('donorBloodGroup').value;
  if (RARE_BLOOD_TYPES.includes(val)) {
    const label = RARE_LABELS[val] || val;
    document.getElementById('rareDonorBadgeText').textContent  = label;
    document.getElementById('rareDonorBloodText').textContent  = label;
    document.getElementById('rareDonorContact').value          = '';
    document.getElementById('rareDonorModal').classList.add('open');
  }
}

function checkRareBloodRequest() {
  const val = document.getElementById('requestBloodGroup').value;
  if (RARE_BLOOD_TYPES.includes(val)) {
    const label = RARE_LABELS[val] || val;
    document.getElementById('rareRequestBadgeText').textContent  = label;
    document.getElementById('rareRequestBloodText').textContent  = label;
    document.getElementById('rareRequestBloodText2').textContent = label;
    document.getElementById('rareRequestContact').value          = '';
    document.getElementById('rareRequestModal').classList.add('open');
  }
}

function closeRareModal(id) {
  document.getElementById(id).classList.remove('open');
}

function submitRareContact(type) {
  const inputId = type === 'donor' ? 'rareDonorContact' : 'rareRequestContact';
  const input   = document.getElementById(inputId);
  const contact = input.value.trim();

  if (!contact) {
    input.style.borderColor = '#ef4444';
    input.focus();
    return;
  }

  input.style.borderColor = '';
  const modalId = type === 'donor' ? 'rareDonorModal' : 'rareRequestModal';
  closeRareModal(modalId);

  showToast(
    type === 'donor'
      ? "Contact saved! We'll reach you when needed."
      : "We'll contact you when a match is found.",
    'success'
  );
}

/* ══════════════════════════════
   VALIDATION
   ══════════════════════════════ */
function clearErrors() {
  document.querySelectorAll('.error-msg').forEach(e => e.classList.remove('show'));
  document.querySelectorAll('.input-error').forEach(e => e.classList.remove('input-error'));
}

function validateAge(input) {
  const val = parseInt(input.value);
  const err = document.getElementById('ageError');
  if (input.value !== '' && val < 18) {
    err.classList.add('show');
    input.classList.add('input-error');
  } else {
    err.classList.remove('show');
    input.classList.remove('input-error');
  }
}

function validateWeight(input) {
  const val = parseFloat(input.value);
  const err = document.getElementById('weightError');
  if (input.value !== '' && val < 45) {
    err.classList.add('show');
    input.classList.add('input-error');
  } else {
    err.classList.remove('show');
    input.classList.remove('input-error');
  }
}

/* ══════════════════════════════
   DONOR FORM SUBMIT
   ══════════════════════════════ */
function submitDonorForm() {
  clearErrors();
  let valid = true;

  const bg    = document.getElementById('donorBloodGroup').value;
  const loc   = document.getElementById('donorLocation').value.trim();
  const age   = parseInt(document.getElementById('donorAge').value);
  const wt    = parseFloat(document.getElementById('donorWeight').value);
  const units = parseFloat(document.getElementById('donorUnits').value);

  if (!bg || !loc) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  if (isNaN(age) || age < 18) {
    document.getElementById('ageError').classList.add('show');
    document.getElementById('donorAge').classList.add('input-error');
    valid = false;
  }

  if (isNaN(wt) || wt < 45) {
    document.getElementById('weightError').classList.add('show');
    document.getElementById('donorWeight').classList.add('input-error');
    valid = false;
  }

  if (isNaN(units) || units < 400 || units > 500) {
    document.getElementById('unitsError').classList.add('show');
    document.getElementById('donorUnits').classList.add('input-error');
    valid = false;
  }

  if (valid) showToast('Donation registration submitted successfully!', 'success');
}

/* ══════════════════════════════
   REQUEST FORM SUBMIT
   ══════════════════════════════ */
function updateUrgencyStyle() {
  const sel  = document.getElementById('requestUrgency');
  const hint = document.getElementById('urgencyHint');
  const val  = sel.value;

  sel.className = val ? 'urgency-' + val : '';

  if (val === 'normal') {
    hint.style.display = 'block';
    hint.innerHTML = '<span class="urgency-badge normal">● Normal</span> Scheduled or routine transfusion';
  } else if (val === 'emergency') {
    hint.style.display = 'block';
    hint.innerHTML = '<span class="urgency-badge emergency">● Emergency</span> Required within 24 hours';
  } else if (val === 'critical') {
    hint.style.display = 'block';
    hint.innerHTML = '<span class="urgency-badge critical">● Critical</span> Immediate — life-threatening situation';
  } else {
    hint.style.display = 'none';
    hint.innerHTML = '';
  }
}

function submitRequestForm() {
  const bg      = document.getElementById('requestBloodGroup').value;
  const loc     = document.getElementById('requestLocation').value.trim();
  const date    = document.getElementById('requestDate').value;
  const units   = parseFloat(document.getElementById('requestUnits').value);
  const urgency = document.getElementById('requestUrgency').value;
  const errEl   = document.getElementById('reqUnitsError');

  errEl.classList.remove('show');
  document.getElementById('requestUnits').classList.remove('input-error');

  if (!bg || !loc || !date || !urgency) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  if (isNaN(units) || units < 400 || units > 2000) {
    errEl.classList.add('show');
    document.getElementById('requestUnits').classList.add('input-error');
    return;
  }

  showToast('Blood request submitted successfully!', 'success');
}