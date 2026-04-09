// EmailJS Initialization
emailjs.init('cF-aWnWqc8T5iFeZ2'); // Replace with your actual EmailJS user ID

// ==============================
// Contact Form Submission
// ==============================
const contactForm = document.getElementById('contactForm');

if(contactForm) {
    contactForm.addEventListener('submit', function(e) {
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
            console.error('Erro ao enviar o email:', JSON.stringify(err)); 
            alert('Erro ao enviar o email. Verifique o console para detalhes.');
        });
    });
}