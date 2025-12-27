// Manejo simple del formulario de contacto
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validación simple
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

    // Componer mailto
    const to = 'aloisepropiedades@gmail.com';
    const subject = encodeURIComponent(`Consulta desde web - ${name}`);
    const bodyLines = [
      `Nombre: ${name}`,
      `Email: ${email}`,
      `Teléfono: ${phone}`,
      '',
      message
    ];
    const body = encodeURIComponent(bodyLines.join('\n'));

    // Intentar abrir cliente de correo
    const mailto = `mailto:${to}?subject=${subject}&body=${body}`;
    window.location.href = mailto;

    // Mostrar instrucción en la UI
    status.textContent = 'Se abrirá tu cliente de correo para finalizar el envío.';
    status.className = 'text-muted';
  });
});
