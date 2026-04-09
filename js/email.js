// ==============================
// Contact Form Submission
// ==============================


  // Initialize EmailJS with your user ID
    (function(){
      emailjs.init("cF-aWnWqc8T5iFeZ2"); // Replace with your EmailJS user ID
    })();

    function sendEmail(event) {
      event.preventDefault(); // Prevent default form submission

      //const form = document.getElementById('contact-form');
      const form = document.getElementById('contactForm');

      emailjs.sendForm('service_d4s4v4q', 'template_quek7dx', form)
        .then(() => {
          alert('Email sent successfully!');
          form.reset();
        }, (error) => {
          console.error('Failed to send email:', error);
          alert('Failed to send email. Check console for details.');
        });
    }