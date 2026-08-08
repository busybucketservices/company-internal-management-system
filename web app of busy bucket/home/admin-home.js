
let panelCounter = 4;
const panels = [
  { id:1, name:'Director Panel', desc:'Sabse upar ka access — poori company visibility', status:'active', protected:true },
  { id:2, name:'Manager Panel', desc:'Area/team level operations manage karta hai', status:'active', protected:true },
  { id:3, name:'Admin Panel', desc:'Partner approvals, requests, day-to-day ops', status:'active', protected:true }
];
const permissions = { manager:false, admin:false }; // Director decides who can create/delete panels
let currentRole = 'director';

function switchRole(role){
  currentRole = role;
  document.querySelectorAll('.role-btn').forEach(b => b.classList.toggle('active', b.dataset.role === role));
  renderAll();
}

function canManage(){
  if (currentRole === 'director') return true;
  return !!permissions[currentRole];
}

function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

function switchTab(name){
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  document.getElementById('tab-active').classList.toggle('active', name === 'active');
  document.getElementById('tab-recover').classList.toggle('active', name === 'recover');
}

function toggleAddForm(){
  const form = document.getElementById('addForm');
  form.classList.toggle('show');
  document.getElementById('addFormErr').classList.remove('show');
  if (form.classList.contains('show')){
    document.getElementById('newPanelName').value = '';
    document.getElementById('newPanelDesc').value = '';
  }
}

function addPanel(){
  if (!canManage()) return;
  const errEl = document.getElementById('addFormErr');
  const name = document.getElementById('newPanelName').value.trim();
  const desc = document.getElementById('newPanelDesc').value.trim();
  if (!name){
    errEl.textContent = 'Panel ka naam bharna zaroori hai.';
    errEl.classList.add('show');
    return;
  }
  panels.push({ id: panelCounter++, name, desc: desc || 'Custom panel', status:'active' });
  toggleAddForm();
  renderAll();
  showToast('Naya panel add ho gaya');
}

function deletePanel(id){
  const p = panels.find(x => x.id === id);
  if (!p || p.protected || !canManage()) return;
  p.status = 'deleted';
  renderAll();
  showToast(`${p.name} delete ho gaya — Recover tab se wapas la sakte hain`);
}

function togglePermission(role){
  permissions[role] = !permissions[role];
  renderAll();
  showToast(`${role === 'manager' ? 'Manager' : 'Admin'} ke liye create/delete permission ${permissions[role] ? 'ON' : 'OFF'} ho gayi`);
}

function recoverPanel(id){
  if (!canManage()) return;
  const p = panels.find(x => x.id === id);
  if (!p) return;
  p.status = 'active';
  renderAll();
  showToast(`${p.name} recover ho gaya`);
}

function renderAll(){
  const activeList = document.getElementById('activeList');
  const recoverList = document.getElementById('recoverList');
  const activePanels = panels.filter(p => p.status === 'active');
  const deletedPanels = panels.filter(p => p.status === 'deleted');
  const allowed = canManage();

  document.getElementById('permCard').style.display = currentRole === 'director' ? 'block' : 'none';
  document.getElementById('lockedNote').style.display = (currentRole !== 'director' && !allowed) ? 'block' : 'none';
  document.getElementById('addPanelBtn').style.display = allowed ? 'flex' : 'none';

  activeList.innerHTML = activePanels.length === 0
    ? '<div class="empty-state"><div class="e-icon">📂</div>Koi active panel nahi hai.</div>'
    : activePanels.map(p => `
        <div class="panel-card">
          <div class="panel-icon">🗂️</div>
          <div class="panel-info">
            <div class="panel-name">${p.name}</div>
            <div class="panel-desc">${p.desc}</div>
          </div>
          <div class="panel-actions">
            ${(!p.protected && allowed) ? `
            <button class="icon-action delete" title="Delete" onclick="deletePanel(${p.id})">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m2 0v13a2 2 0 01-2 2H9a2 2 0 01-2-2V7h10z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>` : ''}
          </div>
        </div>
      `).join('');

  recoverList.innerHTML = deletedPanels.length === 0
    ? '<div class="empty-state"><div class="e-icon">🗑️</div>Koi deleted panel nahi hai.</div>'
    : deletedPanels.map(p => `
        <div class="panel-card deleted">
          <div class="panel-icon">🗂️</div>
          <div class="panel-info">
            <div class="panel-name">${p.name}</div>
            <div class="panel-desc">${p.desc}</div>
            <div class="deleted-tag">Deleted</div>
          </div>
          <div class="panel-actions">
            ${allowed ? `
            <button class="icon-action recover" title="Recover" onclick="recoverPanel(${p.id})">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>` : ''}
          </div>
        </div>
      `).join('');

  document.getElementById('countActive').textContent = activePanels.length;
  const delCount = document.getElementById('countDeleted');
  delCount.textContent = deletedPanels.length;
  delCount.classList.toggle('zero', deletedPanels.length === 0);
}

renderAll();
