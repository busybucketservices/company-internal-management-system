// ============================================================
// Busy Bucket · Attendance page — behaviour
// ============================================================

// ---------------------------------------------------------------
// Calendar — July 2026 (starts Wednesday, 31 days) — demo attendance data
// ---------------------------------------------------------------
const calGrid = document.getElementById('calGrid');
const dows = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
dows.forEach(d => {
  const el = document.createElement('div');
  el.className = 'cal-dow';
  el.textContent = d;
  calGrid.appendChild(el);
});

const firstDayOffset = 3; // July 1 2026 = Wednesday
const daysInMonth = 31;
const today = 12;
const absentDays = [5, 19];
const leaveDays = [1];

// Daily minutes worked (demo data) — key = date, value = minutes worked that day.
// absent / leave / future days simply nahi honge is object mein (0 maana jayega)
const dailyMinutes = {
  2: 495, 3: 480, 4: 470,
  6: 500, 7: 485, 8: 490, 9: 478,
  10: 508, 11: 461, 12: 498
  // 1 = leave, 5 = absent, 13-31 abhi tak hue nahi (future dates)
};

for (let i = 0; i < firstDayOffset; i++) {
  const el = document.createElement('div');
  el.className = 'cal-day empty';
  calGrid.appendChild(el);
}
for (let d = 1; d <= daysInMonth; d++) {
  const el = document.createElement('div');
  el.className = 'cal-day';
  el.textContent = d;
  if (d <= today) {
    if (absentDays.includes(d)) el.classList.add('absent');
    else if (leaveDays.includes(d)) el.classList.add('leave');
    else el.classList.add('present');
  }
  if (d === today) el.classList.add('today');
  calGrid.appendChild(el);
}

// Calculate & show total hours worked this month
function formatHoursMinutes(totalMin) {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${m}m`;
}

const totalMinutesWorked = Object.values(dailyMinutes).reduce((sum, m) => sum + m, 0);
const totalHoursEl = document.getElementById('totalHours');
if (totalHoursEl) {
  totalHoursEl.textContent = formatHoursMinutes(totalMinutesWorked) + ' kaam kiya';
}

// ---------------------------------------------------------------
// Check-in / check-out toggle
// ---------------------------------------------------------------
let checkedIn = false;
function toggleCheck() {
  const btn = document.getElementById('checkBtn');
  const status = document.getElementById('checkStatus');
  const time = document.getElementById('checkTime');
  const now = new Date();
  const t = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  checkedIn = !checkedIn;
  if (checkedIn) {
    status.textContent = 'Aap check-in hain';
    time.textContent = t;
    btn.className = 'checkin-btn out';
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#C1503F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg> Check-out karein';
  } else {
    status.textContent = 'Aaj ka kaam poora hua';
    time.textContent = t;
    btn.className = 'checkin-btn in';
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg> Check-in karein';
  }
}

// ---------------------------------------------------------------
// Leave application — partner apply kar sakta hai, request "Pending"
// status ke saath list mein turant dikh jaati hai
// ---------------------------------------------------------------
const leaveModalOverlay = document.getElementById('leaveModalOverlay');
const openLeaveModalBtn = document.getElementById('openLeaveModalBtn');
const closeLeaveModalBtn = document.getElementById('closeLeaveModalBtn');
const leaveForm = document.getElementById('leaveForm');
const leaveList = document.getElementById('leaveList');
const leaveEmpty = document.getElementById('leaveEmpty');

function openLeaveModal() {
  leaveModalOverlay.classList.add('open');
}
function closeLeaveModal() {
  leaveModalOverlay.classList.remove('open');
}

if (openLeaveModalBtn) openLeaveModalBtn.addEventListener('click', openLeaveModal);
if (closeLeaveModalBtn) closeLeaveModalBtn.addEventListener('click', closeLeaveModal);
if (leaveModalOverlay) {
  leaveModalOverlay.addEventListener('click', (e) => {
    if (e.target === leaveModalOverlay) closeLeaveModal();
  });
}

function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function updateLeaveEmptyState() {
  const hasItems = leaveList.children.length > 0;
  leaveEmpty.classList.toggle('hide', hasItems);
}

function addLeaveRequestToList(type, fromDate, toDate, reason) {
  const item = document.createElement('div');
  item.className = 'leave-item';
  const fromShort = formatDateShort(fromDate);
  const toShort = formatDateShort(toDate);
  const dateRange = fromDate === toDate ? fromShort : (fromShort + ' – ' + toShort);
  item.innerHTML = `
    <div class="leave-item-text">
      <div class="leave-item-type">${type}</div>
      <div class="leave-item-dates">${dateRange} · ${reason}</div>
    </div>
    <span class="leave-status">Pending</span>
  `;
  leaveList.prepend(item);
  updateLeaveEmptyState();
}

if (leaveForm) {
  leaveForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const type = document.getElementById('leaveType').value;
    const fromDate = document.getElementById('leaveFrom').value;
    const toDate = document.getElementById('leaveTo').value;
    const reason = document.getElementById('leaveReason').value.trim();

    if (!fromDate || !toDate || !reason) return;

    addLeaveRequestToList(type, fromDate, toDate, reason);
    leaveForm.reset();
    closeLeaveModal();
  });
}

updateLeaveEmptyState();