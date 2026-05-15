// assets/js/utils.js - Funções utilitárias compartilhadas

// Navbar com efeito ao rolar
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar || navbar.classList.contains('navbar--solid')) return;

    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

// Configuração da navbar responsiva
function setupNavbar() {
    setupNavbarScroll();

    const toggleBtn = document.querySelector('.navbar__toggle');
    const menu = document.querySelector('.navbar__menu');

    if (toggleBtn && menu) {
        // Remove event listener anterior se existir
        const newToggle = toggleBtn.cloneNode(true);
        toggleBtn.parentNode.replaceChild(newToggle, toggleBtn);

        newToggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            newToggle.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        menu.querySelectorAll('a').forEach(link => {
            link.removeEventListener('click', closeMenu);
            link.addEventListener('click', closeMenu);
        });

        function closeMenu() {
            menu.classList.remove('active');
            if (newToggle) newToggle.classList.remove('active');
        }
    }
}

// Função debounce para busca
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Formatar preço
function formatPrice(price) {
    if (typeof price === 'string' && price.includes('R$')) {
        return price;
    }
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numericPrice)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(numericPrice);
}

// Formatar quilometragem
function formatKm(km) {
    const num = parseInt(km);
    if (isNaN(num)) return '0 km';
    return num.toLocaleString('pt-BR') + ' km';
}

// Mascarar placa
function maskPlate(plate) {
    if (!plate) return '***-****';
    const lastFour = plate.slice(-4);
    return `***-${lastFour}`;
}

// Extrair ano
function extractYear(anoModelo) {
    if (!anoModelo) return '';
    const years = anoModelo.split('/');
    return years[0] || years[1] || '';
}

function extractFullYear(anoModelo) {
    if (!anoModelo) return '';
    return anoModelo;
}

// Gerar slug da URL
function generateSlug(veiculo) {
    const title = `${veiculo.marca} ${veiculo.modelo} ${veiculo.versao}`;
    const slug = title
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    return `${slug}-${veiculo.idveiculo}`;
}