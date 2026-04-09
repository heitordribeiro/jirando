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
emailjs.init('cF-aWnWqc8T5iFeZ2');

// ==============================
// Show Footer Only on Desktop
// ==============================
function updateFooterVisibility() {
  const footer = document.getElementById('footer');
  if (!footer) return;

  // Show footer only on desktop (>=768px) and when on the contact section
  if (window.innerWidth >= 768) {
    // Check if we're on the contact section/page
    const contactSection = document.getElementById('contact');
    if (contactSection && (window.location.hash === '#contact' || window.location.pathname.includes('contact'))) {
      footer.classList.add('show-footer');  // Show footer on desktop
    } else {
      footer.classList.remove('show-footer');  // Hide footer if not on contact
    }
  } else {
    footer.classList.remove('show-footer');  // Always hide footer on mobile
  }
}

// ==============================
// Smooth Scroll + Contact Button Scroll
// ==============================
document.addEventListener('click', function (e) {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;

  e.preventDefault();
  const targetId = anchor.getAttribute('href').substring(1);
  const target = document.getElementById(targetId);

  if (targetId === 'contact') {
    updateFooterVisibility();
    // Scroll to contact section
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Also scroll to bottom to reveal footer on desktop
    if (window.innerWidth >= 768) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
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

// Initialize EmailJS with your user ID
emailjs.init('YOUR_USER_ID'); // Replace with your actual EmailJS user ID

if(contactForm) {
    contactForm.addEventListener('submit', function(e){
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        emailjs.send('service_d4s4v4q', 'template_quek7dx', {
            from_name: name,
            from_email: email,
            message: message,
            to_email: 'contactfromsite@jirando.com'
        }).then(() => {
            alert('Email enviado com sucesso!');
        }).catch(err => {
            // Log the error to the console to inspect it
            console.error('Error sending email:', err);

            // Display the error message or detailed error properties
            alert('Erro ao enviar email: ' + (err.message || err));
        });
    });
}

// ==============================
// WhatsApp Icon Float
// ==============================
const whatsappIcon = document.getElementById('whatsappIcon');
const footerEl = document.getElementById('footer');

window.addEventListener('scroll', () => {
  if (!whatsappIcon || !footerEl) return;
  const footerRect = footerEl.getBoundingClientRect();
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
    else window.location.href = 'en-us.html'; // default
  }

  // Direct access to contact page shows footer
  if (page.includes('contact')) {
    updateFooterVisibility();
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
// Load Partials
// ==============================
loadPartial('header-placeholder','partials/header.html');
loadPartial('footer-placeholder','partials/footer.html');

// ==============================
// Show Footer Only on Desktop
// ==============================
function updateFooterVisibility() {
  const footer = document.getElementById('footer');
  if (!footer) return;

  // Show footer only on desktop (>=768px) and when on the contact section
  if (window.innerWidth >= 768) {
    // Check if we're on the contact section/page
    const contactSection = document.getElementById('contact');
    if (contactSection && (window.location.hash === '#contact' || window.location.pathname.includes('contact'))) {
      footer.classList.add('show-footer');  // Show footer on desktop
    } else {
      footer.classList.remove('show-footer');  // Hide footer if not on contact
    }
  } else {
    footer.classList.remove('show-footer');  // Always hide footer on mobile
  }
}