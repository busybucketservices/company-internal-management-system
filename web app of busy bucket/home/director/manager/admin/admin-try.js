// ============================================================
// Busy Bucket · Admin Dashboard — behaviour
// ============================================================

const statPending = document.getElementById('statPending');
const statActive = document.getElementById('statActive');
const statJobsToday = document.getElementById('statJobsToday');
const bookingGrid = document.getElementById('bookingGrid');

// ---------------------------------------------------------------
// 1. "Chal rahi bookings" — running-job timers, counted against the
//    actual allotted slot. Turns red once it runs past that slot.
// ---------------------------------------------------------------
function formatElapsed(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function attachRunningBadgeTimer(badge) {
  if (!badge) return;
  if (badge.classList.contains('upcoming') || badge.classList.contains('done') || badge.classList.contains('pending')) return;
  const elapsedEl = badge.querySelector('.bk-elapsed');
  if (!elapsedEl) return;

  let seconds = Number(badge.getAttribute('data-start-seconds')) || 0;

  function render() {
    // Duration is re-read every tick (not cached) so that Edit can extend
    // the allotted slot later and the overtime check respects the new value.
    const duration = Number(badge.getAttribute('data-duration-seconds')) || null;
    elapsedEl.textContent = formatElapsed(seconds);
    if (duration && seconds >= duration) {
      if (!badge.classList.contains('overtime')) {
        badge.classList.add('overtime');
        const card = badge.closest('.booking-card');
        // Partner ka allotted time khatam — ek naya booking-assign
        // request apne aap "Naya booking assign karein" mein aa jaata hai.
        if (card) spawnOverdueAssignRequest(card);
      }
    }
  }
  render();

  setInterval(() => {
    seconds += 1;
    render();
  }, 1000);
}

function startRunningBadgeTimers() {
  document.querySelectorAll('.bk-running-badge').forEach(attachRunningBadgeTimer);
}
startRunningBadgeTimers();

// ---------------------------------------------------------------
// 2. Booking view chips — "New Booking" / "Today Total Booking" / "Running"
// ---------------------------------------------------------------
const bookingViewChips = document.querySelectorAll('#bookingViewChips .chip');
const emptyBookingView = document.getElementById('emptyBookingView');

function applyCurrentBookingViewFilter() {
  const activeChip = document.querySelector('#bookingViewChips .chip.active');
  if (!activeChip) return;
  const view = activeChip.getAttribute('data-view');
  let anyVisible = false;

  document.querySelectorAll('#bookingGrid .booking-card').forEach(card => {
    const views = (card.getAttribute('data-view') || '').split(' ');
    const match = views.includes(view);
    card.style.display = match ? 'block' : 'none';
    if (match) anyVisible = true;
  });

  emptyBookingView.style.display = anyVisible ? 'none' : 'block';
}

bookingViewChips.forEach(chip => {
  chip.addEventListener('click', () => {
    bookingViewChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    applyCurrentBookingViewFilter();
  });
});

// ---------------------------------------------------------------
// 3. Booking card actions — message send / Edit / OK / Reject
// ---------------------------------------------------------------
function sendClientMsg(button) {
  const box = button.closest('.bk-msg-box');
  const input = box.querySelector('.bk-msg-input');
  if (!input.value.trim()) return;
  alert('Client ko bheja gaya: "' + input.value.trim() + '"');
  input.value = '';
}

function editBooking(button) {
  const card = button.closest('.booking-card');
  const badge = card.querySelector('.bk-running-badge');
  const partnerLine = Array.from(card.querySelectorAll('.bk-line')).find(l => l.textContent.includes('Partner:'));
  const currentPartner = partnerLine ? partnerLine.textContent.split('Partner:').pop().trim() : '';

  const newPartner = prompt('Partner ka naam badlein:', currentPartner);
  if (newPartner === null) return;
  if (partnerLine && newPartner.trim() && newPartner.trim() !== currentPartner) {
    const idx = partnerLine.textContent.lastIndexOf('Partner:') + 'Partner:'.length;
    partnerLine.textContent = partnerLine.textContent.slice(0, idx) + ' ' + newPartner.trim();
  }

  if (badge && badge.hasAttribute('data-duration-seconds')) {
    const extend = confirm('Booking ka time 30 minute aur badhana hai?');
    if (extend) {
      const duration = Number(badge.getAttribute('data-duration-seconds')) || 0;
      badge.setAttribute('data-duration-seconds', duration + 1800);
      badge.classList.remove('overtime');
    }
  }

  alert('Booking update ho gayi.');
}

// Shared parser used both for wiring up static "New" cards on load and
// for the OK button's "push to assign queue right now" shortcut.
function parseNewBookingCardFields(card) {
  const bookingIdEl = card.querySelector('.booking-id');
  const bookingId = bookingIdEl ? bookingIdEl.textContent.replace('#', '').trim() : bookingCounter++;
  const serviceEl = card.querySelector('.bk-service');
  const service = serviceEl ? serviceEl.childNodes[0].textContent.trim() : 'Booking';

  const lines = card.querySelectorAll('.bk-line');
  const clientParts = (lines[0] ? lines[0].textContent.replace('Client:', '') : '').split('·');
  const name = clientParts[0] ? clientParts[0].trim() : '';
  const phone = clientParts[1] ? clientParts[1].trim() : '';

  const areaRaw = lines[1] ? lines[1].textContent.trim() : '';
  const commaIdx = areaRaw.indexOf(',');
  const city = commaIdx > -1 ? areaRaw.slice(0, commaIdx).trim() : areaRaw;
  const area = commaIdx > -1 ? areaRaw.slice(commaIdx + 1).trim() : '';

  const timePartnerRaw = (lines[2] ? lines[2].textContent : '').split('·');
  const timeText = timePartnerRaw[0] ? timePartnerRaw[0].replace('Time:', '').trim() : '';
  const partnerText = timePartnerRaw[1] ? timePartnerRaw[1].replace('Partner:', '').trim() : '';

  const msgInput = card.querySelector('.bk-msg-input');
  const message = msgInput ? msgInput.value.trim() : '';

  return { bookingId, service, name, phone, city, area, timeText, partnerText, message };
}

function dismissBookingCard(card) {
  card.style.opacity = '0';
  card.style.transform = 'translateY(6px)';
  setTimeout(() => card.remove(), 220);
}

function markBookingOk(button) {
  const card = button.closest('.booking-card');
  const status = card.getAttribute('data-status');

  if (status === 'new') {
    // "New" booking par OK dabate hi, 30 second ka wait khatam — booking
    // turant "Naya booking assign karein" queue mein chali jaati hai.
    const f = parseNewBookingCardFields(card);
    card.remove();
    moveBookingToAssignQueue(f.bookingId, f.service, f.name, f.city, f.area, f.phone, f.timeText, f.partnerText, f.message);
    return;
  }

  if (status === 'done') {
    // Pehle se complete booking — OK isse list se hata deta hai.
    dismissBookingCard(card);
    return;
  }

  if (status === 'running') {
    const badge = card.querySelector('.bk-running-badge');
    if (badge && badge.classList.contains('overtime')) {
      // Allotted time poora ho chuka (overtime/complete) — OK isse hata deta hai.
      dismissBookingCard(card);
      return;
    }
  }

  // Abhi bhi chal rahi ya scheduled booking — sirf acknowledge karo.
  card.classList.add('is-ok');
}

function rejectBooking(button) {
  const card = button.closest('.booking-card');
  card.classList.add('is-rejected');
  alert('Booking reject kar di gayi.');
}

// ---------------------------------------------------------------
// 4. Partner profile / live-status modal
// ---------------------------------------------------------------
const profileModalOverlay = document.getElementById('profileModalOverlay');
const profileModal = profileModalOverlay ? profileModalOverlay.querySelector('.profile-modal') : null;

if (profileModal) {
  profileModal.addEventListener('click', e => e.stopPropagation());
}

function viewPartnerProfile(name, service, area, timing) {
  document.getElementById('profileModalAvatar').textContent = name.charAt(0).toUpperCase();
  document.getElementById('profileModalName').textContent = name;
  document.getElementById('profileModalStatus').textContent = 'Live status';
  document.getElementById('profileModalService').textContent = service;
  document.getElementById('profileModalArea').textContent = area;
  document.getElementById('profileModalTiming').textContent = timing;
  profileModalOverlay.classList.add('open');
}

function closePartnerProfile(event) {
  if (event) event.stopPropagation();
  profileModalOverlay.classList.remove('open');
}

// ---------------------------------------------------------------
// 5. Booking Assign queue — countdown timers.
//    Jab tak admin khud Accept/Reject na kare, 30 sec baad booking
//    apne aap partner ko chali jaati hai (auto-assign) aur queue se
//    hat jaati hai.
// ---------------------------------------------------------------
const queueBadge = document.getElementById('queueBadge');
const emptyAssign = document.getElementById('emptyAssign');
const assignQueueList = document.getElementById('assignQueueList');

function startTimer(timerEl, onExpire) {
  let seconds = Number(timerEl.getAttribute('data-seconds'));
  const interval = setInterval(() => {
    seconds -= 1;
    if (seconds <= 0) {
      clearInterval(interval);
      timerEl.textContent = 'Expired';
      timerEl.classList.add('expired');
      if (typeof onExpire === 'function') {
        setTimeout(onExpire, 900);
      }
      return;
    }
    timerEl.textContent = seconds + ' sec';
  }, 1000);
  timerEl._intervalId = interval;
}

function autoAssignToPartner(timerEl) {
  const card = timerEl.closest('.assign-card');
  if (!card) return;
  card.style.opacity = '0';
  card.style.transform = 'translateX(24px)';
  setTimeout(() => {
    card.remove();
    updateAssignQueueCount();
    statActive.textContent = Number(statActive.textContent) + 1;
  }, 220);
}

function startAssignTimers() {
  document.querySelectorAll('.assign-timer').forEach(timerEl => {
    startTimer(timerEl, () => autoAssignToPartner(timerEl));
  });
}
startAssignTimers();

function updateAssignQueueCount() {
  const remaining = document.querySelectorAll('#assignQueueList .assign-card').length;
  queueBadge.textContent = remaining;
  emptyAssign.style.display = remaining === 0 ? 'block' : 'none';
}

// Jab kisi running booking ka allotted time (2pm-4pm jaisa slot) khatam ho
// jaata hai, partner ab free hai — usi partner ke liye ek naya booking
// request apne aap "Naya booking assign karein" queue mein daal dete hain.
function spawnOverdueAssignRequest(bookingCard) {
  const serviceEl = bookingCard.querySelector('.bk-service');
  const service = serviceEl ? serviceEl.childNodes[0].textContent.trim() : 'Booking';
  const lines = bookingCard.querySelectorAll('.bk-line');
  const clientLine = lines[0] ? lines[0].textContent.trim() : '';
  const areaLine = lines[1] ? lines[1].textContent.trim() : '';
  const partnerLine = lines[2] ? lines[2].textContent.trim() : '';
  const partnerName = partnerLine.includes('Partner:') ? partnerLine.split('Partner:').pop().trim() : (partnerLine || 'Partner');

  const bookingId = bookingCounter++;
  const card = document.createElement('div');
  card.className = 'assign-card';
  card.setAttribute('data-booking', bookingId);
  card.innerHTML = `
    <div class="assign-head">
      <div class="assign-title">${service} <span class="booking-id">#${bookingId}</span></div>
      <div class="assign-timer" data-seconds="30">30 sec</div>
    </div>
    <div class="assign-line">${areaLine}</div>
    <div class="assign-line">${clientLine} · Purana slot khatam, ${partnerName} abhi free ho raha hai</div>
    <div class="field" style="margin-top:12px;">
      <label>Partner assign karein</label>
      <select class="assignPartnerSelect">
        <option>${partnerName} — abhi free ho raha hai</option>
        <option>Amit — Mohali</option>
        <option>Ramesh — Zirakpur</option>
        <option>Suresh — Panchkula</option>
        <option>Priya — Ludhiana</option>
        <option>Vikash — Chandigarh</option>
      </select>
    </div>
    <div class="assign-actions">
      <button class="view-profile-btn" onclick="window.location.href='attendance.html'">View Profile</button>
      <button class="btn-reject" onclick="handleAssign(this,'reject')">Reject</button>
      <button class="btn-approve" onclick="handleAssign(this,'accept')">Accept</button>
    </div>
  `;
  assignQueueList.prepend(card);
  const timerEl = card.querySelector('.assign-timer');
  startTimer(timerEl, () => autoAssignToPartner(timerEl));
  updateAssignQueueCount();
}

function handleAssign(button, action) {
  const card = button.closest('.assign-card');
  const timerEl = card.querySelector('.assign-timer');
  if (timerEl && timerEl._intervalId) clearInterval(timerEl._intervalId);

  if (action === 'accept') {
    addAcceptedBookingToGrid(card);
  }

  card.style.opacity = '0';
  card.style.transform = 'translateX(24px)';
  setTimeout(() => {
    card.remove();
    updateAssignQueueCount();
    if (action === 'accept') {
      statActive.textContent = Number(statActive.textContent) + 1;
    }
  }, 220);
}

// Accept dabate hi wahi booking "Aaj ki Bookings" mein ek nayi running
// job ban kar aa jaati hai — jis jagah purani booking khatam hui thi,
// usi jagah naya booking dikhta hai.
function addAcceptedBookingToGrid(assignCard) {
  const titleEl = assignCard.querySelector('.assign-title');
  const service = titleEl ? titleEl.childNodes[0].textContent.trim() : 'Booking';
  const bookingIdEl = assignCard.querySelector('.booking-id');
  const bookingId = bookingIdEl ? bookingIdEl.textContent.replace('#', '').trim() : bookingCounter++;
  const lines = assignCard.querySelectorAll('.assign-line');
  const areaLine = lines[0] ? lines[0].textContent.trim() : '';
  const clientLine = lines[1] ? lines[1].textContent.split('·')[0].trim() : '';
  const timeLine = lines[2] ? lines[2].textContent.trim() : '';
  const partnerSelect = assignCard.querySelector('.assignPartnerSelect');
  const partnerText = partnerSelect ? partnerSelect.options[partnerSelect.selectedIndex].text : '';
  const partnerName = partnerText.split('—')[0].trim() || 'Partner';
  const message = assignCard.getAttribute('data-message') || '';

  const card = document.createElement('div');
  card.className = 'booking-card';
  card.setAttribute('data-status', 'running');
  card.setAttribute('data-view', 'today all running');
  card.innerHTML = `
    <div class="bk-top">
      <div class="bk-service">${service} <span class="booking-id">#${bookingId}</span></div>
      <span class="bk-running-badge" data-start-seconds="0" data-duration-seconds="3600">
        <span class="pulse-dot"></span> Running · <span class="bk-elapsed">00:00:00</span>
      </span>
    </div>
    <div class="bk-line">${clientLine}</div>
    <div class="bk-line">${areaLine}</div>
    <div class="bk-line">${timeLine ? timeLine + ' · ' : ''}Partner: ${partnerName}</div>

    <div class="bk-live-status">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
      ${partnerName} ko naya job mil gaya hai
    </div>

    <div class="bk-msg-box">
      <textarea class="bk-msg-input" placeholder="Koi bhi message likhein...">${escapeHtml(message)}</textarea>
      <button class="bk-send-btn" onclick="sendClientMsg(this)">Send</button>
    </div>

    <div class="bk-actions four">
      <button class="mini-btn outline full" onclick="viewPartnerProfile('${partnerName}','${service}','${areaLine.replace(/'/g, '')}','Abhi shuru hua (in progress)')">Visit Profile</button>
      <button class="mini-btn outline" onclick="editBooking(this)">Edit</button>
      <button class="mini-btn ok" onclick="markBookingOk(this)">OK</button>
      <button class="mini-btn reject" onclick="rejectBooking(this)">Reject</button>
    </div>
  `;
  bookingGrid.prepend(card);
  attachRunningBadgeTimer(card.querySelector('.bk-running-badge'));
  applyCurrentBookingViewFilter();
}

// ---------------------------------------------------------------
// 6. Naya booking add karein -> pehle "New Booking" view mein aata
//    hai, 30 sec baad apne aap "Naya booking assign karein" (queue)
//    mein chala jaata hai, jahan se 30 sec baad partner ko assign
//    ho jaata hai (see autoAssignToPartner).
// ---------------------------------------------------------------
const bookingForm = document.getElementById('bookingForm');
let bookingCounter = 9431;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

bookingForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const service = document.getElementById('bkService').value;
  const name = document.getElementById('bkName').value.trim();
  const city = document.getElementById('bkCity').value;
  const phone = document.getElementById('bkPhone').value;
  const area = document.getElementById('bkArea').value;
  const hour = document.getElementById('bkHour').value;
  const minute = document.getElementById('bkMinute').value;
  const meridiem = document.getElementById('bkMeridiem').value;
  const partnerSelect = document.getElementById('bkPartner');
  const partnerText = partnerSelect.options[partnerSelect.selectedIndex].text;
  const message = document.getElementById('bkMessage').value.trim();

  if (!service || !name || !phone || !area || !hour || !minute) return;

  const timeText = hour + ':' + minute + ' ' + meridiem;
  const bookingId = bookingCounter++;
  addNewBookingCardToGrid(bookingId, service, name, city, area, phone, timeText, partnerText, message);
  statJobsToday.textContent = Number(statJobsToday.textContent) + 1;

  bookingForm.reset();
});

function addNewBookingCardToGrid(bookingId, service, name, city, area, phone, timeText, partnerText, message) {
  const card = document.createElement('div');
  card.className = 'booking-card';
  card.setAttribute('data-status', 'new');
  card.setAttribute('data-view', 'today');
  card.innerHTML = `
    <div class="bk-top">
      <div class="bk-service">${service} <span class="booking-id">#${bookingId}</span></div>
      <span class="bk-running-badge pending">
        <span class="pulse-dot"></span> New · <span class="bk-new-countdown">30</span>s
      </span>
    </div>
    <div class="bk-line">Client: ${name} · ${phone}</div>
    <div class="bk-line">${city}, ${area}</div>
    <div class="bk-line">Time: ${timeText} · Partner: ${partnerText}</div>

    <div class="bk-live-status muted">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      Booking Assign mein bheji ja rahi hai...
    </div>

    <div class="bk-msg-box">
      <textarea class="bk-msg-input" placeholder="Koi bhi message likhein...">${escapeHtml(message || '')}</textarea>
      <button class="bk-send-btn" onclick="sendClientMsg(this)">Send</button>
    </div>

    <div class="bk-actions four">
      <button class="mini-btn outline full" onclick="viewPartnerProfile('${partnerText.split('—')[0].trim()}','${service}','${(city + ', ' + area).replace(/'/g, '')}','Naya booking — assign hone wala hai')">Visit Profile</button>
      <button class="mini-btn outline" onclick="editBooking(this)">Edit</button>
      <button class="mini-btn ok" onclick="markBookingOk(this)">OK</button>
      <button class="mini-btn reject" onclick="rejectBooking(this)">Reject</button>
    </div>
  `;
  bookingGrid.prepend(card);
  applyCurrentBookingViewFilter();
  attachNewBookingCountdown(card, bookingId, service, name, city, area, phone, timeText, partnerText, message);
}

// Jab "New" booking ka 30-second countdown khatam hota hai, booking khud
// ba khud "Naya booking assign karein" queue mein chali jaati hai.
function attachNewBookingCountdown(card, bookingId, service, name, city, area, phone, timeText, partnerText, message) {
  const countdownEl = card.querySelector('.bk-new-countdown');
  if (!countdownEl) return;
  let secondsLeft = Number(countdownEl.textContent) || 30;
  const iv = setInterval(() => {
    secondsLeft -= 1;
    countdownEl.textContent = secondsLeft;
    if (secondsLeft <= 0) {
      clearInterval(iv);
      card.remove();
      moveBookingToAssignQueue(bookingId, service, name, city, area, phone, timeText, partnerText, message);
    }
  }, 1000);
}

// Static demo "New Booking" cards already sitting in the HTML also get
// wired up the same way, parsed straight from their markup.
function parseAndAttachStaticNewBooking(card) {
  const f = parseNewBookingCardFields(card);
  attachNewBookingCountdown(card, f.bookingId, f.service, f.name, f.city, f.area, f.phone, f.timeText, f.partnerText, f.message);
}

function startStaticNewBookingCountdowns() {
  document.querySelectorAll('#bookingGrid .booking-card[data-status="new"]').forEach(parseAndAttachStaticNewBooking);
}
startStaticNewBookingCountdowns();

function moveBookingToAssignQueue(bookingId, service, name, city, area, phone, timeText, partnerText, message) {
  const card = document.createElement('div');
  card.className = 'assign-card';
  card.setAttribute('data-booking', bookingId);
  if (message) card.setAttribute('data-message', message);
  card.innerHTML = `
    <div class="assign-head">
      <div class="assign-title">${service} <span class="booking-id">#${bookingId}</span></div>
      <div class="assign-timer" data-seconds="30">30 sec</div>
    </div>
    <div class="assign-line">Area: ${city}, ${area}</div>
    <div class="assign-line">Client: ${name} · ${phone}</div>
    <div class="assign-line">Time: ${timeText}</div>
    ${message ? `<div class="assign-line">Note: ${escapeHtml(message)}</div>` : ''}
    <div class="field" style="margin-top:12px;">
      <label>Partner assign karein</label>
      <select class="assignPartnerSelect">
        <option>${partnerText}</option>
        <option>Amit — Mohali</option>
        <option>Ramesh — Zirakpur</option>
        <option>Suresh — Panchkula</option>
        <option>Priya — Ludhiana</option>
        <option>Vikash — Chandigarh</option>
      </select>
    </div>
    <div class="assign-actions">
      <button class="view-profile-btn" onclick="window.location.href='attendance.html'">View Profile</button>
      <button class="btn-reject" onclick="handleAssign(this,'reject')">Reject</button>
      <button class="btn-approve" onclick="handleAssign(this,'accept')">Accept</button>
    </div>
  `;
  assignQueueList.prepend(card);
  const timerEl = card.querySelector('.assign-timer');
  startTimer(timerEl, () => autoAssignToPartner(timerEl));
  updateAssignQueueCount();
}

// ---------------------------------------------------------------
// 7. Partners panel — filter chips
// ---------------------------------------------------------------
const partnerChips = document.querySelectorAll('#partnerChips .chip');
const emptyPartnerGroup = document.getElementById('emptyPartnerGroup');

partnerChips.forEach(chip => {
  chip.addEventListener('click', () => {
    partnerChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const group = chip.getAttribute('data-group');
    let anyVisible = false;

    document.querySelectorAll('#partnersDetailList .partner-detail-card').forEach(card => {
      const match = group === 'all' || card.getAttribute('data-group') === group;
      card.style.display = match ? 'block' : 'none';
      if (match) anyVisible = true;
    });

    emptyPartnerGroup.style.display = anyVisible ? 'none' : 'block';
  });
});