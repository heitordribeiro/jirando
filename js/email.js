// ==============================
// Contact Form Submission
// ==============================
const contactForm = document.getElementById('contactForm');

// Initialize EmailJS with your user ID
emailjs.init('cF-aWnWqc8T5iFeZ2');

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
