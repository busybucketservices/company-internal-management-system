// ---- Demo data: director's own attendance, July 2026 ----
const firstDayOffset = 3; // July 1 2026 = Wednesday
const daysInMonth = 31;
const today = 12;

const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// Full detail for every day that has happened so far (2 to 12; 1 = leave)
const dayData = {
  1:  { status:"leave",  checkin:"--",      checkout:"--",      hours:"--",        location:"--" },
  2:  { status:"ontime", checkin:"8:50 AM", checkout:"5:12 PM", hours:"8h 22m",   location:"Sector 68, Mohali" },
  3:  { status:"ontime", checkin:"8:44 AM", checkout:"5:05 PM", hours:"8h 21m",   location:"Sector 68, Mohali" },
  4:  { status:"ontime", checkin:"8:58 AM", checkout:"4:58 PM", hours:"8h 00m",   location:"Sector 68, Mohali" },
  5:  { status:"absent", checkin:"--",      checkout:"--",      hours:"--",        location:"--" },
  6:  { status:"ontime", checkin:"8:41 AM", checkout:"5:15 PM", hours:"8h 34m",   location:"Sector 68, Mohali" },
  7:  { status:"late",   checkin:"9:20 AM", checkout:"5:10 PM", hours:"7h 50m",   location:"Sector 68, Mohali" },
  8:  { status:"ontime", checkin:"8:52 AM", checkout:"5:08 PM", hours:"8h 16m",   location:"Sector 68, Mohali" },
  9:  { status:"ontime", checkin:"8:46 AM", checkout:"5:02 PM", hours:"8h 16m",   location:"Sector 68, Mohali" },
  10: { status:"ontime", checkin:"8:47 AM", checkout:"5:15 PM", hours:"8h 28m",   location:"Sector 68, Mohali" },
  11: { status:"late",   checkin:"9:24 AM", checkout:"5:05 PM", hours:"7h 41m",   location:"Sector 68, Mohali" },
  12: { status:"ontime", checkin:"8:52 AM", checkout:"5:10 PM", hours:"8h 18m",   location:"Sector 68, Mohali" },
};

const badgeLabel = { ontime:"On time", late:"Late", absent:"Absent", leave:"Leave" };

// ---- Calendar ----
const calGrid = document.getElementById('calGrid');
const dows = ['Su','Mo','Tu','We','Th','Fr','Sa'];
dows.forEach(d => {
  const el = document.createElement('div');
  el.className = 'cal-dow'; el.textContent = d;
  calGrid.appendChild(el);
});

for(let i=0; i<firstDayOffset; i++){
  const el = document.createElement('div');
  el.className = 'cal-day empty';
  calGrid.appendChild(el);
}
for(let d=1; d<=daysInMonth; d++){
  const el = document.createElement('div');
  el.className = 'cal-day';
  el.textContent = d;
  const data = dayData[d];
  if(data){
    el.classList.add(data.status === 'ontime' || data.status === 'late' ? 'present' : data.status);
    el.classList.add('clickable');
    el.onclick = () => openModal(d);
  }
  if(d === today) el.classList.add('today');
  calGrid.appendChild(el);
}

// ---- Total hours worked this month ----
function minutesFromHours(str){
  const m = str.match(/(\d+)h\s*(\d+)m/);
  if(!m) return 0;
  return parseInt(m[1])*60 + parseInt(m[2]);
}
const totalMinutesWorked = Object.values(dayData).reduce((sum, d) => sum + minutesFromHours(d.hours || ""), 0);
function formatHoursMinutes(totalMin){
  const h = Math.floor(totalMin/60), m = totalMin % 60;
  return `${h}h ${m}m`;
}
const totalHoursEl = document.getElementById('totalHours');
if(totalHoursEl) totalHoursEl.textContent = formatHoursMinutes(totalMinutesWorked) + ' kaam kiya';

// ---- Recent log (last 3 days, most recent first) ----
const monthShort = "Jul";
const logCard = document.getElementById('logCard');
const recentDays = [12, 11, 10];
logCard.innerHTML = recentDays.map(d => {
  const data = dayData[d];
  const mainLine = data.status === 'absent' ? 'Absent' : data.status === 'leave' ? 'Leave' : `Check-in ${data.checkin}`;
  const subLine = data.status === 'absent' || data.status === 'leave' ? '' : `Check-out ${data.checkout} · ${data.hours}`;
  return `
    <div class="log-item">
      <div class="log-date"><div class="dnum">${d}</div><div class="dmon">${monthShort}</div></div>
      <div class="log-text"><div class="l-main">${mainLine}</div><div class="l-sub">${subLine}</div></div>
      <div class="w-badge ${data.status === 'ontime' || data.status === 'late' ? data.status : data.status}">${badgeLabel[data.status]}</div>
      <button class="view-btn" type="button" onclick="openModal(${d})">Details</button>
    </div>`;
}).join('');

// ---- Day detail modal ----
function openModal(day){
  const data = dayData[day];
  if(!data) return;
  const dow = new Date(2026, 6, day).getDay(); // month index 6 = July
  document.getElementById('modalDate').textContent = `${day} Jul`;
  document.getElementById('modalDay').textContent = dayNames[dow];

  const badgeEl = document.getElementById('modalBadge');
  badgeEl.className = `w-badge ${data.status}`;
  badgeEl.textContent = badgeLabel[data.status];

  const rowsEl = document.getElementById('modalRows');
  if(data.status === 'absent' || data.status === 'leave'){
    rowsEl.innerHTML = `
      <div class="modal-row"><div class="mr-label">Status</div><div class="mr-value">${badgeLabel[data.status]}</div></div>
      <div class="modal-row"><div class="mr-label">Check-in</div><div class="mr-value">--</div></div>
      <div class="modal-row"><div class="mr-label">Check-out</div><div class="mr-value">--</div></div>
    `;
  } else {
    rowsEl.innerHTML = `
      <div class="modal-row"><div class="mr-label">Check-in</div><div class="mr-value">${data.checkin}</div></div>
      <div class="modal-row"><div class="mr-label">Check-out</div><div class="mr-value">${data.checkout}</div></div>
      <div class="modal-row"><div class="mr-label">Total ghante</div><div class="mr-value">${data.hours}</div></div>
      <div class="modal-row"><div class="mr-label">Location</div><div class="mr-value">${data.location}</div></div>
    `;
  }

  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal(){
  document.getElementById('modalOverlay').classList.remove('open');
}

function closeModalOnBackdrop(e){
  if(e.target.id === 'modalOverlay') closeModal();
}

// ---- Check-in / check-out toggle ----
let checkedIn = false;
function toggleCheck(){
  const btn = document.getElementById('checkBtn');
  const status = document.getElementById('checkStatus');
  const time = document.getElementById('checkTime');
  const now = new Date();
  const t = now.toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'});
  checkedIn = !checkedIn;
  if(checkedIn){
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