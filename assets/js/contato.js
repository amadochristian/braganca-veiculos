// assets/js/contato.js - Página de Contato
document.addEventListener('DOMContentLoaded', () => {
    // Configurar navbar
    setupNavbar();
    
    // Adicionar meta tags dinâmicas
    if (typeof CONFIG !== 'undefined' && CONFIG.STORE) {
        document.title = `Contato - ${CONFIG.STORE.name}`;
    }
    
    // Configurar links de contato dinâmicos
    setupContactLinks();
});

function setupContactLinks() {
    // WhatsApp link
    const whatsappButtons = document.querySelectorAll('a[href*="wa.me"], .btn-whatsapp');
    whatsappButtons.forEach(btn => {
        if (!btn.getAttribute('data-configured')) {
            const defaultMessage = encodeURIComponent(`Olá! Gostaria de mais informações sobre os veículos disponíveis.`);
            const whatsappNumber = '5511932069533';
            btn.href = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;
            btn.setAttribute('data-configured', 'true');
            btn.setAttribute('target', '_blank');
        }
    });
}