// assets/js/main.js - Página Inicial (Corrigido)
document.addEventListener('DOMContentLoaded', async () => {
    // Elementos da página
    const latestContainer = document.getElementById('latest-vehicles');
    
    // Configurar navbar mobile
    setupNavbar();
    
    try {
        // Carregar veículos
        let vehicles = VehicleCache.load();
        
        if (!vehicles) {
            vehicles = await XMLParser.fetchAndParse();
        } else {
            // Atualizar em background
            XMLParser.fetchAndParse().catch(console.error);
        }
        
        // Renderizar últimos veículos (APENAS 4)
        const latestVehicles = vehicles.slice(0, 4);
        latestContainer.innerHTML = latestVehicles.map(v => VehicleRenderer.renderCard(v, true)).join('');
        
        // Adicionar botão "Ver Mais" após os cards
        const verMaisHtml = `
            <div class="btn-ver-mais" style="grid-column: 1/-1; text-align: center; margin-top: 32px;">
                <a href="catalogo.html" class="btn btn-primary btn-lg">Ver Catálogo Completo →</a>
            </div>
        `;
        latestContainer.insertAdjacentHTML('beforeend', verMaisHtml);
        
        // Inicializar lazy loading
        VehicleRenderer.initLazyLoad();
        
    } catch (error) {
        console.error('Erro ao carregar veículos:', error);
        latestContainer.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <h3>Erro ao carregar veículos</h3>
                <p>Tente novamente mais tarde ou entre em contato conosco.</p>
                <a href="contato.html" class="btn btn-primary">Fale Conosco</a>
            </div>
        `;
    }
});