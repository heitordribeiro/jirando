// ==============================
// Clear Cookies and Storage
// ==============================
function clearAllCookies() {
  document.cookie.split(";").forEach(cookie => {
    const name = cookie.split("=")[0].trim();
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  });
}

function clearStorage() {
  localStorage.clear();
  sessionStorage.clear();
}

// ==============================
// EmailJS Initialization
// ==============================
emailjs.init('YOUR_PUBLIC_KEY');

// ==============================
// Smooth Scroll for Anchors + Contact Button Scroll
// ==============================
document.addEventListener('click', function(e) {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;

  e.preventDefault();
  const targetId = anchor.getAttribute('href').substring(1);
  const target = document.getElementById(targetId);

  if (targetId === 'contact') {
    // Scroll to bottom of page smoothly
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

    // Show footer
    const footer = document.getElementById('footer');
    if (footer) footer.style.display = 'block';

    // Optionally focus the contact section
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (target) {
    // Normal smooth scroll for other anchors
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  }
});

// ==============================
// Contact Form Submission
// ==============================
const contactForm = document.getElementById('contactForm');
if(contactForm) {
  contactForm.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    emailjs.send('YOUR_SERVICE_ID','YOUR_TEMPLATE_ID',{
      from_name: name,
      from_email: email,
      message: message,
      to_email: 'test@test.com'
    }).then(()=> alert('Email enviado com sucesso!'))
      .catch(err => alert('Erro ao enviar email: '+err));
  });
}

// ==============================
// WhatsApp Icon Float
// ==============================
const whatsappIcon = document.getElementById('whatsappIcon');
const footer = document.getElementById('footer');

window.addEventListener('scroll', () => {
  if (!whatsappIcon || !footer) return;
  const footerRect = footer.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  if (footerRect.top < windowHeight) {
    const overlap = windowHeight - footerRect.top;
    whatsappIcon.style.bottom = `${overlap + 20}px`;
  } else {
    whatsappIcon.style.bottom = '20px';
  }
});

// ==============================
// WhatsApp Send Function
// ==============================
function sendWhatsApp() {
  const name = encodeURIComponent(document.getElementById('name').value);
  const email = encodeURIComponent(document.getElementById('email').value);
  const message = encodeURIComponent(document.getElementById('message').value);
  const whatsappNumber = "5531991400841"; 
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Nome: ${name}%0AEmail: ${email}%0AMensagem: ${message}`;
  window.open(whatsappLink,"_blank");
}

// ==============================
// Redirect index.html to Browser Language
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  clearAllCookies();
  clearStorage();

  const page = window.location.pathname.split("/").pop().toLowerCase();
  if(page === '' || page === 'index.html') {
    const lang = navigator.language || navigator.userLanguage;
    if(lang.startsWith('pt')) window.location.href = 'pt-br.html';
    else if(lang.startsWith('es')) window.location.href = 'es-es.html';
    else window.location.href = 'en-us.html';
  }
});

// ==============================
// Initialize Header Language
// ==============================
function initHeaderLang() {
  const page = window.location.pathname.split("/").pop().toLowerCase();
  let lang = 'pt';
  if(page.includes('en-us')) lang = 'en';
  else if(page.includes('es-es')) lang = 'es';

  document.querySelectorAll('.lang-text').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if(text) el.innerHTML = text;
  });
}

// ==============================
// Load Header & Footer Partials
// ==============================
async function loadPartial(id, url){
  const res = await fetch(url);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;

  if(id === 'header-placeholder') {
    initHeaderLang();

    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');
    if(hamburger && menu){
      hamburger.addEventListener('click', () => {
        menu.classList.toggle('active');
        hamburger.classList.toggle('active');
      });

      menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          menu.classList.remove('active');
          hamburger.classList.remove('active');
        });
      });
    }
  }

  if(id === 'footer-placeholder') {
    initHeaderLang();
  }
}

// ==============================
// Show Footer on Contact Page
// ==============================
window.addEventListener("load", function() {
  if (window.location.pathname === '/session-contact') {
    const footer = document.querySelector('footer');
    if (footer) footer.style.display = 'block';
  }
});

// ==============================
// Load partials
// ==============================
loadPartial('header-placeholder','partials/header.html');
loadPartial('footer-placeholder','partials/footer.html');