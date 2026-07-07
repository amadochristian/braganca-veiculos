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

  // Dias disponíveis para agendamento (rótulo + valor enviado à planilha).
  DAYS: [
    { value: '2026-07-23', label: 'Quinta-feira, 23/07' },
    { value: '2026-07-24', label: 'Sexta-feira, 24/07' },
    { value: '2026-07-25', label: 'Sábado, 25/07' },
    { value: '2026-07-26', label: 'Domingo, 26/07' },
  ],

  // Horários por dia. Dom 26/07 tem expediente reduzido (9h às 13h).
  HOURS_BY_DAY: {
    '2026-07-23': ['9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h'],
    '2026-07-24': ['9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h'],
    '2026-07-25': ['9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h'],
    '2026-07-26': ['9h', '10h', '11h', '12h', '13h'],
  },

  // TODO: substitua pela URL do seu Google Apps Script Web App
  // (veja o arquivo GOOGLE_SHEETS_SETUP.md para o passo a passo).
  SHEETS_WEBAPP_URL: 'https://script.google.com/macros/s/AKfycbyYIwjAvAgjapsP-4hERfieUS0lV7Pbs6EQrDkXIngTptP5zq5zy_mRZiYog8RLGS9tEQ/exec',

  // Para onde o usuário vai depois de agendar com sucesso.
  THANK_YOU_URL: 'obrigado.html',

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
   UTM — captura e persistência simples via querystring
   ========================================================================== */
function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const utm = {};
  keys.forEach((k) => {
    utm[k] = params.get(k) || sessionStorage.getItem(k) || '';
    if (params.get(k)) sessionStorage.setItem(k, params.get(k));
  });
  return utm;
}

/* ==========================================================================
   Formulário de agendamento
   ========================================================================== */
function populateDaySelect() {
  const daySelect = document.getElementById('day');
  if (!daySelect) return;
  CONFIG.DAYS.forEach((d) => {
    const opt = document.createElement('option');
    opt.value = d.value;
    opt.textContent = d.label;
    daySelect.appendChild(opt);
  });
}

function populateHourSelect(dayValue) {
  const hourSelect = document.getElementById('hour');
  if (!hourSelect) return;
  hourSelect.innerHTML = '<option value="" disabled selected>Selecione o horário</option>';
  const hours = CONFIG.HOURS_BY_DAY[dayValue] || [];
  hours.forEach((h) => {
    const opt = document.createElement('option');
    opt.value = h;
    opt.textContent = h;
    hourSelect.appendChild(opt);
  });
  hourSelect.disabled = hours.length === 0;
}

function validateField(field, rule) {
  const errorEl = field.parentElement.querySelector('.field-error');
  const valid = rule(field.value.trim());
  field.parentElement.classList.toggle('has-error', !valid);
  if (errorEl) errorEl.textContent = valid ? '' : field.dataset.errorMsg || 'Campo inválido';
  return valid;
}

function isValidPhone(v) {
  const digits = v.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13;
}

function maskPhone(value) {
  let v = value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 6) {
    v = v.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
  } else if (v.length > 2) {
    v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
  } else if (v.length > 0) {
    v = v.replace(/^(\d{0,2})/, '($1');
  }
  return v;
}

function wireForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  populateDaySelect();

  const nameField = document.getElementById('name');
  const phoneField = document.getElementById('phone');
  const dayField = document.getElementById('day');
  const hourField = document.getElementById('hour');
  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit');

  dayField.addEventListener('change', () => populateHourSelect(dayField.value));

  phoneField.addEventListener('input', () => {
    phoneField.value = maskPhone(phoneField.value);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const validName = validateField(nameField, (v) => v.length >= 3);
    const validPhone = validateField(phoneField, (v) => isValidPhone(v));
    const validDay = validateField(dayField, (v) => v.length > 0);
    const validHour = validateField(hourField, (v) => v.length > 0);

    if (!validName || !validPhone || !validDay || !validHour) {
      statusEl.textContent = 'Confira os campos destacados antes de enviar.';
      statusEl.className = 'form-status error';
      return;
    }

    submitBtn.disabled = true;
    statusEl.textContent = 'Enviando...';
    statusEl.className = 'form-status loading';

    const utm = getUTMParams();
    const dayLabel = CONFIG.DAYS.find((d) => d.value === dayField.value)?.label || dayField.value;

    const payload = {
      nome: nameField.value.trim(),
      whatsapp: phoneField.value.trim(),
      dia: dayLabel,
      horario: hourField.value,
      data_cadastro: new Date().toISOString(),
      pagina: window.location.href,
      ...utm,
    };

    try {
      // Apps Script Web Apps não retornam CORS legível em modo padrão,
      // por isso usamos no-cors: o envio ocorre, mas não lemos a resposta.
      await fetch(CONFIG.SHEETS_WEBAPP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Meta Pixel — evento de conversão principal
      if (typeof fbq === 'function') {
        fbq('track', 'Lead', { content_name: 'Open Garage - Agendamento' });
      }
      // GA4
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', { event_category: 'agendamento', dia: payload.dia });
        // Google Ads — conversão (preencha CONFIG.GOOGLE_ADS_CONVERSION_ID/LABEL)
        gtag('event', 'conversion', {
          send_to: `${CONFIG.GOOGLE_ADS_CONVERSION_ID}/${CONFIG.GOOGLE_ADS_CONVERSION_LABEL}`,
        });
      }

      sessionStorage.setItem('og_lead_nome', payload.nome);
      sessionStorage.setItem('og_lead_dia', payload.dia);
      sessionStorage.setItem('og_lead_horario', payload.horario);

      window.location.href = CONFIG.THANK_YOU_URL;
    } catch (err) {
      statusEl.textContent = 'Não foi possível enviar agora. Tente novamente ou fale no WhatsApp.';
      statusEl.className = 'form-status error';
      submitBtn.disabled = false;
    }
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
  wireForm();
  wireFAQ();
});
