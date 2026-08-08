// Live date
const days = ['Ravivaar','Somvaar','Mangalvaar','Budhvaar','Guruvaar','Shukravaar','Shanivaar'];
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const today = new Date();
document.getElementById('todayDate').textContent = `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`;

// Job checklist + progress ring
const jobs = document.querySelectorAll('[data-job]');
const ringFull = 100.5; // circumference for r=16
const avatarRingFull = 163.4; // circumference for r=26
const jobRing = document.getElementById('jobRing');
const avatarRing = document.getElementById('ringProgress');

function updateProgress(){
  const total = jobs.length;
  const done = document.querySelectorAll('[data-job].done').length;
  const pct = done / total;
  jobRing.style.strokeDashoffset = ringFull - (ringFull * pct);
  avatarRing.style.strokeDashoffset = avatarRingFull - (avatarRingFull * pct);
}

jobs.forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('done');
    updateProgress();
  });
});

// Demo: mark first job done on load
jobs[0].classList.add('done');
updateProgress();

// Logout
function logout(){
  if(confirm('Kya aap logout karna chahte hain?')){
    window.location.href = 'login.html';
  }
}

// Avg daily work / Avg hours / Avg payout — Day / Week / Month filter
// Replace these demo numbers with live values from the partner's actual data.
const avgData = {
  day:   { work: '3.0 job',     hours: '4.5 ghante',     payout: '₹1,333' },
  week:  { work: '2.6 job/din', hours: '4.1 ghante/din', payout: '₹1,190' },
  month: { work: '2.7 job/din', hours: '4.2 ghante/din', payout: '₹1,282' }
};

const avgTabs = document.getElementById('avgTabs');
const avgWorkValue = document.getElementById('avgWorkValue');
const avgHoursValue = document.getElementById('avgHoursValue');
const avgPayoutValue = document.getElementById('avgPayoutValue');

if(avgTabs){
  avgTabs.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      avgTabs.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const range = tab.dataset.range;
      const data = avgData[range];
      if(data){
        avgWorkValue.textContent = data.work;
        if(avgHoursValue) avgHoursValue.textContent = data.hours;
        avgPayoutValue.textContent = data.payout;
      }
    });
  });
}