document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const statusNode = document.getElementById("formStatus");
  const submitButton = form?.querySelector("button[type='submit']");

  if (!form) {
    console.warn("Form not found: #contactForm");
    return;
  }

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

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitButton?.setAttribute("disabled", "true");
    setStatus(text.sending);

    try {
      const formData = new FormData(form);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("user_name"),
          email: formData.get("user_email"),
          phone: formData.get("user_phone"),
          message: formData.get("message"),
          page: window.location.pathname
        })
      });

      if (!response.ok) {
        throw new Error(`Contact request failed (${response.status})`);
      }

      form.reset();
      setStatus(text.success, "success");
    } catch (error) {
      console.error("Contact send error:", error);
      setStatus(text.error, "error");
    } finally {
      submitButton?.removeAttribute("disabled");
    }
  });
});
