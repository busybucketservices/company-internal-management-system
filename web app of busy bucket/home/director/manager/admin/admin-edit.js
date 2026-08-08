// ---- Add Service ----
  const svcList = document.getElementById('svcList');
  const newSvcInput = document.getElementById('newSvcInput');
  document.getElementById('addSvcBtn').addEventListener('click', addService);
  newSvcInput.addEventListener('keydown', e => { if(e.key === 'Enter'){ e.preventDefault(); addService(); } });

  function addService(){
    const name = newSvcInput.value.trim();
    if(!name) { newSvcInput.focus(); return; }
    const label = document.createElement('label');
    label.className = 'svc custom';
    label.innerHTML = `
      <input type="checkbox" checked>
      <span class="box"></span>
      <span class="label"></span>
      <span class="eq-badge" data-badge></span>
      <button type="button" class="remove-x" title="Remove">&times;</button>
    `;
    label.querySelector('.label').textContent = name;
    label.querySelector('.remove-x').addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      label.remove();
    });
    svcList.appendChild(label);
    wireServiceCheckbox(label);
    newSvcInput.value = '';
    newSvcInput.focus();
    // Newly added service starts checked -> ask machinery question right away
    openEquipmentModal(label, name);
  }

  // ---- Machinery / equipment check modal ----
  const eqModalOverlay = document.getElementById('eqModalOverlay');
  const eqModalService = document.getElementById('eqModalService');
  const eqYesBtn = document.getElementById('eqYesBtn');
  const eqNoBtn = document.getElementById('eqNoBtn');
  const eqYesPanel = document.getElementById('eqYesPanel');
  const eqNoPanel = document.getElementById('eqNoPanel');
  const eqUploadBox = document.getElementById('eqUploadBox');
  const eqUploadText = document.getElementById('eqUploadText');
  const eqPhotoInput = document.getElementById('eqPhotoInput');
  const eqSaveYesBtn = document.getElementById('eqSaveYesBtn');
  const eqRequestBtn = document.getElementById('eqRequestBtn');
  const eqModalClose = document.getElementById('eqModalClose');

  let currentEqLabel = null;
  let currentEqChoice = null;
  let currentEqPhotoName = '';

  function wireServiceCheckbox(label){
    const checkbox = label.querySelector('input[type="checkbox"]');
    const name = () => label.querySelector('.label').textContent;
    checkbox.addEventListener('change', () => {
      if(checkbox.checked){
        openEquipmentModal(label, name());
      } else {
        setBadge(label, null);
      }
    });
  }

  // Wire the pre-existing checked services on load
  svcList.querySelectorAll('.svc').forEach(label => wireServiceCheckbox(label));

  function openEquipmentModal(label, serviceName){
    currentEqLabel = label;
    currentEqChoice = null;
    currentEqPhotoName = '';
    eqModalService.textContent = serviceName;
    eqYesBtn.classList.remove('selected');
    eqNoBtn.classList.remove('selected');
    eqYesPanel.classList.remove('show');
    eqNoPanel.classList.remove('show');
    eqUploadText.textContent = 'Machinery ki photo upload karein';
    eqPhotoInput.value = '';
    eqModalOverlay.classList.add('open');
  }

  function closeEquipmentModal(){
    eqModalOverlay.classList.remove('open');
    currentEqLabel = null;
  }

  eqModalClose.addEventListener('click', closeEquipmentModal);
  eqModalOverlay.addEventListener('click', (e) => {
    if(e.target === eqModalOverlay) closeEquipmentModal();
  });

  eqYesBtn.addEventListener('click', () => {
    currentEqChoice = 'yes';
    eqYesBtn.classList.add('selected');
    eqNoBtn.classList.remove('selected');
    eqYesPanel.classList.add('show');
    eqNoPanel.classList.remove('show');
  });

  eqNoBtn.addEventListener('click', () => {
    currentEqChoice = 'no';
    eqNoBtn.classList.add('selected');
    eqYesBtn.classList.remove('selected');
    eqNoPanel.classList.add('show');
    eqYesPanel.classList.remove('show');
  });

  eqUploadBox.addEventListener('click', () => eqPhotoInput.click());
  eqPhotoInput.addEventListener('change', () => {
    if(eqPhotoInput.files.length){
      currentEqPhotoName = eqPhotoInput.files[0].name;
      eqUploadText.textContent = 'Selected: ' + currentEqPhotoName;
    }
  });

  eqSaveYesBtn.addEventListener('click', () => {
    if(!currentEqPhotoName){ eqUploadBox.click(); return; }
    if(currentEqLabel) setBadge(currentEqLabel, 'verified');
    closeEquipmentModal();
  });

  eqRequestBtn.addEventListener('click', () => {
    if(currentEqLabel) setBadge(currentEqLabel, 'requested');
    closeEquipmentModal();
  });

  function setBadge(label, state){
    const badge = label.querySelector('[data-badge]');
    if(!badge) return;
    badge.classList.remove('show', 'verified', 'requested');
    if(state === 'verified'){
      badge.textContent = '✓ Equipment Verified';
      badge.classList.add('show', 'verified');
    } else if(state === 'requested'){
      badge.textContent = '🛒 Buy Requested';
      badge.classList.add('show', 'requested');
    } else {
      badge.textContent = '';
    }
  }

  // ---- Phone Number (locks permanently once verified via OTP) ----
  const fullNameInput = document.getElementById('fullNameInput');
  const nameLockedNote = document.getElementById('nameLockedNote');
  const phoneNumberInput = document.getElementById('phoneNumberInput');
  const sendOtpBtn = document.getElementById('sendOtpBtn');
  const phoneOtpStatus = document.getElementById('phoneOtpStatus');
  const phoneLockedNote = document.getElementById('phoneLockedNote');

  sendOtpBtn.addEventListener('click', () => {
    const val = phoneNumberInput.value.trim();
    if(!val){ phoneNumberInput.focus(); return; }
    // Simulate OTP verification, then lock the number for good — no further edits.
    phoneNumberInput.readOnly = true;
    sendOtpBtn.disabled = true;
    sendOtpBtn.style.display = 'none';
    phoneOtpStatus.style.display = 'flex';
    phoneLockedNote.style.display = 'flex';
    // Name is confirmed at the same time as the verified number, so lock it too.
    fullNameInput.readOnly = true;
    nameLockedNote.style.display = 'flex';
  });

  // ---- Login ID (locked — no regenerate, never editable) & Password ----
  const passwordInput = document.getElementById('passwordInput');
  const togglePwdBtn = document.getElementById('togglePwdBtn');
  const genPwdBtn = document.getElementById('genPwdBtn');
  const copyPwdBtn = document.getElementById('copyPwdBtn');

  togglePwdBtn.addEventListener('click', () => {
    const isPwd = passwordInput.type === 'password';
    passwordInput.type = isPwd ? 'text' : 'password';
    togglePwdBtn.textContent = isPwd ? 'Hide' : 'Show';
  });

  // "Change Password" — lets admin type in whatever custom password they
  // want for the partner (no auto-generation). Click again to save & lock it.
  genPwdBtn.addEventListener('click', () => {
    const isEditing = passwordInput.readOnly === false;
    if(!isEditing){
      // Enter edit mode: clear field, unlock it, let admin type their own password
      passwordInput.readOnly = false;
      passwordInput.value = '';
      passwordInput.type = 'text';
      passwordInput.placeholder = 'Naya password type karein';
      passwordInput.focus();
      togglePwdBtn.textContent = 'Hide';
      genPwdBtn.textContent = 'Save Password';
    } else {
      // Save & lock again
      if(!passwordInput.value.trim()){ passwordInput.focus(); return; }
      passwordInput.readOnly = true;
      genPwdBtn.textContent = 'Change Password';
    }
  });

  copyPwdBtn.addEventListener('click', () => {
    passwordInput.select();
    passwordInput.setSelectionRange(0, 99999);
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(passwordInput.value).catch(()=>{});
    }
    const original = copyPwdBtn.textContent;
    copyPwdBtn.textContent = 'Copied!';
    setTimeout(() => { copyPwdBtn.textContent = original; }, 1200);
  });

  // ---- Alternate Numbers ----
  // Admin can add as many alternate numbers as needed. Once a number is
  // added it is shown as a locked row — it can never be edited or replaced,
  // only the "+ Add" flow can add further new numbers.
  const altNumList = document.getElementById('altNumList');
  const altNumberInput = document.getElementById('altNumberInput');
  const addAltNumBtn = document.getElementById('addAltNumBtn');

  addAltNumBtn.addEventListener('click', addAlternateNumber);
  altNumberInput.addEventListener('keydown', e => { if(e.key === 'Enter'){ e.preventDefault(); addAlternateNumber(); } });

  function addAlternateNumber(){
    const val = altNumberInput.value.trim();
    if(!val){ altNumberInput.focus(); return; }
    const row = document.createElement('div');
    row.className = 'alt-num-row';
    row.innerHTML = `<span class="num"></span>`;
    row.querySelector('.num').textContent = val;
    altNumList.appendChild(row);
    altNumberInput.value = '';
    altNumberInput.focus();
  }

  // ---- Add Document ----
  const docGrid = document.getElementById('docGrid');
  const newDocInput = document.getElementById('newDocInput');
  const docFileInput = document.getElementById('docFileInput');
  let pendingCardForUpload = null;

  document.getElementById('addDocBtn').addEventListener('click', addDocument);
  newDocInput.addEventListener('keydown', e => { if(e.key === 'Enter'){ e.preventDefault(); addDocument(); } });

  function addDocument(){
    const name = newDocInput.value.trim();
    if(!name) { newDocInput.focus(); return; }
    const card = buildDocCard(name);
    docGrid.appendChild(card);
    newDocInput.value = '';
    newDocInput.focus();
  }

  function buildDocCard(name, uploaded){
    const card = document.createElement('div');
    card.className = 'doc-card' + (uploaded ? ' uploaded' : '');
    const initials = name.trim().split(/\s+/).slice(0,2).map(w => w[0]).join('').toUpperCase().slice(0,3) || 'DOC';
    card.innerHTML = `
      <div class="doc-icon">${initials}</div>
      <div class="doc-meta">
        <div class="name"></div>
        <div class="state">${uploaded ? '1 file uploaded' : 'No file uploaded yet'}</div>
      </div>
      <div class="doc-actions">
        <button type="button" class="upload-btn">Upload</button>
        <button type="button" class="view-btn">View</button>
        <button type="button" class="doc-remove" title="Remove">&times;</button>
      </div>
    `;
    card.querySelector('.name').textContent = name;
    wireDocCard(card);
    return card;
  }

  function wireDocCard(card){
    card.querySelector('.upload-btn').addEventListener('click', () => {
      // Once uploaded there is no "Replace" anymore — the Upload button
      // itself is hidden for uploaded cards, so this only ever fires
      // for docs that don't have a file yet.
      if(card.classList.contains('uploaded')) return;
      pendingCardForUpload = card;
      docFileInput.value = '';
      docFileInput.click();
    });
    card.querySelector('.doc-remove').addEventListener('click', () => {
      // Guard: once a document is uploaded it can never be removed —
      // the button is hidden via CSS, but this blocks it even if triggered another way.
      if(card.classList.contains('uploaded')) return;
      card.remove();
    });
    card.querySelector('.view-btn').addEventListener('click', () => {
      openDocLightbox(card);
    });
  }

  docGrid.querySelectorAll('.doc-card').forEach(wireDocCard);

  docFileInput.addEventListener('change', () => {
    if(!pendingCardForUpload || !docFileInput.files.length) return;
    const file = docFileInput.files[0];
    const isImage = file.type.startsWith('image/');
    const previewUrl = URL.createObjectURL(file);

    pendingCardForUpload.classList.add('uploaded');
    pendingCardForUpload.dataset.previewUrl = previewUrl;
    pendingCardForUpload.dataset.previewIsImage = isImage ? '1' : '0';
    pendingCardForUpload.dataset.fileName = file.name;

    if(isImage){
      pendingCardForUpload.classList.add('has-preview');
      const iconEl = pendingCardForUpload.querySelector('.doc-icon');
      iconEl.innerHTML = `<img src="${previewUrl}" alt="">`;
    } else {
      // Non-image (e.g. PDF) — still viewable, just no thumbnail in the row icon.
      pendingCardForUpload.classList.add('has-preview');
    }

    pendingCardForUpload.querySelector('.state').textContent = '1 file uploaded — ' + file.name;
    pendingCardForUpload = null;
  });

  // ---- Uploaded document viewer (lightbox) ----
  const docLightbox = document.getElementById('docLightbox');
  const lightboxDocName = document.getElementById('lightboxDocName');
  const lightboxBody = document.getElementById('lightboxBody');
  const lightboxClose = document.getElementById('lightboxClose');

  function openDocLightbox(card){
    const name = card.querySelector('.name').textContent;
    const previewUrl = card.dataset.previewUrl;
    const isImage = card.dataset.previewIsImage === '1';
    lightboxDocName.textContent = name;

    if(previewUrl && isImage){
      lightboxBody.innerHTML = `<img src="${previewUrl}" alt="${name}">`;
    } else if(previewUrl){
      // Non-image file (e.g. PDF) — open it directly since it can't be shown inline.
      window.open(previewUrl, '_blank');
      return;
    } else {
      lightboxBody.innerHTML = `<div class="no-preview">Is document ke liye preview available nahi hai is demo mein — dobara upload karne par yahan photo dikhegi.</div>`;
    }
    docLightbox.classList.add('open');
  }

  function closeDocLightbox(){
    docLightbox.classList.remove('open');
    lightboxBody.innerHTML = '';
  }

  lightboxClose.addEventListener('click', closeDocLightbox);
  docLightbox.addEventListener('click', (e) => {
    if(e.target === docLightbox) closeDocLightbox();
  });

  // ---- Permission radios (single-select per row) ----
  document.querySelectorAll('.perm-table tr').forEach(row => {
    const radios = row.querySelectorAll('.radio');
    radios.forEach(r => r.addEventListener('click', () => {
      radios.forEach(x => x.classList.remove('on'));
      r.classList.add('on');
    }));
  });

  // ---- Account status pill toggle (tap the row to flip demo state) ----
  const statusRow = document.querySelector('.status-row');
  statusRow.addEventListener('click', () => {
    const isActive = !statusRow.classList.contains('inactive');
    statusRow.classList.toggle('inactive');
    statusRow.querySelector('.t').textContent = isActive ? 'Profile is Inactive' : 'Profile is Active';
    statusRow.querySelector('.d').textContent = isActive ? 'Partner will not receive job assignments' : 'Partner can receive job assignments';
    const pill = statusRow.querySelector('.pill');
    pill.classList.toggle('off');
    pill.textContent = isActive ? 'INACTIVE' : 'ACTIVE';
  });