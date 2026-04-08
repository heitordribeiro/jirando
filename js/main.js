// Clear all cookies for the current domain
function clearAllCookies() {
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }
}

// Clear localStorage and sessionStorage
function clearStorage() {
  localStorage.clear();
  sessionStorage.clear();
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  clearAllCookies();
  clearStorage();
});


/* ==============================
   EmailJS Initialization
============================== */
emailjs.init('YOUR_PUBLIC_KEY');

/* ==============================
   Smooth Scroll for Anchors
============================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    const headerHeight = document.querySelector('header').offsetHeight;
    const targetPosition = target.offsetTop - headerHeight;
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  });
});

/* ==============================
   Contact Form Submission
============================== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
      from_name: name,
      from_email: email,
      message: message,
      to_email: 'test@test.com'
    })
    .then(() => alert('Email enviado com sucesso!'))
    .catch(err => alert('Erro ao enviar email: ' + err));
  });
}

/* ==============================
   WhatsApp Send Function
============================== */
function sendWhatsApp() {
  const name = encodeURIComponent(document.getElementById('name').value);
  const email = encodeURIComponent(document.getElementById('email').value);
  const message = encodeURIComponent(document.getElementById('message').value);
  const whatsappNumber = "5531991400841"; 
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Nome: ${name}%0AEmail: ${email}%0AMensagem: ${message}`;
  window.open(whatsappLink, "_blank");
}

/* ==============================
   Language Switching
============================== */
function setLang(lang) {
  document.querySelectorAll('.lang').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.' + lang).forEach(el => el.classList.add('active'));
}

/* ==============================
   Partial Loader (Header & Footer)
============================== */
async function loadPartial(id, url) {
  const res = await fetch(url);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

// Load header and footer partials dynamically
loadPartial('header-placeholder', 'partials/header.html');
loadPartial('footer-placeholder', 'partials/footer.html');

// Function to set language
function setLang(lang) {
  document.querySelectorAll('.lang').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.lang.' + lang).forEach(el => el.classList.add('active'));
}

// Detect browser language
function detectBrowserLang() {
  const lang = navigator.language || navigator.userLanguage; // e.g., "pt-BR", "en-US"
  if (lang.startsWith('pt')) return 'pt';
  if (lang.startsWith('en')) return 'en';
  if (lang.startsWith('es')) return 'es';
  return 'pt'; // default fallback
}

// On page load, set language based on browser
document.addEventListener('DOMContentLoaded', () => {
  const browserLang = detectBrowserLang();
  setLang(browserLang);

  // Optional: highlight the selected flag
  document.querySelectorAll('.lang-switch img').forEach(img => {
    img.style.opacity = 0.5;
  });
  const flagMap = { 'pt':'br.png', 'en':'us.png', 'es':'es.png' };
  const activeFlag = document.querySelector(`.lang-switch img[src$='${flagMap[browserLang]}']`);
  if(activeFlag) activeFlag.style.opacity = 1;
});