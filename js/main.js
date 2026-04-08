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

document.addEventListener("DOMContentLoaded", () => {
  clearAllCookies();
  clearStorage();
});

// ==============================
// EmailJS Initialization
// ==============================
emailjs.init('YOUR_PUBLIC_KEY');

// ==============================
// Smooth Scroll for Anchors
// ==============================
document.addEventListener('click', function(e) {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;

  e.preventDefault();
  const target = document.querySelector(anchor.getAttribute('href'));
  if (!target) return;

  const header = document.querySelector('header');
  const headerHeight = header ? header.offsetHeight : 0;
  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

  window.scrollTo({ top: targetPosition, behavior: 'smooth' });
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
// Redirect index.html to browser language
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split("/").pop().toLowerCase();
  
  // Only redirect if we are on the main index.html
  if(page === '' || page === 'index.html') {
    const lang = navigator.language || navigator.userLanguage;
    if(lang.startsWith('en')) window.location.href = 'en-us.html';
    else if(lang.startsWith('es')) window.location.href = 'es-es.html';
    else window.location.href = 'pt-br.html'; // default
  }
});