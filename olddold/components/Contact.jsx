import emailjs from 'emailjs-com'

export default function Contact() {

  const sendEmail = (e) => {
    e.preventDefault()

    // Prevent crash if not configured
    if (!import.meta.env.VITE_EMAILJS_PUBLIC_KEY) {
      alert('Form temporarily unavailable')
      return
    }

    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      e.target,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => alert('Email enviado!'))
    .catch(() => alert('Erro ao enviar'))
  }

  return (
    <section id="contact">
      <h2>Contato</h2>

      <form onSubmit={sendEmail}>
        <input name="name" placeholder="Nome" required />
        <input name="email" type="email" placeholder="Email" required />
        <textarea name="message" placeholder="Mensagem" required />
        <button className="btn">Enviar</button>
      </form>

      <p>Telefone: +55 (31) 99140-0841</p>
    </section>
  )
}