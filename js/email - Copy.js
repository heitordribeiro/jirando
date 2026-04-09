// Initialize EmailJS
(function(){
  emailjs.init("cF-aWnWqc8T5iFeZ2"); // Replace with your EmailJS user ID
})();

// Get the form element
const form = document.getElementById('contactForm');

// Attach submit event listener
form.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent page refresh

  emailjs.sendForm('service_d4s4v4q', 'template_quek7dx', form) // Replace with your EmailJS serviuce and template IDs
    .then(() => {
      alert('Email sent successfully!');
      form.reset();
    })
    .catch((error) => {
      console.error('Failed to send email:', error);
      alert('Failed to send email. Check console for details.');
    });
});