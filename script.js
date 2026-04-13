// â”€â”€â”€ SCREEN NAVIGATION â”€â”€â”€
let currentScreen = 's-splash';

function goTo(id, navBtn) {
  if (id === currentScreen) return;

  const prev = document.getElementById(currentScreen);
  const next = document.getElementById(id);
  if (!next) return;

  prev.classList.remove('active');
  prev.classList.add('exit-left');

  next.classList.add('active');
  next.style.transform = 'translateX(100%)';
  next.style.opacity = '0';

  setTimeout(() => {
    next.style.transition = 'opacity 0.38s cubic-bezier(0.4,0,0.2,1), transform 0.38s cubic-bezier(0.4,0,0.2,1)';
    next.style.transform = '';
    next.style.opacity = '';
  }, 10);

  setTimeout(() => {
    prev.classList.remove('exit-left');
    prev.style.transform = '';
    prev.style.opacity = '';
  }, 420);

  currentScreen = id;

  // OTP timer reset
  if (id === 's-otp') {
    resetOTP();
    startOTPTimer();
  }

  // Update nav panel
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (navBtn) { navBtn.classList.add('active'); return; }
  const map = {
    's-splash': 0,
    's-onboarding': 1,
    's-login': 2,
    's-otp': 3,
    's-register': 4,
    's-profile-setup': 5,
    's-home': 6,
    's-disease-upload': 7,
    's-processing': 7,
    's-result': 8,
    's-chat': 9,
    's-crop-form': 10,
    's-crop-result': 11,
    's-nearby': 12,
    's-livestock-form': 13,
    's-livestock-processing': 13,
    's-livestock-result': 14,
    's-machinery-form': 15,
    's-machinery-processing': 15,
    's-machinery-result': 16,
    's-residue-form': 17,
    's-residue-processing': 17,
    's-residue-result': 18
  };
  const btns = document.querySelectorAll('.nav-btn');
  if (map[id] !== undefined) btns[map[id]]?.classList.add('active');

  // Auto-advance processing screens
  const processingMap = {
    's-processing': 's-result',
    's-livestock-processing': 's-livestock-result',
    's-machinery-processing': 's-machinery-result',
    's-residue-processing': 's-residue-result'
  };
  if (processingMap[id]) {
    setTimeout(() => {
      if (currentScreen === id) goTo(processingMap[id]);
    }, 3500);
  }
}

// â”€â”€â”€ TOAST â”€â”€â”€
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// AUTH LOGIC
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

// â”€â”€ ONBOARDING â”€â”€
let obCurrent = 0;
const obTotal = 3;

function goToSlide(idx) {
  const slides = document.querySelectorAll('.ob-slide');
  const dots = document.querySelectorAll('.ob-dot');
  const btn = document.getElementById('ob-next-btn');

  slides[obCurrent].classList.remove('active');
  slides[obCurrent].classList.add('exit');
  setTimeout(() => slides[obCurrent].classList.remove('exit'), 450);

  obCurrent = idx;
  slides[obCurrent].classList.add('active');

  dots.forEach((d, i) => d.classList.toggle('active', i === obCurrent));
  btn.textContent = obCurrent === obTotal - 1 ? 'Get Started ðŸš€' : 'Next â†’';
}

function obNext() {
  if (obCurrent < obTotal - 1) {
    goToSlide(obCurrent + 1);
  } else {
    goTo('s-login');
  }
}

// â”€â”€ LOGIN â”€â”€
function doLogin() {
  const btn = document.getElementById('login-btn');
  btn.textContent = 'Sending OTPâ€¦';
  btn.style.opacity = '0.7';
  btn.style.pointerEvents = 'none';
  setTimeout(() => {
    btn.textContent = 'Send OTP â†’';
    btn.style.opacity = '';
    btn.style.pointerEvents = '';
    goTo('s-otp');
  }, 1200);
}

// â”€â”€ OTP â”€â”€
let otpValues = ['', '', '', '', '', ''];
let otpActive = 0;
let otpTimerInterval = null;
let otpSeconds = 30;

function resetOTP() {
  otpValues = ['', '', '', '', '', ''];
  otpActive = 0;
  clearInterval(otpTimerInterval);
  for (let i = 0; i < 6; i++) {
    const box = document.getElementById('ob' + i);
    if (!box) continue;
    box.classList.remove('filled', 'active-box', 'has-val');
    box.querySelector('.otp-val').textContent = '';
  }
  const b0 = document.getElementById('ob0');
  if (b0) b0.classList.add('active-box');

  const verifyBtn = document.getElementById('otp-verify-btn');
  if (verifyBtn) {
    verifyBtn.disabled = true;
    verifyBtn.style.opacity = '0.45';
    verifyBtn.style.pointerEvents = 'none';
  }

  const resend = document.getElementById('otp-resend');
  if (resend) { resend.classList.remove('active'); resend.style.opacity = '0.4'; }
}

function startOTPTimer() {
  otpSeconds = 30;
  updateTimerDisplay();
  clearInterval(otpTimerInterval);
  otpTimerInterval = setInterval(() => {
    otpSeconds--;
    updateTimerDisplay();
    if (otpSeconds <= 0) {
      clearInterval(otpTimerInterval);
      const resend = document.getElementById('otp-resend');
      if (resend) { resend.classList.add('active'); resend.style.opacity = '1'; }
    }
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById('otp-timer');
  if (el) el.textContent = '0:' + String(otpSeconds).padStart(2, '0');
}

function resendOTP() {
  const resend = document.getElementById('otp-resend');
  if (!resend || !resend.classList.contains('active')) return;
  showToast('ðŸ“± OTP resent to +91 98765 43210');
  resend.classList.remove('active');
  resend.style.opacity = '0.4';
  resetOTP();
  startOTPTimer();
}

function kpPress(digit) {
  if (digit === '*') return;
  if (otpActive >= 6) return;

  otpValues[otpActive] = digit;
  const box = document.getElementById('ob' + otpActive);
  if (box) {
    box.classList.remove('active-box');
    box.classList.add('filled', 'has-val');
    box.querySelector('.otp-val').textContent = digit;
  }

  otpActive++;
  if (otpActive < 6) {
    const nextBox = document.getElementById('ob' + otpActive);
    if (nextBox) nextBox.classList.add('active-box');
  }

  // Enable verify if all 6 filled
  if (otpActive === 6) {
    const verifyBtn = document.getElementById('otp-verify-btn');
    if (verifyBtn) {
      verifyBtn.disabled = false;
      verifyBtn.style.opacity = '1';
      verifyBtn.style.pointerEvents = 'auto';
    }
  }
}

function kpBackspace() {
  if (otpActive === 0) return;

  if (otpActive < 6) {
    const curBox = document.getElementById('ob' + otpActive);
    if (curBox) curBox.classList.remove('active-box');
  }

  otpActive--;
  otpValues[otpActive] = '';
  const box = document.getElementById('ob' + otpActive);
  if (box) {
    box.classList.remove('filled', 'has-val');
    box.classList.add('active-box');
    box.querySelector('.otp-val').textContent = '';
  }

  const verifyBtn = document.getElementById('otp-verify-btn');
  if (verifyBtn) {
    verifyBtn.disabled = true;
    verifyBtn.style.opacity = '0.45';
    verifyBtn.style.pointerEvents = 'none';
  }
}

function verifyOTP() {
  const btn = document.getElementById('otp-verify-btn');
  btn.textContent = 'Verifyingâ€¦';
  btn.style.opacity = '0.7';
  clearInterval(otpTimerInterval);
  setTimeout(() => {
    btn.textContent = 'Verify & Continue â†’';
    btn.style.opacity = '1';
    showToast('âœ“ OTP Verified Successfully!');
    setTimeout(() => goTo('s-profile-setup'), 600);
  }, 1400);
}

// â”€â”€ PROFILE SETUP â”€â”€
function selectFarmSize(el) {
  el.closest('.farm-size-grid').querySelectorAll('.fs-tile').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

function completeSetup() {
  const btn = event.currentTarget;
  btn.textContent = 'Setting up your farmâ€¦';
  btn.style.opacity = '0.7';
  setTimeout(() => {
    btn.textContent = 'âœ“ Complete Setup & Enter App';
    btn.style.opacity = '1';
    showToast('ðŸŽ‰ Welcome to AgroBrain360, Ramesh!');
    setTimeout(() => goTo('s-home'), 700);
  }, 1500);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// EXISTING LOGIC
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

// â”€â”€â”€ LANGUAGE â”€â”€â”€
function setLang(el, name) {
  document.querySelectorAll('.lang-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

function switchLang(el) {
  document.querySelectorAll('.lt-option').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// â”€â”€â”€ SOIL CHIP â”€â”€â”€
function selectSoil(el) {
  el.closest('.soil-chips').querySelectorAll('.soil-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// â”€â”€â”€ GENERIC CHIP GROUP â”€â”€â”€
function selectChipGroup(el, group) {
  el.closest('.machine-chips, .soil-chips').querySelectorAll('.machine-chip,.soil-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// â”€â”€â”€ SYMPTOM TOGGLE â”€â”€â”€
function toggleSymptom(el) {
  el.classList.toggle('active');
  const check = el.querySelector('.sc-check');
  if (check) check.textContent = el.classList.contains('active') ? 'âœ“' : '';
}

// â”€â”€â”€ CONDITION CHIP TOGGLE â”€â”€â”€
function toggleCond(el) {
  el.classList.toggle('active');
}

// â”€â”€â”€ RESIDUE METHOD SELECT â”€â”€â”€
function selectMethod(el) {
  const all = el.closest('.card').querySelectorAll('.method-chip');
  all.forEach(c => {
    c.classList.remove('active');
    const span = c.querySelector('span');
    if (span) span.textContent = 'â—‹';
  });
  el.classList.add('active');
  const span = el.querySelector('span');
  if (span) span.textContent = 'âœ“';
}

// â”€â”€â”€ FILTER TOGGLE â”€â”€â”€
function filterToggle(el) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// â”€â”€â”€ SLIDER â”€â”€â”€
function updateSlider(el, valId, unit) {
  document.getElementById(valId).innerHTML = el.value + '<span>' + unit + '</span>';
  const pct = ((el.value - el.min) / (el.max - el.min)) * 100;
  el.style.background = `linear-gradient(90deg, var(--g1) ${pct}%, rgba(0,0,0,0.1) ${pct}%)`;
}

// â”€â”€â”€ CHAT â”€â”€â”€
const chatResponses = {
  'Yes, dark brown spots': 'Those dark spots confirm <strong>Early Blight</strong> (Alternaria solani). Here\'s what to do:<br><br>1ï¸âƒ£ Remove infected leaves immediately<br>2ï¸âƒ£ Apply Mancozeb @ 2g/litre<br>3ï¸âƒ£ Avoid wetting foliage<br><br>Should I find nearby agri-shops? ðŸŒ¿',
  'No, just yellow': 'Uniform yellowing without spots usually means <strong>Nitrogen deficiency</strong>. Try:<br><br>â€¢ Apply Urea @ 5g/litre water<br>â€¢ Check soil pH (ideal 6.0â€“7.0)<br>â€¢ Ensure proper irrigation ðŸŒ±',
  'Scan my crop photo': 'Sure! Taking you to the Disease Scanner now. ðŸ“·',
  'Tell me the solution': 'Apply <strong>Mancozeb 75WP</strong> every 7 days for 3 weeks. Reduce watering and improve airflow. Results visible in 10â€“14 days! ðŸŽ¯',
};

function addChat(msg) {
  const body = document.getElementById('chat-body');

  const userMsg = document.createElement('div');
  userMsg.className = 'msg-wrap user';
  userMsg.innerHTML = `<div class="msg-bubble">${msg}</div><div class="msg-time">Now</div>`;
  body.appendChild(userMsg);

  const typing = document.createElement('div');
  typing.className = 'bot-typing';
  typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  body.appendChild(typing);
  body.scrollTop = body.scrollHeight;

  setTimeout(() => {
    typing.remove();
    const response = chatResponses[msg] || 'Great question! Let me find the best advice based on your location and crop. ðŸŒ¾';
    const botMsg = document.createElement('div');
    botMsg.className = 'msg-wrap bot';
    botMsg.innerHTML = `<div class="msg-tag">AgroBot</div><div class="msg-bubble">${response}</div><div class="msg-time">Now</div>`;
    body.appendChild(botMsg);
    body.scrollTop = body.scrollHeight;
    if (msg === 'Scan my crop photo') setTimeout(() => goTo('s-disease-upload'), 600);
  }, 1200);
}

function sendChat() {
  const input = document.getElementById('chat-input-field');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  addChat(msg);
}

function handleChatKey(e) {
  if (e.key === 'Enter') sendChat();
}

window.addEventListener('load', () => {
  // Reset onboarding slide state
  obCurrent = 0;
});
