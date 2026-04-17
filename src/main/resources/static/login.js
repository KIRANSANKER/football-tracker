'use strict';
const API = window.location.hostname === "localhost"
  ? "http://localhost:8080/api"
  : "/api";

const views = ['signin', 'signup', 'forgot'];
const texts = {
  signin: { t: 'Welcome Back 👋', s: 'Sign in to continue your journey' },
  signup: { t: 'Join the League 🏆', s: 'Create your account to start tracking' },
  forgot: { t: 'Reset Password 🔑', s: 'Enter your email to receive a reset link' }
};

function switchView(viewName) {
  // Update Tabs
  if (viewName !== 'forgot') {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab' + viewName.charAt(0).toUpperCase() + viewName.slice(1)).classList.add('active');
    document.getElementById('tabSlider').className = 'tab-slider' + (viewName === 'signup' ? ' right' : '');
  }

  // Update Header
  document.getElementById('viewTitle').textContent = texts[viewName].t;
  document.getElementById('viewSubtitle').textContent = texts[viewName].s;

  // Switch form
  views.forEach(v => document.getElementById('view' + v.charAt(0).toUpperCase() + v.slice(1)).classList.remove('active'));
  document.getElementById('view' + viewName.charAt(0).toUpperCase() + viewName.slice(1)).classList.add('active');
}

function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
  }
}

function checkStrength(val) {
  let score = 0;
  if(val.length > 7) score++;
  if(/[A-Z]/.test(val)) score++;
  if(/[0-9]/.test(val)) score++;
  if(/[^A-Za-z0-9]/.test(val)) score++;

  const fill = document.getElementById('pwFill');
  const lbl = document.getElementById('pwLabel');
  
  const colors = ['#e2e8f0', '#ef4444', '#f59e0b', '#84cc16', '#22c55e'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  fill.style.width = (score * 25) + '%';
  fill.style.backgroundColor = colors[score];
  lbl.textContent = labels[score];
  lbl.style.color = colors[score];
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function simulateLoading(btnId, callback) {
  const btn = document.getElementById(btnId);
  const txt = btn.querySelector('.txt');
  const spin = btn.querySelector('.spinner');
  
  btn.disabled = true;
  txt.classList.add('hidden');
  spin.classList.remove('hidden');

  setTimeout(() => {
    btn.disabled = false;
    txt.classList.remove('hidden');
    spin.classList.add('hidden');
    callback();
  }, 1500);
}

async function handleSignin(e) {
  e.preventDefault();
  const email = document.getElementById('siEmail').value;
  const pw = document.getElementById('siPw').value;
  
  if (!email || !pw) {
    showToast('⚠️ Please enter email and password');
    return;
  }

  // Toggle Loading State
  const btn = document.getElementById('btnSignin');
  const txt = btn.querySelector('.txt');
  const spin = btn.querySelector('.spinner');
  btn.disabled = true;
  txt.classList.add('hidden');
  spin.classList.remove('hidden');

  try {
    // API Call to your Spring Boot Backend
   const response = await fetch(`${API}/auth/signin`,  {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: pw })
    });

	if (response.ok) {
	  const data = await response.json();

	  localStorage.setItem("role", data.role);
	  localStorage.setItem("name", data.name);
	  localStorage.setItem("email", data.email);

	  showToast('⚽ Successfully signed in!');

	  setTimeout(() => {
	    window.location.href = 'dashboard.html';
	  }, 1500);
	
    } else {
      const errorMsg = await response.text();
      showToast('⚠️ ' + (errorMsg || 'Invalid email or password'));
    }
  } catch (err) {
    showToast('⚠️ Cannot connect to server. Is it running?');
  } finally {
    btn.disabled = false;
    txt.classList.remove('hidden');
    spin.classList.add('hidden');
  }
}

async function handleSignup(e) {
  e.preventDefault();
  const email = document.getElementById('suEmail').value;
  const p1 = document.getElementById('suPw').value;
  const p2 = document.getElementById('suConf').value;
  const firstName = document.getElementById('suFirst').value;
  const lastName = document.getElementById('suLast').value;

  if (!firstName || !lastName || !email || !p1) {
    showToast('⚠️ Please fill in all fields');
    return;
  }

  if (p1 !== p2) {
    showToast('⚠️ Passwords do not match');
    return;
  }
  
  // Toggle Loading State
  const btn = document.getElementById('btnSignup');
  const txt = btn.querySelector('.txt');
  const spin = btn.querySelector('.spinner');
  btn.disabled = true;
  txt.classList.add('hidden');
  spin.classList.remove('hidden');

  try {
    // API Call to your Spring Boot Backend
   const response = await fetch(`${API}/auth/signup`,  {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: firstName + ' ' + lastName, 
        email: email, 
        password: p1 
      })
    });

    if (response.ok) {
      showToast('🏆 Account created! Please log in.');
      setTimeout(() => {
        document.getElementById('siEmail').value = email;
        switchView('signin');
      }, 1500);
    } else {
      const errorMsg = await response.text();
      showToast('⚠️ ' + (errorMsg || 'Failed to create account'));
    }
  } catch (err) {
    showToast('⚠️ Cannot connect to server. Is it running?');
  } finally {
    btn.disabled = false;
    txt.classList.remove('hidden');
    spin.classList.add('hidden');
  }
}

function handleForgot(e) {
  e.preventDefault();
  simulateLoading('btnForgot', () => {
    showToast('✅ Reset link sent to your email');
    setTimeout(() => switchView('signin'), 2000);
  });
}

