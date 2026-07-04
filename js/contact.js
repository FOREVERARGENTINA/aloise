// Envío del formulario de contacto vía EmailJS
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (!form) return;

  const cfg = window.CONFIG?.contactForm;
  if (cfg?.enabled && cfg?.emailjs?.publicKey && typeof emailjs !== 'undefined') {
    emailjs.init(cfg.emailjs.publicKey);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();
    const honeypot = form.website.value;

    if (honeypot) {
      // Bot detected — silently fail
      status.textContent = 'Enviado.';
      status.className = 'text-muted';
      return;
    }

    if (!name || !email || !message) {
      status.textContent = 'Por favor completá los campos requeridos.';
      status.className = 'form-error';
      return;
    }

    if (!cfg?.enabled || !cfg?.emailjs?.publicKey || typeof emailjs === 'undefined') {
      status.textContent = 'No se pudo enviar el mensaje. Por favor escribinos a aloisepropiedades@gmail.com.';
      status.className = 'form-error';
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    status.textContent = 'Enviando...';
    status.className = 'text-muted';

    emailjs.send(cfg.emailjs.serviceId, cfg.emailjs.templateId, {
      name,
      email,
      phone: phone || 'No proporcionado',
      message
    }).then(() => {
      status.textContent = '¡Mensaje enviado! Te contactaremos a la brevedad.';
      status.className = 'text-success';
      form.reset();
    }).catch((err) => {
      console.warn('No se pudo enviar el mensaje:', err);
      status.textContent = 'No se pudo enviar el mensaje. Por favor escribinos a aloisepropiedades@gmail.com.';
      status.className = 'form-error';
    }).finally(() => {
      submitBtn.disabled = false;
    });
  });
});
