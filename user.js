/* ============================================================
   Life Link – User Dashboard  |  user.js
   ============================================================ */

/* ── Constants ── */
const RARE_BLOOD_TYPES = ['A-', 'B-', 'O-', 'AB-'];

const RARE_BLOOD_LABELS = {
  'A-':  'A Negative (A−)',
  'B-':  'B Negative (B−)',
  'O-':  'O Negative (O−)',
  'AB-': 'AB Negative (AB−)',
};

/* ── User data (age fetched from backend via DOB stored at sign-up) ── */
const userData = {
  firstName:  'Riya',
  fullName:   'Riya Thapa',
  email:      'Riya@gmail.com',
  bloodGroup: 'A+',
  donations:  '5',
};

/* ── Notification data ── */
const userNotifications = [
  { id: 'un1', type: 'approved', read: false, time: '10 min ago', msg: 'Your blood request for <strong>A+ (2 units)</strong> has been <strong>approved</strong>. Please visit Central Red Cross, Chakrapath to collect.' },
  { id: 'un2', type: 'pending',  read: false, time: '2 hrs ago',  msg: 'Your donation registration is <strong>under review</strong>. Our team will confirm your appointment within 24 hours.' },
  { id: 'un3', type: 'urgent',   read: false, time: '3 hrs ago',  msg: '<strong>Urgent:</strong> The hospital needs your blood type <strong>A+</strong>. Please contact Red Cross at +977-1-4228094.' },
  { id: 'un4', type: 'approved', read: true,  time: 'Yesterday',  msg: 'Your donor profile has been <strong>verified</strong> and activated. You are now eligible to donate blood.' },
  { id: 'un5', type: 'rejected', read: true,  time: '2 days ago', msg: 'Your previous donation request was <strong>declined</strong> — hemoglobin levels were below threshold. Please try again after 14 days.' },
  { id: 'un6', type: 'info',     read: true,  time: '3 days ago', msg: 'Donation reminder: You are now eligible to donate again. Your last donation was 3 months ago.' },
  { id: 'un7', type: 'info',     read: true,  time: '1 week ago', msg: 'Thank you for your <strong>5th donation</strong>! You have been awarded the Life Saver Silver Badge.' },
];

const NOTIFICATION_ICONS = {
  approved: { cls: 'ni-approved', svg: '<circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/>' },
  rejected: { cls: 'ni-rejected', svg: '<circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/>' },
  pending:  { cls: 'ni-pending',  svg: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/>' },
  urgent:   { cls: 'ni-urgent',   svg: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },
  info:     { cls: 'ni-info',     svg: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' },
};

/* ── Track which rare-blood blood group dropdowns need re-selection ── */
let donorBloodGroupPending   = false;
let requestBloodGroupPending = false;

let currentNotifFilter = 'all';

/* ══════════════════════════════
   INIT
   ══════════════════════════════ */
window.onload = function () {
  document.getElementById('display-firstname').innerText  = userData.firstName;
  document.getElementById('display-fullname').innerText   = userData.fullName;
  document.getElementById('display-email').innerText      = userData.email;
  document.getElementById('display-bloodgroup').innerText = userData.bloodGroup;
  document.getElementById('display-donations').innerText  = userData.donations;

  /* Set date constraints */
  setDateConstraints();

  /* Default to request tab */
  selectTab('request');

  /* Init notification badges */
  userUpdateBadges();
};

/* ══════════════════════════════
   DATE CONSTRAINTS
   ══════════════════════════════ */
function setDateConstraints() {
  const today    = new Date();
  const todayStr = toDateInputString(today);

  /* Last donation date: past dates only (up to today) */
  const lastDateInput = document.getElementById('donorLastDate');
  lastDateInput.max = todayStr;

  /* Date needed: future dates only within the current year */
  const requestDateInput   = document.getElementById('requestDate');
  const currentYearLastDay = toDateInputString(new Date(today.getFullYear(), 11, 31));
  requestDateInput.min = todayStr;
  requestDateInput.max = currentYearLastDay;
}

function toDateInputString(date) {
  const year  = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day   = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/* ══════════════════════════════
   TEXT-ONLY FIELD ENFORCEMENT
   (blocks numeric-only input in location fields)
   ══════════════════════════════ */
function enforceTextOnly(input) {
  const value    = input.value;
  const filtered = value.replace(/^\d+$/, '');
  if (filtered !== value) input.value = filtered;
}

/* ══════════════════════════════
   RARE BLOOD GROUP HANDLING
   ══════════════════════════════ */
function handleDonorBloodGroupChange() {
  const value = document.getElementById('donorBloodGroup').value;
  if (RARE_BLOOD_TYPES.includes(value)) {
    donorBloodGroupPending = true;
    openRareDonorModal(value);
  } else {
    donorBloodGroupPending = false;
  }
}

function handleRequestBloodGroupChange() {
  const value = document.getElementById('requestBloodGroup').value;
  if (RARE_BLOOD_TYPES.includes(value)) {
    requestBloodGroupPending = true;
    openRareRequestModal(value);
  } else {
    requestBloodGroupPending = false;
  }
}

function openRareDonorModal(bloodGroup) {
  const label = RARE_BLOOD_LABELS[bloodGroup] || bloodGroup;
  document.getElementById('rareDonorBadgeText').textContent = label;
  document.getElementById('rareDonorBloodText').textContent = label;
  document.getElementById('rareDonorContact').value         = '';
  clearRareError('rareDonorContact', 'rareDonorContactError');
  document.getElementById('rareDonorModal').classList.add('open');
}

function openRareRequestModal(bloodGroup) {
  const label = RARE_BLOOD_LABELS[bloodGroup] || bloodGroup;
  document.getElementById('rareRequestBadgeText').textContent  = label;
  document.getElementById('rareRequestBloodText').textContent  = label;
  document.getElementById('rareRequestBloodText2').textContent = label;
  document.getElementById('rareRequestContact').value          = '';
  clearRareError('rareRequestContact', 'rareRequestContactError');
  document.getElementById('rareRequestModal').classList.add('open');
}

/* Close handlers — reset blood group select if user closes without providing contact */
function closeRareDonorModal() {
  document.getElementById('rareDonorModal').classList.remove('open');
  if (donorBloodGroupPending) {
    document.getElementById('donorBloodGroup').value = '';
    donorBloodGroupPending = false;
    showToast('Please select a blood group to continue.', 'error');
  }
}

function closeRareRequestModal() {
  document.getElementById('rareRequestModal').classList.remove('open');
  if (requestBloodGroupPending) {
    document.getElementById('requestBloodGroup').value = '';
    requestBloodGroupPending = false;
    showToast('Please select a blood group to continue.', 'error');
  }
}

function submitRareContact(type) {
  if (type === 'donor') {
    const input   = document.getElementById('rareDonorContact');
    const contact = input.value.trim();
    if (!contact) {
      showRareError('rareDonorContact', 'rareDonorContactError');
      return;
    }
    clearRareError('rareDonorContact', 'rareDonorContactError');
    donorBloodGroupPending = false;
    document.getElementById('rareDonorModal').classList.remove('open');
    showToast("Contact saved! We'll reach you when needed.", 'success');
  } else {
    const input   = document.getElementById('rareRequestContact');
    const contact = input.value.trim();
    if (!contact) {
      showRareError('rareRequestContact', 'rareRequestContactError');
      return;
    }
    clearRareError('rareRequestContact', 'rareRequestContactError');
    requestBloodGroupPending = false;
    document.getElementById('rareRequestModal').classList.remove('open');
    showToast("We'll contact you when a match is found.", 'success');
  }
}

function showRareError(inputId, errorId) {
  document.getElementById(inputId).classList.add('input-error');
  document.getElementById(errorId).classList.add('show');
}

function clearRareError(inputId, errorId) {
  document.getElementById(inputId).classList.remove('input-error');
  document.getElementById(errorId).classList.remove('show');
}

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
   VIEW SWITCHING
   ══════════════════════════════ */
function switchView(view, navEl) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (navEl) navEl.classList.add('active');
  document.getElementById('view-dashboard').style.display    = view === 'dashboard'    ? 'block' : 'none';
  document.getElementById('view-notifications').style.display = view === 'notifications' ? 'block' : 'none';
  if (view === 'notifications') userRenderPage(currentNotifFilter);
}

/* ══════════════════════════════
   FORM SUBMISSION
   ══════════════════════════════ */
function submitDonorFormU() {
  const bloodGroup = document.getElementById('donorBloodGroup').value;
  const location   = document.getElementById('donorLocation').value.trim();
  const weight     = parseFloat(document.getElementById('donorWeight').value);
  const units      = parseFloat(document.getElementById('donorUnits').value);

  if (!bloodGroup || !location) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  if (isNaN(weight) || weight < 45) {
    showToast('Weight must be at least 45 kg.', 'error');
    return;
  }

  if (isNaN(units) || units < 400 || units > 500) {
    showToast('Units to donate must be between 400 ml and 500 ml.', 'error');
    return;
  }

  showToast('Donation registration submitted successfully!', 'success');
}

function submitRequestFormU() {
  const bloodGroup = document.getElementById('requestBloodGroup').value;
  const location   = document.getElementById('requestLocation').value.trim();
  const date       = document.getElementById('requestDate').value;
  const units      = parseFloat(document.getElementById('requestUnits').value);
  const urgency    = document.getElementById('requestUrgency').value;

  if (!bloodGroup || !location || !date || !urgency) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  if (isNaN(units) || units < 400 || units > 2000) {
    showToast('Units required must be between 400 ml and 2000 ml.', 'error');
    return;
  }

  showToast('Blood request submitted successfully!', 'success');
}

/* ══════════════════════════════
   TOAST
   ══════════════════════════════ */
function showToast(msg, type) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className   = 'toast show ' + (type || '');
  setTimeout(() => { toast.className = 'toast'; }, 3500);
}

/* ══════════════════════════════
   NOTIFICATIONS – BADGES
   ══════════════════════════════ */
function userGetUnreadCount() {
  return userNotifications.filter(n => !n.read).length;
}

function userUpdateBadges() {
  const count    = userGetUnreadCount();
  const bellBadge = document.getElementById('user-bell-badge');
  const navDot    = document.getElementById('user-nav-dot');
  if (bellBadge) { bellBadge.textContent = count; bellBadge.style.display = count ? 'flex' : 'none'; }
  if (navDot)    { navDot.textContent    = count; navDot.style.display    = count ? 'inline-flex' : 'none'; }
}

/* ══════════════════════════════
   NOTIFICATIONS – DROPDOWN
   ══════════════════════════════ */
function userRenderDropdown() {
  const list = document.getElementById('user-dd-list');
  if (!list) return;
  const items = userNotifications.slice(0, 5);
  list.innerHTML = items.map(n => {
    const icon = NOTIFICATION_ICONS[n.type] || NOTIFICATION_ICONS.info;
    return `<div class="nd-item${n.read ? '' : ' unread'}" onclick="userMarkRead('${n.id}')">
      <div class="nd-icon ${icon.cls}"><svg viewBox="0 0 24 24">${icon.svg}</svg></div>
      <div class="nd-content">
        <div class="nd-msg">${n.msg}</div>
        <div class="nd-time">${n.time}</div>
      </div>
    </div>`;
  }).join('');
}

function toggleUserDropdown() {
  const dropdown = document.getElementById('user-notif-dropdown');
  dropdown.classList.toggle('open');
  if (dropdown.classList.contains('open')) userRenderDropdown();
}

function closeUserDropdown() {
  document.getElementById('user-notif-dropdown').classList.remove('open');
}

document.addEventListener('click', e => {
  const wrap = document.querySelector('.notif-bell-wrap');
  if (wrap && !wrap.contains(e.target)) closeUserDropdown();
});

/* ══════════════════════════════
   NOTIFICATIONS – FULL PAGE
   ══════════════════════════════ */
function userRenderPage(filter = 'all') {
  const panel = document.getElementById('user-notif-panel');
  if (!panel) return;

  const items = userNotifications.filter(n => filter === 'all' || n.type === filter);

  if (!items.length) {
    panel.innerHTML = `<div class="np-empty">
      <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      No notifications here.
    </div>`;
    return;
  }

  panel.innerHTML = items.map(n => {
    const icon = NOTIFICATION_ICONS[n.type] || NOTIFICATION_ICONS.info;
    return `<div class="np-item${n.read ? '' : ' unread'}" id="up-${n.id}">
      <div class="np-icon ${icon.cls}"><svg viewBox="0 0 24 24">${icon.svg}</svg></div>
      <div class="np-content">
        <div class="np-msg">${n.msg}</div>
        <div class="np-meta">
          <span class="np-time">${n.time}</span>
          <span class="np-tag np-tag-${n.type}">${n.type.charAt(0).toUpperCase() + n.type.slice(1)}</span>
          ${!n.read ? '<span class="np-new">New</span>' : ''}
        </div>
      </div>
      <button class="np-dismiss" onclick="userDismiss('${n.id}')">✕</button>
    </div>`;
  }).join('');
}

function userMarkRead(id) {
  const notification = userNotifications.find(n => n.id === id);
  if (notification) notification.read = true;
  userUpdateBadges();
  userRenderDropdown();
  userRenderPage(currentNotifFilter);
}

function userMarkAll() {
  userNotifications.forEach(n => n.read = true);
  userUpdateBadges();
  userRenderDropdown();
  userRenderPage(currentNotifFilter);
  showToast('All notifications marked as read.', 'success');
}

function userDismiss(id) {
  const index = userNotifications.findIndex(n => n.id === id);
  if (index > -1) userNotifications.splice(index, 1);
  userUpdateBadges();
  userRenderDropdown();
  userRenderPage(currentNotifFilter);
}

function userFilterPage(filter, btn) {
  currentNotifFilter = filter;
  document.querySelectorAll('.uf-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  userRenderPage(filter);
}