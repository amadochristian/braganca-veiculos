// assets/js/veiculo-detalhes.js
document.addEventListener('DOMContentLoaded', async () => {
    // Configurar navbar
    if (typeof setupNavbar === 'function') {
        setupNavbar();
    }
    
    // Obter ID da URL
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleId = urlParams.get('id');
    
    if (!vehicleId) {
        showError('ID do veículo não informado');
        return;
    }
    
    const contentDiv = document.getElementById('veiculo-content');
    const skeletonDiv = document.getElementById('skeleton-loader');
    const similaresSection = document.getElementById('veiculos-similares');
    const similaresGrid = document.getElementById('similares-grid');
    
    // Mostrar skeleton
    if (skeletonDiv) skeletonDiv.style.display = 'grid';
    if (contentDiv) contentDiv.style.display = 'none';
    if (similaresSection) similaresSection.style.display = 'none';
    
    try {
        // Carregar veículos
        let vehicles = VehicleCache.load();
        if (!vehicles) {
            vehicles = await XMLParser.fetchAndParse();
        } else {
            XMLParser.fetchAndParse().catch(console.error);
        }
        
        // Encontrar veículo específico
        const vehicle = vehicles.find(v => v.idveiculo === vehicleId);
        
        if (!vehicle) {
            showError('Veículo não encontrado');
            return;
        }
        
        // Atualizar título da página
        document.title = `${vehicle.marca} ${vehicle.modelo} - Bragança Veículos`;
        
        // Renderizar conteúdo do veículo
        const detalhesHtml = VehicleRenderer.renderDetalhes(vehicle);
        contentDiv.innerHTML = detalhesHtml;
        contentDiv.style.display = 'block';
        
        // Ocultar skeleton
        if (skeletonDiv) skeletonDiv.style.display = 'none';
        
        // Configurar galeria após renderizar
        setupGallery();
        
        // Renderizar veículos similares
        if (similaresGrid && vehicles.length > 0) {
            const similaresHtml = VehicleRenderer.renderSimilares(vehicles, vehicleId, vehicle.marca);
            similaresGrid.innerHTML = similaresHtml;
            similaresSection.style.display = 'block';
            
            if (typeof VehicleRenderer.initLazyLoad === 'function') {
                VehicleRenderer.initLazyLoad();
            }
        }
        
    } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
        showError('Erro ao carregar informações do veículo. Tente novamente mais tarde.');
    }
});

// Configurar galeria de imagens
function setupGallery() {
    const miniaturas = document.querySelectorAll('.miniatura');
    const imagemPrincipal = document.getElementById('imagem-principal');
    
    if (!miniaturas.length || !imagemPrincipal) {
        return;
    }
    
    miniaturas.forEach(miniatura => {
        miniatura.addEventListener('click', function() {
            // Remove active de todas
            miniaturas.forEach(m => m.classList.remove('ativa'));
            // Adiciona active na clicada
            this.classList.add('ativa');
            // Troca imagem principal
            const newImageUrl = this.getAttribute('data-image');
            if (newImageUrl) {
                imagemPrincipal.src = newImageUrl;
            }
        });
    });
    
    // Swipe touch para mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    imagemPrincipal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    imagemPrincipal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        
        if (Math.abs(diff) > 50) {
            const ativaAtual = document.querySelector('.miniatura.ativa');
            const todasMiniaturas = document.querySelectorAll('.miniatura');
            const indexAtual = Array.from(todasMiniaturas).indexOf(ativaAtual);
            
            if (diff > 0 && indexAtual > 0) {
                // Swipe direita -> imagem anterior
                todasMiniaturas[indexAtual - 1].click();
            } else if (diff < 0 && indexAtual < todasMiniaturas.length - 1) {
                // Swipe esquerda -> próxima imagem
                todasMiniaturas[indexAtual + 1].click();
            }
        }
    });
}

// Função para exibir erro
function showError(message) {
    const contentDiv = document.getElementById('veiculo-content');
    const skeletonDiv = document.getElementById('skeleton-loader');
    const similaresSection = document.getElementById('veiculos-similares');
    
    if (skeletonDiv) skeletonDiv.style.display = 'none';
    if (similaresSection) similaresSection.style.display = 'none';
    
    if (contentDiv) {
        contentDiv.style.display = 'block';
        contentDiv.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 60px 20px; background: white; border-radius: 16px;">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <h2 style="margin-top: 20px;">Ops! Algo deu errado</h2>
                <p style="margin: 16px 0; color: var(--gray-600);">${message}</p>
                <a href="catalogo.html" class="btn btn-primary btn-lg">Voltar ao Catálogo</a>
            </div>
        `;
    }
}