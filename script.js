document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
      window.scrollTo({ top: offset, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  });

  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const fields = {
    nombre: { input: document.getElementById("campo-nombre"), error: document.getElementById("error-nombre") },
    email: { input: document.getElementById("campo-email"), error: document.getElementById("error-email") },
    mensaje: { input: document.getElementById("campo-mensaje"), error: document.getElementById("error-mensaje") },
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(field, message) {
    fields[field].input.classList.toggle("has-error", Boolean(message));
    fields[field].input.setAttribute("aria-invalid", Boolean(message));
    fields[field].error.textContent = message || "";
  }

  Object.keys(fields).forEach((key) => {
    fields[key].input.addEventListener("input", () => setError(key, ""));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "";
    status.classList.remove("is-success", "is-error");

    let hasError = false;

    if (!fields.nombre.input.value.trim()) {
      setError("nombre", "Contanos tu nombre.");
      hasError = true;
    }

    const emailValue = fields.email.input.value.trim();
    if (!emailValue) {
      setError("email", "Dejanos un email de contacto.");
      hasError = true;
    } else if (!emailPattern.test(emailValue)) {
      setError("email", "Revisá el formato del email.");
      hasError = true;
    }

    if (!fields.mensaje.input.value.trim()) {
      setError("mensaje", "Contanos brevemente tu proyecto.");
      hasError = true;
    }

    if (hasError) return;

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        status.textContent = "Listo, recibimos tu mensaje. Te respondemos a la brevedad.";
        status.classList.add("is-success");
        form.reset();
      } else {
        status.textContent = "No pudimos enviar el mensaje. Probá de nuevo en unos minutos.";
        status.classList.add("is-error");
      }
    } catch {
      status.textContent = "No pudimos enviar el mensaje. Revisá tu conexión e intentá de nuevo.";
      status.classList.add("is-error");
    } finally {
      submitButton.disabled = false;
    }
  });
});
