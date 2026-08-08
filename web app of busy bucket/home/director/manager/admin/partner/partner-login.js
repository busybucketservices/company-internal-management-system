
  const heroTitle = document.getElementById('heroTitle');
  const heroSub = document.getElementById('heroSub');
  const heroCopy = {
    viewLogin:   ["Welcome back", "Log in to manage partners, services &amp; bookings"],
    viewRegister:["Create admin account", "Set up access to the Busy Bucket admin panel"],
    viewForgot1: ["Reset password", "We'll help you get back into your account"],
    viewForgot2: ["Enter OTP", "Check your phone for the verification code"],
    viewForgot3: ["Set new password", "Choose a strong password for your account"],
    viewSuccess: ["All set", "Your account is ready to go"]
  };

  function showView(id){
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    const copy = heroCopy[id];
    if(copy){ heroTitle.textContent = copy[0]; heroSub.innerHTML = copy[1]; }
    document.querySelector('.scroll-area').scrollTop = 0;
  }

  document.getElementById('goRegister').addEventListener('click', () => showView('viewRegister'));
  document.getElementById('backFromRegister').addEventListener('click', () => showView('viewLogin'));
  document.getElementById('goLoginFromRegister').addEventListener('click', () => showView('viewLogin'));

  document.getElementById('goForgot').addEventListener('click', () => showView('viewForgot1'));
  document.getElementById('backFromForgot1').addEventListener('click', () => showView('viewLogin'));
  document.getElementById('backFromForgot2').addEventListener('click', () => showView('viewForgot1'));

  document.getElementById('sendResetOtp').addEventListener('click', () => showView('viewForgot2'));
  document.getElementById('resendOtp').addEventListener('click', (e) => {
    e.preventDefault();
    const btn = e.currentTarget;
    const original = btn.textContent;
    btn.textContent = 'Sent!';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 2000);
  });
  document.getElementById('verifyOtp').addEventListener('click', () => showView('viewForgot3'));
  document.getElementById('resetPassBtn').addEventListener('click', () => showView('viewSuccess'));
  document.getElementById('goLoginFromSuccess').addEventListener('click', () => showView('viewLogin'));

  // OTP box auto-advance
  document.querySelectorAll('.otp-boxes input').forEach((input, idx, list) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^0-9]/g, '');
      if(input.value && idx < list.length - 1) list[idx + 1].focus();
    });
    input.addEventListener('keydown', (e) => {
      if(e.key === 'Backspace' && !input.value && idx > 0) list[idx - 1].focus();
    });
  });

  // Password show/hide toggles
  document.querySelectorAll('.toggle-eye').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      target.type = target.type === 'password' ? 'text' : 'password';
    });
  });

  // Remember me checkbox
  const rememberBox = document.getElementById('rememberBox');
  rememberBox.addEventListener('click', () => rememberBox.classList.toggle('checked'));
