
  let currentStep = 1;

  const titles = {
    1: { title: "Pay account details", sub: "Where your payouts land" },
    2: { title: "Amount breakdown",     sub: "Review before you pay" },
    3: { title: "All done",             sub: "Your payment is confirmed" }
  };

  function updateProgress(step){
    document.querySelectorAll('.progress .seg').forEach(seg=>{
      const idx = parseInt(seg.dataset.seg, 10);
      seg.classList.remove('done','active');
      if(idx < step) seg.classList.add('done');
      else if(idx === step) seg.classList.add('active');
    });
  }

  function goToStep(step){
    document.querySelectorAll('.step').forEach(el=>el.classList.remove('active'));
    document.getElementById('step-' + step).classList.add('active');
    document.getElementById('stepTitle').textContent = titles[step].title;
    document.getElementById('stepSubtitle').textContent = titles[step].sub;
    document.getElementById('backBtn').style.visibility = step === 1 ? 'hidden' : 'visible';
    updateProgress(step);
    currentStep = step;
    document.querySelector('.scroll-area').scrollTo({top:0, behavior:'smooth'});
  }

  function goBack(){
    if(currentStep > 1) goToStep(currentStep - 1);
  }

  function continueToPay(){
    const name     = document.getElementById('acName').value.trim();
    const upi      = document.getElementById('acUpi').value.trim();
    const ifsc     = document.getElementById('acIfsc').value.trim();
    const id       = document.getElementById('acId').value.trim();
    const password = document.getElementById('acPassword').value.trim();
    const err      = document.getElementById('step1Error');

    if(!name || !upi || !ifsc || !id || !password){
      err.classList.add('show');
      return;
    }
    err.classList.remove('show');
    goToStep(2);
  }

  function payNow(){
    const btn = document.getElementById('payBtn');
    const btnText = document.getElementById('payBtnText');
    btn.disabled = true;
    btnText.textContent = "Processing…";
    setTimeout(()=>{
      goToStep(3);
      btn.disabled = false;
      btnText.textContent = "Pay ₹50,000 now";
    }, 900);
  }

  // init
  updateProgress(1);
  document.getElementById('backBtn').style.visibility = 'hidden';
