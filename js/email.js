document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const statusNode = document.getElementById("formStatus");
  const submitButton = form?.querySelector("button[type='submit']");

  if (!form) {
    console.warn("Form not found: #contactForm");
    return;
  }

  // Detect language from URL
  const pathName = window.location.pathname.toLowerCase();
  const pageLang = pathName.includes("pt-br")
    ? "pt"
    : pathName.includes("es-es")
    ? "es"
    : "en";

  const messages = {
    en: {
      sending: "Sending your message...",
      success: "Message sent successfully. We will contact you soon.",
      error: "We could not send your message right now. Please try again."
    },
    pt: {
      sending: "Enviando sua mensagem...",
      success: "Mensagem enviada com sucesso. Entraremos em contato em breve.",
      error: "Não foi possível enviar sua mensagem agora. Tente novamente."
    },
    es: {
      sending: "Enviando tu mensaje...",
      success: "Mensaje enviado correctamente. Te contactaremos pronto.",
      error: "No pudimos enviar tu mensaje ahora. Inténtalo nuevamente."
    }
  };

  const text = messages[pageLang] || messages.en;

  function setStatus(message, type = "") {
    if (!statusNode) return;

    statusNode.textContent = message;
    statusNode.classList.remove("success", "error");

    if (type) {
      statusNode.classList.add(type);
    }
  }

  // ✅ Initialize EmailJS safely
  if (window.emailjs && typeof window.emailjs.init === "function") {
    window.emailjs.init("cF-aWnWqc8T5iFeZ2");
  } else {
    console.error("EmailJS not loaded properly.");
  }

  // ✅ Handle form submit
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // 🚫 stop page refresh
    console.log("Form submission intercepted");

    if (!window.emailjs || typeof window.emailjs.sendForm !== "function") {
      console.error("EmailJS not available at submit time.");
      setStatus(text.error, "error");
      return;
    }

    submitButton?.setAttribute("disabled", "true");
    setStatus(text.sending);

    try {
      await window.emailjs.sendForm(
        "service_d4s4v4q",
        "template_quek7dx",
        form
      );

      form.reset();
      setStatus(text.success, "success");
    } catch (error) {
      console.error("EmailJS send error:", error);
      setStatus(text.error, "error");
    } finally {
      submitButton?.removeAttribute("disabled");
    }
  });
});