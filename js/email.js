// Get the form element
const form = document.getElementById('contactForm');

form.addEventListener('submit', async (event) => {
  event.preventDefault(); // prevent page refresh

  // Get form data as JSON
  const formData = Object.fromEntries(new FormData(form).entries());

  try {
    const response = await fetch('/send-email', {
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