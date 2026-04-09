const form = document.getElementById('contactForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    name: form.name.value,
    email: form.email.value,
    message: form.message.value
  };

  try {
    const res = await fetch('/api/sendEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    if (data.success) {
      alert('Email sent successfully!');
      form.reset();
    } else {
      console.error(data.error);
      alert('Failed to send email. Check console.');
    }
  } catch (err) {
    console.error(err);
    alert('Error sending email.');
  }
});