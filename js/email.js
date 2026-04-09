// Initialize EmailJS
(function(){
  emailjs.init("cF-aWnWqc8T5iFeZ2");
})();

// Get form element
const form = document.getElementById('contactForm');

// Detect language from file name
const path = window.location.pathname.toLowerCase();

let lang = 'en';
if (path.includes('pt-br')) lang = 'pt';
else if (path.includes('es-es')) lang = 'es';
else if (path.includes('en-us')) lang = 'en';

// Messages
const messages = {
  en: {
    success: "🎉 Your message has been sent! We'll get back to you soon.",
    error: "😕 Oops! Something went wrong. Please try again."
  },
  pt: {
    success: "🎉 Sua mensagem foi enviada! Vamos responder em breve.",
    error: "😕 Ops! Algo deu errado. Tente novamente."
  },
  es: {
    success: "🎉 ¡Tu mensaje ha sido enviado! Te responderemos pronto.",
    error: "😕 ¡Ups! Algo salió mal. Inténtalo de nuevo."
  }
};

const text = messages[lang] || messages['en'];

// Create top popup
const messageBox = document.createElement('div');
messageBox.style.position = 'fixed';
messageBox.style.top = '20px';
messageBox.style.left = '50%';
messageBox.style.transform = 'translateX(-50%)';
messageBox.style.padding = '12px 20px';
messageBox.style.borderRadius = '8px';
messageBox.style.color = '#fff';
messageBox.style.fontFamily = 'Arial';
messageBox.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
messageBox.style.display = 'none';
messageBox.style.zIndex = '9999';
document.body.appendChild(messageBox);

function showMessage(success = true) {
  messageBox.textContent = success ? text.success : text.error;
  messageBox.style.backgroundColor = success ? '#4CAF50' : '#f44336';
  messageBox.style.display = 'block';

  setTimeout(() => {
    messageBox.style.display = 'none';
  }, 3000);
}

// Submit event
form.addEventListener('submit', function(event) {
  event.preventDefault();

  emailjs.sendForm('service_d4s4v4q', 'template_quek7dx', form)
    .then(() => {
      showMessage(true);
      form.reset();
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      showMessage(false);
    });
});