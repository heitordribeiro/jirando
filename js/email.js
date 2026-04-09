const form = document.getElementById('contactForm');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = Object.fromEntries(new FormData(form).entries());

  try {
    const response = await fetch('http://localhost:3000/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      alert('Email sent successfully!');
      form.reset();
    } else {
      const errorData = await response.json();
      console.error('Failed to send email:', errorData.error);
      alert('Failed to send email. Check console.');
    }
  } catch (err) {
    console.error('Network error:', err);
    alert('Network error. Check console.');
  }
});