// ================= CONFIGURATION =================
const SUPABASE_URL = "https://riscmyfhutcyrrfclavk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpc2NteWZodXRjeXJyZmNsYXZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1NDIzNjIsImV4cCI6MjEwNDExODM2Mn0.HCQKGEzdmlsVIimxaTJ3EYlqUe6qY7qahCXuMxiSuew";

// Initialize Supabase Client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// State Variables
let currentLang = localStorage.getItem('ns_lang') || 'en';
let currentRole = 'contractor';
let pendingUnlockTarget = null;
let pendingDeleteTarget = { type: null, id: null };

// Localization Dictionary
const translations = {
  en: {
    app_title: "MyLabor11",
    app_tagline: "Verified & Protected Labor Portal",
    tab_contractor: "Contractor View",
    tab_labor: "Laborer View",
    contractor_heading: "Find Workers",
    contractor_subheading: "Contact details protected from spam",
    btn_post_availability: "Post Availability",
    labor_heading: "Find Work Sites",
    labor_subheading: "Direct work without middleman",
    btn_post_work: "Post Work Site",
    opt_all_areas: "All Areas (Lucknow)",
    opt_all_trades: "All Trades",
    opt_trade_mason: "🧱 Mason (Mistri)",
    opt_trade_helper: "👷 Helper / Beldar",
    opt_trade_painter: "🎨 Painter",
    opt_trade_electrician: "⚡ Electrician",
    opt_all_jobs_area: "Search by Location (All)",
    footer_title: "Live Cloud Database Connected",
    footer_sub: "Use your 4-digit PIN to delete your post once hired.",
    m_worker_title: "Register Worker Profile",
    lbl_name: "Full Name",
    lbl_trade: "Trade / Skill",
    lbl_area: "Location / Area",
    lbl_wage: "Daily Wage Expectation (₹)",
    lbl_phone: "Phone Number (Keep Safe)",
    lbl_pin: "Set 4-Digit Security PIN",
    lbl_pin_help_worker: "You will need this PIN to delete your post once you get work.",
    btn_cancel: "Cancel",
    btn_publish: "Publish Profile",
    m_job_title: "Post Work Site Requirement",
    lbl_job_req: "Work Requirement",
    lbl_contractor_name: "Contractor / Site Name",
    lbl_daily_rate: "Offered Daily Rate (₹/day)",
    lbl_pin_help_job: "Use this PIN to remove this post once labor requirement is fulfilled.",
    btn_post_site: "Post Work Site",
    m_unlock_title: "Unlock Direct Contact",
    m_unlock_sub: "To prevent spam calls and verify genuine callers, please enter your details once.",
    lbl_your_name: "Your Name",
    lbl_your_phone: "Your Mobile Number",
    btn_verify_reveal: "Verify & Reveal Number",
    m_delete_title: "Remove Listing",
    m_delete_sub: "Enter your 4-digit PIN to delete this listing.",
    err_incorrect_pin: "Incorrect PIN. Please try again.",
    btn_delete: "Delete",
    txt_guest: "Guest",
    txt_verified: "Verified",
    txt_per_day: "/day",
    txt_no_workers: "No active workers found in this category.",
    txt_no_jobs: "No active work postings found.",
    txt_call: "Call"
  },
  hi: {
    app_title: "लेबर11",
    app_tagline: "सुरक्षित एवं सत्यापित लेबर पोर्टल",
    tab_contractor: "ठेकेदार पोर्टल (मजदूर खोजें)",
    tab_labor: "मजदूर पोर्टल (काम खोजें)",
    contractor_heading: "उपलब्ध कारीगर एवं मजदूर",
    contractor_subheading: "स्पैम से सुरक्षित मोबाइल नंबर",
    btn_post_availability: "+ कारीगर जोड़ें",
    labor_heading: "काम की साइटें",
    labor_subheading: "बिना दलाल के सीधा काम पाएं",
    btn_post_work: "+ नया काम पोस्ट करें",
    opt_all_areas: "सभी क्षेत्र (लखनऊ)",
    opt_all_trades: "सभी काम / कारीगर",
    opt_trade_mason: "🧱 राजमिस्त्री (Mistri)",
    opt_trade_helper: "👷 हेल्पर / बेलदार",
    opt_trade_painter: "🎨 पेंटर",
    opt_trade_electrician: "⚡ इलेक्ट्रीशियन",
    opt_all_jobs_area: "स्थान अनुसार खोजें (सभी क्षेत्र)",
    footer_title: "लाइव क्लाउड डेटाबेस सुरक्षित",
    footer_sub: "काम मिल जाने पर अपना पोस्ट हटाने के लिए 4-अंकों का पिन उपयोग करें।",
    m_worker_title: "कारीगर/मजदूर प्रोफाइल बनाएं",
    lbl_name: "पूरा नाम",
    lbl_trade: "काम / हुनर",
    lbl_area: "स्थान / इलाका",
    lbl_wage: "दैनिक मजदूरी की उम्मीद (₹)",
    lbl_phone: "मोबाइल नंबर (सुरक्षित रहेगा)",
    lbl_pin: "4-अंकों का सुरक्षा पिन बनाएं",
    lbl_pin_help_worker: "काम मिल जाने पर अपनी प्रोफाइल हटाने के लिए इस पिन की जरूरत होगी।",
    btn_cancel: "रद्द करें",
    btn_publish: "प्रोफाइल सुरक्षित करें",
    m_job_title: "काम / साइट की जरूरत पोस्ट करें",
    lbl_job_req: "काम का विवरण",
    lbl_contractor_name: "ठेकेदार / साइट का नाम",
    lbl_daily_rate: "दी जाने वाली मजदूरी (₹/दिन)",
    lbl_pin_help_job: "मजदूर मिल जाने पर यह पोस्ट हटाने के लिए इस पिन का उपयोग करें।",
    btn_post_site: "काम पोस्ट करें",
    m_unlock_title: "मोबाइल नंबर देखें",
    m_unlock_sub: "फर्जी कॉल रोकने के लिए कृपया एक बार अपना नाम और नंबर दर्ज करें।",
    lbl_your_name: "आपका नाम",
    lbl_your_phone: "आपका मोबाइल नंबर",
    btn_verify_reveal: "सत्यापित करें और नंबर देखें",
    m_delete_title: "पोस्ट हटाएं",
    m_delete_sub: "यह पोस्ट हटाने के लिए अपना 4-अंकों का पिन दर्ज करें।",
    err_incorrect_pin: "गलत पिन! कृपया पुनः प्रयास करें।",
    btn_delete: "हटाएं",
    txt_guest: "अतिथि (Guest)",
    txt_verified: "सत्यापित",
    txt_per_day: "/दिन",
    txt_no_workers: "इस श्रेणी में कोई मजदूर उपलब्ध नहीं मिला।",
    txt_no_jobs: "इस क्षेत्र में कोई काम उपलब्ध नहीं मिला।",
    txt_call: "कॉल करें"
  }
};

function toggleLanguage() {
  currentLang = (currentLang === 'en') ? 'hi' : 'en';
  localStorage.setItem('ns_lang', currentLang);
  applyTranslations();
  renderWorkers();
  renderJobs();
}

function applyTranslations() {
  const t = translations[currentLang];
  document.getElementById('langBtnText').innerText = (currentLang === 'en') ? 'हिंदी' : 'English';
  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    if (t[key]) elem.innerText = t[key];
  });
  updateAuthBadge();
}

function isVerifiedViewer() {
  return !!localStorage.getItem('ns_viewer_phone');
}

function updateAuthBadge() {
  const t = translations[currentLang];
  const viewer = localStorage.getItem('ns_viewer_name');
  const text = document.getElementById('authStatusText');
  const dot = document.getElementById('authDot');
  if (viewer) {
    text.innerText = viewer.split(' ')[0] + ` (${t.txt_verified})`;
    dot.className = "fa-solid fa-circle text-[8px] text-green-400";
  } else {
    text.innerText = t.txt_guest;
    dot.className = "fa-solid fa-circle text-[8px] text-yellow-400";
  }
}

function switchRole(role) {
  currentRole = role;
  const contractorSec = document.getElementById('contractorSection');
  const laborSec = document.getElementById('laborSection');
  const tabContractor = document.getElementById('tabContractor');
  const tabLabor = document.getElementById('tabLabor');

  if (role === 'contractor') {
    contractorSec.classList.remove('hidden');
    laborSec.classList.add('hidden');
    tabContractor.className = "py-3 text-center font-bold text-blue-700 border-b-2 border-blue-700 flex justify-center items-center gap-2 text-xs sm:text-sm";
    tabLabor.className = "py-3 text-center font-bold text-gray-500 border-b-2 border-transparent flex justify-center items-center gap-2 text-xs sm:text-sm";
    renderWorkers();
  } else {
    contractorSec.classList.add('hidden');
    laborSec.classList.remove('hidden');
    tabLabor.className = "py-3 text-center font-bold text-green-700 border-b-2 border-green-700 flex justify-center items-center gap-2 text-xs sm:text-sm";
    tabContractor.className = "py-3 text-center font-bold text-gray-500 border-b-2 border-transparent flex justify-center items-center gap-2 text-xs sm:text-sm";
    renderJobs();
  }
}

function toggleModal(modalId) {
  document.getElementById(modalId).classList.toggle('hidden');
}

function maskPhone(phone) {
  if (!phone || phone.length < 10) return "••••••••••";
  return phone.substring(0, 2) + "•••• " + phone.substring(7);
}

// ================= SUPABASE DATA FETCHING =================

async function renderWorkers() {
  const t = translations[currentLang];
  const area = document.getElementById('workerAreaFilter').value;
  const trade = document.getElementById('workerTradeFilter').value;
  const list = document.getElementById('workerList');

  let query = supabaseClient.from('workers').select('*').order('id', { ascending: false });

  if (area !== 'ALL') query = query.eq('area', area);
  if (trade !== 'ALL') query = query.eq('trade', trade);

  const { data: workers, error } = await query;

  if (error) {
    list.innerHTML = `<div class="text-center py-6 text-red-500 text-xs">Error loading database: ${error.message}</div>`;
    return;
  }

  if (!workers || workers.length === 0) {
    list.innerHTML = `<div class="text-center py-10 text-gray-400 text-xs">${t.txt_no_workers}</div>`;
    return;
  }

  list.innerHTML = workers.map(w => `
    <div class="border border-gray-200 rounded-xl p-3.5 bg-white shadow-xs flex flex-col gap-2 relative">
      <div class="flex justify-between items-start">
        <div>
          <div class="font-bold text-gray-800 text-sm flex items-center gap-1">
            ${w.name}
            ${w.verified ? '<i class="fa-solid fa-circle-check text-blue-600 text-xs" title="Verified"></i>' : ''}
          </div>
          <div class="text-[11px] text-gray-500 mt-0.5"><i class="fa-solid fa-location-dot text-red-500"></i> ${w.area}</div>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">${w.trade}</span>
          <button onclick="promptDelete('worker', ${w.id})" title="Remove Listing" class="text-gray-400 hover:text-red-600 p-1 text-xs">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
      
      <div class="flex justify-between items-center pt-2 border-t border-gray-100 text-xs">
        <span class="font-extrabold text-gray-800">₹${w.wage} <span class="text-[10px] font-normal text-gray-500">${t.txt_per_day}</span></span>
        
        <div id="w-btn-wrap-${w.id}">
          <button onclick="handleContactClick('w-btn-wrap-${w.id}', '${w.phone}')" class="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition">
            <i class="fa-solid fa-lock text-[10px]"></i> ${maskPhone(w.phone)}
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

async function renderJobs() {
  const t = translations[currentLang];
  const area = document.getElementById('jobAreaFilter').value;
  const list = document.getElementById('jobList');

  let query = supabaseClient.from('jobs').select('*').order('id', { ascending: false });
  if (area !== 'ALL') query = query.eq('area', area);

  const { data: jobs, error } = await query;

  if (error) {
    list.innerHTML = `<div class="text-center py-6 text-red-500 text-xs">Error loading database: ${error.message}</div>`;
    return;
  }

  if (!jobs || jobs.length === 0) {
    list.innerHTML = `<div class="text-center py-10 text-gray-400 text-xs">${t.txt_no_jobs}</div>`;
    return;
  }

  list.innerHTML = jobs.map(j => `
    <div class="border border-gray-200 rounded-xl p-3.5 bg-white shadow-xs flex flex-col gap-2 border-l-4 border-l-green-600 relative">
      <div class="flex justify-between items-start">
        <div>
          <div class="font-bold text-gray-800 text-sm">${j.title}</div>
          <div class="text-[11px] text-gray-500 mt-0.5 font-medium">${j.contractor} • <i class="fa-solid fa-location-dot text-red-500"></i> ${j.area}</div>
        </div>
        <button onclick="promptDelete('job', ${j.id})" title="Remove Work Site" class="text-gray-400 hover:text-red-600 p-1 text-xs">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
      
      <div class="flex justify-between items-center pt-2 border-t border-gray-100 text-xs">
        <span class="font-extrabold text-green-700">₹${j.wage} <span class="text-[10px] font-normal text-gray-500">${t.txt_per_day}</span></span>
        
        <div id="j-btn-wrap-${j.id}">
          <button onclick="handleContactClick('j-btn-wrap-${j.id}', '${j.phone}')" class="bg-green-700 hover:bg-green-800 text-white font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition">
            <i class="fa-solid fa-lock text-[10px]"></i> ${maskPhone(j.phone)}
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ================= CONTACT UNLOCK FLOW =================

function handleContactClick(targetWrapperId, fullPhone) {
  if (isVerifiedViewer()) {
    revealDirectContact(targetWrapperId, fullPhone);
  } else {
    pendingUnlockTarget = { wrapperId: targetWrapperId, phone: fullPhone };
    toggleModal('unlockModal');
  }
}

function verifyAndUnlock(e) {
  e.preventDefault();
  const name = document.getElementById('viewerName').value;
  const phone = document.getElementById('viewerPhone').value;
  
  localStorage.setItem('ns_viewer_name', name);
  localStorage.setItem('ns_viewer_phone', phone);
  
  toggleModal('unlockModal');
  updateAuthBadge();
  
  if (pendingUnlockTarget) {
    revealDirectContact(pendingUnlockTarget.wrapperId, pendingUnlockTarget.phone);
    pendingUnlockTarget = null;
  }
}

function revealDirectContact(wrapperId, phone) {
  const t = translations[currentLang];
  const container = document.getElementById(wrapperId);
  if (container) {
    container.innerHTML = `
      <a href="tel:${phone}" class="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 animate-pulse">
        <i class="fa-solid fa-phone-volume"></i> ${t.txt_call} ${phone}
      </a>
    `;
  }
}

// ================= CLOUD INSERT HANDLERS =================

async function saveWorker(e) {
  e.preventDefault();
  const btn = document.getElementById('wSubmitBtn');
  btn.innerText = "Saving...";
  btn.disabled = true;

  const newWorker = {
    name: document.getElementById('wName').value,
    trade: document.getElementById('wTrade').value,
    area: document.getElementById('wArea').value,
    wage: Number(document.getElementById('wWage').value),
    phone: document.getElementById('wPhone').value,
    pin: document.getElementById('wPin').value,
    verified: true
  };

  const { error } = await supabaseClient.from('workers').insert([newWorker]);

  btn.innerText = translations[currentLang].btn_publish;
  btn.disabled = false;

  if (error) {
    alert("Error saving worker: " + error.message);
    return;
  }

  document.getElementById('workerForm').reset();
  toggleModal('workerModal');
  renderWorkers();
}

async function saveJob(e) {
  e.preventDefault();
  const btn = document.getElementById('jSubmitBtn');
  btn.innerText = "Saving...";
  btn.disabled = true;

  const newJob = {
    title: document.getElementById('jTitle').value,
    contractor: document.getElementById('jContractor').value,
    area: document.getElementById('jArea').value,
    wage: Number(document.getElementById('jWage').value),
    phone: document.getElementById('jPhone').value,
    pin: document.getElementById('jPin').value
  };

  const { error } = await supabaseClient.from('jobs').insert([newJob]);

  btn.innerText = translations[currentLang].btn_post_site;
  btn.disabled = false;

  if (error) {
    alert("Error saving job: " + error.message);
    return;
  }

  document.getElementById('jobForm').reset();
  toggleModal('jobModal');
  renderJobs();
}

// ================= CLOUD PIN DELETE HANDLERS =================

function promptDelete(type, id) {
  pendingDeleteTarget = { type, id };
  document.getElementById('deletePinInput').value = '';
  document.getElementById('deleteError').classList.add('hidden');
  toggleModal('deleteModal');
}

async function confirmDelete(e) {
  e.preventDefault();
  const enteredPin = document.getElementById('deletePinInput').value;
  const { type, id } = pendingDeleteTarget;
  const submitBtn = document.getElementById('deleteSubmitBtn');

  submitBtn.innerText = "...";
  submitBtn.disabled = true;

  const table = (type === 'worker') ? 'workers' : 'jobs';

  const { data, error } = await supabaseClient
    .from(table)
    .select('pin')
    .eq('id', id)
    .single();

  if (error || !data || data.pin !== enteredPin) {
    submitBtn.innerText = translations[currentLang].btn_delete;
    submitBtn.disabled = false;
    document.getElementById('deleteError').classList.remove('hidden');
    return;
  }

  const { error: deleteError } = await supabaseClient
    .from(table)
    .delete()
    .eq('id', id);

  submitBtn.innerText = translations[currentLang].btn_delete;
  submitBtn.disabled = false;

  if (deleteError) {
    alert("Failed to delete: " + deleteError.message);
    return;
  }

  toggleModal('deleteModal');
  if (type === 'worker') {
    renderWorkers();
  } else {
    renderJobs();
  }
}

// Initial Load
applyTranslations();
renderWorkers();