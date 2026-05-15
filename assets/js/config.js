// assets/js/config.js - Configurações Globais
const CONFIG = {
    // URL do XML com os veículos
    XML_URL: 'Anuncios.xml',

    // Cache storage key
    CACHE_KEY: 'braganca_veiculos_cache',
    CACHE_TIMESTAMP_KEY: 'braganca_veiculos_timestamp',
    CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 horas

    // Informações da Loja
    STORE: {
        name: 'Bragança Veículos',
        phone: '551124730601',
        phoneDisplay: '(11) 2473-0601',
        whatsapp: '5511932069533',
        whatsappDisplay: '(11) 93206-9533',
        address: 'Av. José Gomes da Rocha Leal, 1267 — Bragança Paulista/SP',
        instagram: 'https://www.instagram.com/braganca_veiculos',
        instagramUser: '@braganca_veiculos'
    },

    // Configurações de paginação
    ITEMS_PER_PAGE: 12
};