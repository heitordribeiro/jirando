// EmailJS Initialization
emailjs.init('cF-aWnWqc8T5iFeZ2'); // Replace with your actual EmailJS user ID

// Function to send email via EmailJS
function sendEmail(name, email, message) {
  return emailjs.send('service_d4s4v4q', 'template_quek7dx', {
    from_name: name,
    from_email: email,
    message: message,
    to_email: 'contactfromsite@jirando.com'
  });
}

// Contact Form Submission Logic
const contactForm = document.getElementById('contactForm');
const responseMessage = document.getElementById('responseMessage'); // The div for showing success/error messages

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();  // Prevent default form submission (page reload)

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Call the sendEmail function from email.js
    sendEmail(name, email, message)
      .then(function (response) {
        // Success - Display success message
        showResponseMessage('¡Mensaje enviado con éxito!', 'success');
      })
      .catch(function (err) {
        // Error - Display error message
        console.error('Error al enviar el email:', JSON.stringify(err));
        showResponseMessage('Ocurrió un error al enviar el mensaje. Inténtalo nuevamente.', 'error');
      });
  });
}

// Function to display success or error messages
function showResponseMessage(message, type) {
  responseMessage.textContent = message;

  // Set the appropriate class for the message (success or error)
  responseMessage.className = `response-message ${type}`;

  // Show the message
  responseMessage.style.display = 'block';

  // Hide the message after 5 seconds
  setTimeout(function () {
    responseMessage.style.display = 'none';
  }, 5000);
}
console.log("Form Submitted");

sendEmail(name, email, message)
  .then(function (response) {
    console.log("Email sent successfully", response);
    showResponseMessage('¡Mensaje enviado con éxito!', 'success');
  })
  .catch(function (err) {
    console.error('Error al enviar el email:', err);
    showResponseMessage('Ocurrió un error al enviar el mensaje. Inténtalo nuevamente.', 'error');
  });