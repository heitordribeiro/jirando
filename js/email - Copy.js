const form = document.getElementById("contactForm");
const statusNode = document.getElementById("formStatus");
const submitButton = form?.querySelector("button[type='submit']");

const pathName = window.location.pathname.toLowerCase();
const pageLang = pathName.includes("pt-br") ? "pt" : pathName.includes("es-es") ? "es" : "en";

const messages = {
  en: {
    sending: "Sending your message...",
    success: "Message sent successfully. We will contact you soon.",
    error: "We could not send your message right now. Please try again."
  },
  pt: {
    sending: "Enviando sua mensagem...",
    success: "Mensagem enviada com sucesso. Entraremos em contato em breve.",
    error: "Nao foi possivel enviar sua mensagem agora. Tente novamente."
  },
  es: {
    sending: "Enviando tu mensaje...",
    success: "Mensaje enviado correctamente. Te contactaremos pronto.",
    error: "No pudimos enviar tu mensaje ahora. Intentalo nuevamente."
  }
};

const text = messages[pageLang] || messages.en;

function setStatus(message, type = "") {
  if (!statusNode) {
    return;
  }

  statusNode.textContent = message;
  statusNode.classList.remove("success", "error");

  if (type) {
    statusNode.classList.add(type);
  }
}

if (form) {
  if (window.emailjs) {
    window.emailjs.init("cF-aWnWqc8T5iFeZ2");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!window.emailjs) {
      setStatus(text.error, "error");
      return;
    }

    submitButton?.setAttribute("disabled", "true");
    setStatus(text.sending);

    try {
      await window.emailjs.sendForm("service_d4s4v4q", "template_quek7dx", form);
      form.reset();
      setStatus(text.success, "success");
    } catch (error) {
      console.error("EmailJS send error:", error);
      setStatus(text.error, "error");
    } finally {
      submitButton?.removeAttribute("disabled");
    }
  });
}
