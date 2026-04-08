import emailjs from 'emailjs-com'

export default function Contact() {

  const sendEmail = (e) => {
    e.preventDefault()

    emailjs.sendForm(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      e.target,
      'YOUR_PUBLIC_KEY'
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