// Init EmailJS
(function() {
  emailjs.init('YOUR_PUBLIC_KEY');
})();

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute('href'));
    const headerHeight = document.querySelector('header').offsetHeight;

    window.scrollTo({
      top: target.offsetTop - headerHeight,
      behavior: 'smooth'
    });
  });
});

// Form submit
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();

  emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
    from_name: name.value,
    from_email: email.value,
    message: message.value
  })
  .then(() => alert('Email enviado!'))
  .catch(err => alert('Erro: ' + err));
});

// Language switch
function changeLang(page) {
  window.location.href = page;
}

// WhatsApp
function sendWhatsApp() {
  const msg = `Nome: ${name.value}\nEmail: ${email.value}\nMensagem: ${message.value}`;
  window.open(`https://wa.me/5531991400841?text=${encodeURIComponent(msg)}`);
}