// ---- Demo booking data (from admin's wireframe) ----
const bookings = {
  today: [
    {
      service:"Home Cleaning", date:"23 Jul",
      client:"Karan", phone:"98xxxxxxxx",
      address:"Sector 22, Chandigarh",
      partner:"Vikash", time:"5:00 PM - 6:00 PM",
      amount:"₹1,800"
    },
    {
      service:"Kitchen Cleaning", date:"23 Jul",
      client:"Neha", phone:"98xxxxxxxx",
      address:"Sector 40, Chandigarh",
      partner:"Ravi", time:"3:00 PM - 4:00 PM",
      amount:"₹1,415"
    }
  ],
  running: [
    {
      service:"Bathroom Cleaning", date:"23 Jul",
      client:"Simran", phone:"918xxxxxxx",
      address:"Ratna Apartment, Zirakpur",
      partner:"Ramesh", time:"11:00 AM - 12:00 PM",
      amount:"—"
    },
    {
      service:"Home Cleaning", date:"23 Jul",
      client:"Rohit Verma", phone:"91xxxxxxxx",
      address:"Sector 68, Kothi No. 92",
      partner:"Amit", time:"2:00 PM - 4:00 PM",
      amount:"—"
    }
  ],
  all: [
    {
      service:"Home Cleaning", date:"19 Jul",
      client:"Neha Sharma", phone:"91xxxxxxxx",
      address:"—",
      partner:"Amit", time:"2:00 PM - 3:00 PM",
      amount:"—"
    },
    {
      service:"Kitchen Cleaning", date:"16 Jul",
      client:"Mohit Kumar", phone:"91xxxxxxxx",
      address:"—",
      partner:"Vedpal", time:"4:00 PM - 5:00 PM",
      amount:"—"
    },
    {
      service:"Home Cleaning", date:"23 Jul",
      client:"Karan", phone:"98xxxxxxxx",
      address:"Sector 22, Chandigarh",
      partner:"Vikash", time:"5:00 PM - 6:00 PM",
      amount:"₹1,800"
    },
    {
      service:"Kitchen Cleaning", date:"23 Jul",
      client:"Neha", phone:"98xxxxxxxx",
      address:"Sector 40, Chandigarh",
      partner:"Ravi", time:"3:00 PM - 4:00 PM",
      amount:"₹1,415"
    }
  ]
};

const tabLabels = { today:"Todays Bookings", running:"Running Bookings", all:"All Bookings" };

let currentTab = "today";

function renderBookings(){
  const list = document.getElementById('bookingList');
  const items = bookings[currentTab] || [];

  if(items.length === 0){
    list.innerHTML = '<div class="empty-state">Koi booking nahi mili</div>';
    return;
  }

  list.innerHTML = items.map((b, i) => `
    <div class="booking-card">
      <div class="bk-top">
        <div class="bk-service">${b.service}</div>
        <div class="bk-date">${b.date}</div>
      </div>
      <div class="bk-row"><span class="bk-key">Client:</span> ${b.client} · ${b.phone}</div>
      <div class="bk-row"><span class="bk-key">Address:</span> ${b.address}</div>
      <div class="bk-row"><span class="bk-key">Partner:</span> ${b.partner} · ${b.time}</div>
      <div class="bk-bottom">
        <div class="bk-amount ${b.amount === '—' ? 'empty' : ''}">${b.amount === '—' ? 'Amount pending' : b.amount}</div>
        <button class="view-btn" type="button" onclick="openModal('${currentTab}', ${i})">View Details</button>
      </div>
    </div>
  `).join('');
}

function setTab(tab){
  currentTab = tab;
  document.querySelectorAll('.chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.tab === tab);
  });
  renderBookings();
}

// ---- Details modal ----
function openModal(tab, index){
  const b = bookings[tab][index];
  if(!b) return;

  document.getElementById('modalService').textContent = b.service;
  document.getElementById('modalDateTime').textContent = `${b.date} · ${b.time}`;

  document.getElementById('modalRows').innerHTML = `
    <div class="modal-row"><div class="mr-label">Client</div><div class="mr-value">${b.client}</div></div>
    <div class="modal-row"><div class="mr-label">Phone</div><div class="mr-value">${b.phone}</div></div>
    <div class="modal-row"><div class="mr-label">Address</div><div class="mr-value">${b.address}</div></div>
    <div class="modal-row"><div class="mr-label">Partner</div><div class="mr-value">${b.partner}</div></div>
    <div class="modal-row"><div class="mr-label">Time</div><div class="mr-value">${b.time}</div></div>
    <div class="modal-row"><div class="mr-label">Amount</div><div class="mr-value">${b.amount === '—' ? 'Pending' : b.amount}</div></div>
  `;

  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal(){
  document.getElementById('modalOverlay').classList.remove('open');
}

function closeModalOnBackdrop(e){
  if(e.target.id === 'modalOverlay') closeModal();
}

// ===================== Team & Requests: 4-tab system =====================
// Tabs: Managers · Partners · Partner Requests · Manager Requests

const teamData = {
  managers: [
    { name:"Avnil", sub:"Zirakpur team · Active" },
    { name:"Vikash", sub:"Mohali team · Active" }
  ],
  partners: [
    { name:"Amit", sub:"Mohali · 4.8★ rating" },
    { name:"Mohit", sub:"Ludhiana · 4.6★ rating" }
  ],
  partnerRequests: [
    { name:"Rohan", sub:"Payment request · ₹1,800", status:"pending", isRequest:true },
    { name:"Sohan", sub:"Payment request · ₹1,415", status:"pending", isRequest:true }
  ],
  managerRequests: [
    { name:"Neha", sub:"Leave request · 2 din", status:"pending", isRequest:true },
    { name:"Kusha", sub:"Expense request · ₹450", status:"pending", isRequest:true }
  ]
};

const teamTabLabels = {
  managers:"Admins", partners:"Partners",
  partnerRequests:"Partner Requests", managerRequests:"Admin Requests"
};

let currentTeamTab = "managers";

function statusLabel(status){
  if(status === 'approved') return 'Approved ✓';
  if(status === 'rejected') return 'Rejected ✕';
  return 'Pending';
}

function renderTeamList(){
  const list = document.getElementById('teamList');
  const items = teamData[currentTeamTab] || [];

  if(items.length === 0){
    list.innerHTML = '<div class="empty-requests">Koi entry nahi hai</div>';
    return;
  }

  list.innerHTML = items.map((item, i) => `
    <div class="team-card">
      <div class="team-text">
        <div class="team-name">${item.name}</div>
        <div class="team-sub">${item.sub}</div>
      </div>
      <div class="team-right">
        ${item.isRequest ? `<span class="req-status ${item.status}">${statusLabel(item.status)}</span>` : ''}
        <button class="view-btn" type="button" onclick="openTeamModal('${currentTeamTab}', ${i})">View</button>
      </div>
    </div>
  `).join('');
}

function setTeamTab(tab){
  currentTeamTab = tab;
  document.querySelectorAll('#teamChipRow .chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.teamTab === tab);
  });
  renderTeamList();
}

function openTeamModal(tab, index){
  const item = teamData[tab][index];
  if(!item) return;

  document.getElementById('teamModalName').textContent = item.name;
  document.getElementById('teamModalSub').textContent = `${teamTabLabels[tab]} · ${item.sub}`;

  document.getElementById('teamModalRows').innerHTML = `
    <div class="modal-row"><div class="mr-label">Category</div><div class="mr-value">${teamTabLabels[tab]}</div></div>
    <div class="modal-row"><div class="mr-label">Detail</div><div class="mr-value">${item.sub}</div></div>
    ${item.isRequest ? `<div class="modal-row"><div class="mr-label">Status</div><div class="mr-value">${statusLabel(item.status)}</div></div>` : ''}
  `;

  const actions = document.getElementById('teamModalActions');
  if(item.isRequest && item.status === 'pending'){
    actions.style.display = 'flex';
    document.getElementById('teamModalApproveBtn').onclick = () => decideTeamRequest(tab, index, 'approved');
    document.getElementById('teamModalRejectBtn').onclick = () => decideTeamRequest(tab, index, 'rejected');
  } else {
    actions.style.display = 'none';
  }

  document.getElementById('teamModalOverlay').classList.add('open');
}

function closeTeamModal(){
  document.getElementById('teamModalOverlay').classList.remove('open');
}

function closeTeamModalOnBackdrop(e){
  if(e.target.id === 'teamModalOverlay') closeTeamModal();
}

function countPendingRequests(){
  const partnerPending = teamData.partnerRequests.filter(r => r.status === 'pending').length;
  const adminPending = teamData.managerRequests.filter(r => r.status === 'pending').length;
  return partnerPending + adminPending;
}

function updatePendingRequestValue(){
  const el = document.getElementById('pendingRequestValue');
  if(el) el.textContent = countPendingRequests();
}

function decideTeamRequest(tab, index, decision){
  if(!teamData[tab][index] || teamData[tab][index].status !== 'pending') return;
  teamData[tab][index].status = decision;
  renderTeamList();
  closeTeamModal();
  updatePendingRequestValue();
}

renderBookings();
renderTeamList();
updatePendingRequestValue();