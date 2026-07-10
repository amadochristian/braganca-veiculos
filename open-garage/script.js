/* ==========================================================================
   OPEN GARAGE — Bragança Veículos
   CONFIGURAÇÕES EDITÁVEIS — altere só esta seção quando precisar.
   ========================================================================== */
const CONFIG = {
  // Data/hora de início do evento (usada no contador regressivo).
  // Formato: 'AAAA-MM-DDTHH:MM:SS-03:00'
  EVENT_START: '2026-07-23T09:00:00-03:00',

  // Rótulo exibido no hero (edite livremente).
  EVENT_LABEL: 'De 23 a 26 de julho',

  // Número de WhatsApp da loja, formato internacional sem espaços/símbolos.
  WHATSAPP_NUMBER: '5511932069533',

  // Mensagens pré-preenchidas enviadas ao abrir o WhatsApp.
  WHATSAPP_MESSAGE_DEFAULT:
    'Olá! Vim pelo site do Open Garage e quero agendar minha visita à Bragança Veículos. 🚗',
  WHATSAPP_MESSAGE_TEAM:
    'Olá! Tenho uma dúvida sobre o Open Garage da Bragança Veículos, pode me ajudar?',
  WHATSAPP_MESSAGE_AGENDAR:
    'Olá! Quero agendar minha visita no Open Garage.',

  // TODO: preencha quando tiver a conversão do Google Ads.
  GOOGLE_ADS_CONVERSION_ID: 'AW-XXXXXXXXX',
  GOOGLE_ADS_CONVERSION_LABEL: 'SEU_LABEL_AQUI',
};

/* ==========================================================================
   Utilidades de WhatsApp
   ========================================================================== */
function buildWhatsAppLink(message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${text}`;
}

function wireWhatsAppLinks() {
  document.querySelectorAll('[data-wa="default"]').forEach((el) => {
    el.href = buildWhatsAppLink(CONFIG.WHATSAPP_MESSAGE_DEFAULT);
  });
  document.querySelectorAll('[data-wa="team"]').forEach((el) => {
    el.href = buildWhatsAppLink(CONFIG.WHATSAPP_MESSAGE_TEAM);
  });
  document.querySelectorAll('[data-wa="agendar"]').forEach((el) => {
    el.href = buildWhatsAppLink(CONFIG.WHATSAPP_MESSAGE_AGENDAR);
  });

  // Rastreamento de clique no WhatsApp (Meta Pixel + GA4)
  document.querySelectorAll('a[data-wa]').forEach((el) => {
    el.addEventListener('click', () => {
      if (typeof fbq === 'function') {
        fbq('trackCustom', 'WhatsAppClick', { placement: el.dataset.wa });
      }
      if (typeof gtag === 'function') {
        gtag('event', 'whatsapp_click', { placement: el.dataset.wa });
      }
    });
  });
}

/* ==========================================================================
   Contador regressivo
   ========================================================================== */
function startCountdown() {
  const target = new Date(CONFIG.EVENT_START).getTime();
  const els = {
    days: document.querySelector('[data-cd="days"]'),
    hours: document.querySelector('[data-cd="hours"]'),
    minutes: document.querySelector('[data-cd="minutes"]'),
    seconds: document.querySelector('[data-cd="seconds"]'),
  };
  if (!els.days) return;

  function tick() {
    const now = Date.now();
    let diff = target - now;

    if (diff <= 0) {
      els.days.textContent = '00';
      els.hours.textContent = '00';
      els.minutes.textContent = '00';
      els.seconds.textContent = '00';
      const label = document.querySelector('[data-cd-status]');
      if (label) label.textContent = 'O Open Garage está rolando agora!';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    els.days.textContent = String(d).padStart(2, '0');
    els.hours.textContent = String(h).padStart(2, '0');
    els.minutes.textContent = String(m).padStart(2, '0');
    els.seconds.textContent = String(s).padStart(2, '0');

    requestAnimationFrame(() => setTimeout(tick, 1000));
  }
  tick();
}

/* ==========================================================================
   CTA "Quero agendar minha visita" — dispara conversão e segue para obrigado.html
   ========================================================================== */
function wireAgendarCta() {
  const btn = document.getElementById('agendar-cta');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (typeof fbq === 'function') {
      fbq('track', 'Lead', { content_name: 'Open Garage - Agendamento' });
    }
    if (typeof gtag === 'function') {
      gtag('event', 'generate_lead', { event_category: 'agendamento' });
      gtag('event', 'conversion', {
        send_to: `${CONFIG.GOOGLE_ADS_CONVERSION_ID}/${CONFIG.GOOGLE_ADS_CONVERSION_LABEL}`,
      });
    }
  });
}

/* ==========================================================================
   Redirecionamento automático para o WhatsApp (página obrigado.html)
   ========================================================================== */
function wireAutoRedirectWhatsApp() {
  const countdownEl = document.getElementById('ty-countdown');
  if (!countdownEl) return;

  let seconds = 3;
  countdownEl.textContent = seconds;

  const timer = setInterval(() => {
    seconds -= 1;
    countdownEl.textContent = Math.max(seconds, 0);
    if (seconds <= 0) {
      clearInterval(timer);
      window.location.href = buildWhatsAppLink(CONFIG.WHATSAPP_MESSAGE_AGENDAR);
    }
  }, 1000);
}

/* ==========================================================================
   Galeria — mostrar mais fotos
   ========================================================================== */
function wireGallery() {
  const btn = document.getElementById('gallery-show-more');
  if (!btn) return;
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gallery-item.gallery-hidden').forEach((item) => {
      item.classList.remove('gallery-hidden');
    });
    btn.remove();
  });
}

/* ==========================================================================
   FAQ accordion
   ========================================================================== */
function wireFAQ() {
  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    btn.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';
      document.querySelectorAll('.faq-item').forEach((i) => {
        i.setAttribute('data-open', 'false');
        i.querySelector('.faq-answer').style.maxHeight = null;
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.setAttribute('data-open', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   Init
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('current-year') &&
    (document.getElementById('current-year').textContent = new Date().getFullYear());
  wireWhatsAppLinks();
  startCountdown();
  wireAgendarCta();
  wireAutoRedirectWhatsApp();
  wireFAQ();
  wireGallery();
});
