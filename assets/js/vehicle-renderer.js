// assets/js/vehicle-renderer.js - Versão completa e corrigida

class VehicleRenderer {
    
    // Renderizar card do veículo para catálogo
    static renderCard(vehicle, lazyLoad = true) {
        const fotoUrl = vehicle.fotoPrincipal || 'https://placehold.co/600x400/e9ecef/6c757d?text=Sem+Imagem';
        const km = formatKm(vehicle.quilometragem);
        const ano = vehicle.ano || (vehicle.anomodelo ? vehicle.anomodelo.split('/')[0] : '');
        
        return `
            <div class="card" data-id="${vehicle.idveiculo}">
                <div class="card__image">
                    <img 
                        src="${lazyLoad ? 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 600 400\'%3E%3C/svg%3E' : fotoUrl}"
                        data-src="${fotoUrl}"
                        alt="${vehicle.nomeCompleto || vehicle.marca + ' ' + vehicle.modelo}"
                        loading="lazy"
                        class="${lazyLoad ? 'lazy' : ''}"
                    >
                </div>
                <div class="card__content">
                    <h3 class="card__title">${vehicle.nomeExibicao || vehicle.marca + ' ' + vehicle.modelo}</h3>
                    <div class="card__version">${(vehicle.versao || '').substring(0, 60)}${(vehicle.versao || '').length > 60 ? '...' : ''}</div>
                    <div class="card__specs">
                        <span class="card__spec">📅 ${ano}</span>
                        <span class="card__spec">⚙️ ${vehicle.cambio || 'N/A'}</span>
                        <span class="card__spec">⛽ ${vehicle.combustivel || 'N/A'}</span>
                        <span class="card__spec">📊 ${km}</span>
                    </div>
                    <a href="veiculo.html?id=${vehicle.idveiculo}" class="btn btn-outline--dark btn-sm card__btn">Ver detalhes →</a>
                </div>
            </div>
        `;
    }
    
    // Renderizar skeleton loading para cards
    static renderSkeleton(count = 8) {
        let html = '';
        for (let i = 0; i < count; i++) {
            html += `
                <div class="card skeleton">
                    <div class="skeleton__image"></div>
                    <div class="skeleton__title"></div>
                    <div class="skeleton__text"></div>
                </div>
            `;
        }
        return html;
    }
    
    // Ativar lazy loading das imagens
    static initLazyLoad() {
        const lazyImages = document.querySelectorAll('img.lazy');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            lazyImages.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                }
            });
        }
    }
    
    // Renderizar página de detalhes do veículo
    static renderDetalhes(vehicle) {
        const km = formatKm(vehicle.quilometragem);
        const ano = vehicle.ano || (vehicle.anomodelo ? vehicle.anomodelo.split('/')[0] : '');

        // Galeria de imagens
        const fotos = vehicle.fotos || [];
        const fotosUrl = fotos.length > 0 ? fotos.map(f => f.url) : ['https://placehold.co/1200x800/e9ecef/6c757d?text=Sem+Imagem'];

        // Montar miniaturas
        let thumbsHtml = '';
        fotosUrl.forEach((url, index) => {
            thumbsHtml += `
                <div class="miniatura ${index === 0 ? 'ativa' : ''}" data-image="${url}">
                    <img src="${url}" alt="Foto ${index + 1}" loading="lazy">
                </div>
            `;
        });

        // Opcionais
        let opcionaisHtml = '';
        if (vehicle.opcionais && vehicle.opcionais.length > 0) {
            vehicle.opcionais.slice(0, 20).forEach(op => {
                opcionaisHtml += `<span class="opcional-tag">${this.escapeHtml(op)}</span>`;
            });
            if (vehicle.opcionais.length > 20) {
                opcionaisHtml += `<span class="opcional-tag">+${vehicle.opcionais.length - 20} outros</span>`;
            }
        } else {
            opcionaisHtml = '<span class="opcional-tag">Nenhum opcional informado</span>';
        }

        // Observações
        const observacoes = vehicle.observacoes || 'Sem observações adicionais.';

        // WhatsApp link
        const nomeVeiculo = `${vehicle.marca} ${vehicle.modelo} ${vehicle.versao || ''}`;
        const whatsappMessage = encodeURIComponent(`Olá! Tenho interesse no veículo ${nomeVeiculo} (${vehicle.anoFull || ano}).`);
        const whatsappUrl = `https://wa.me/${CONFIG.STORE.whatsapp}?text=${whatsappMessage}`;

        // Nome completo para exibição
        const nomeCompleto = `${vehicle.marca} ${vehicle.modelo}`;

        return `
            <div class="veiculo-layout">
                <!-- COLUNA ESQUERDA: Galeria de imagens -->
                <div class="veiculo-coluna-imagem">
                    <div class="imagem-principal-container">
                        <img id="imagem-principal" class="imagem-principal" src="${fotosUrl[0]}" alt="${nomeCompleto}">
                    </div>
                    <div class="miniaturas-container">
                        ${thumbsHtml}
                    </div>
                </div>

                <!-- COLUNA DIREITA: Informações do veículo -->
                <div class="veiculo-coluna-info">
                    <h1 class="veiculo-nome">${this.escapeHtml(nomeCompleto)}</h1>
                    <div class="veiculo-versao">${this.escapeHtml(vehicle.versao || 'Sem versão')}</div>

                    <!-- Especificações principais -->
                    <div class="specs-grid">
                        <div class="spec-item">
                            <div class="spec-label">📅 Ano</div>
                            <div class="spec-value">${this.escapeHtml(vehicle.anoFull || ano)}</div>
                        </div>
                        <div class="spec-item">
                            <div class="spec-label">⚙️ Câmbio</div>
                            <div class="spec-value">${this.escapeHtml(vehicle.cambio || 'N/A')}</div>
                        </div>
                        <div class="spec-item">
                            <div class="spec-label">⛽ Combustível</div>
                            <div class="spec-value">${this.escapeHtml(vehicle.combustivel || 'N/A')}</div>
                        </div>
                        <div class="spec-item">
                            <div class="spec-label">📊 Quilometragem</div>
                            <div class="spec-value">${km}</div>
                        </div>
                        <div class="spec-item">
                            <div class="spec-label">🚪 Portas</div>
                            <div class="spec-value">${this.escapeHtml(vehicle.numeroportas || 'N/A')}</div>
                        </div>
                        <div class="spec-item">
                            <div class="spec-label">🎨 Cor</div>
                            <div class="spec-value">${this.escapeHtml(vehicle.cor || 'N/A')}</div>
                        </div>
                    </div>

                    <!-- Placa -->
                    <div class="placa-item">
                        <span class="placa-label">Placa do Veículo</span>
                        <span class="placa-valor">${this.escapeHtml(vehicle.placaMascarada || '***-****')}</span>
                    </div>

                    <!-- Botão de Ação -->
                    <a href="${whatsappUrl}" target="_blank" class="btn-whatsapp-detalhes">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                        </svg>
                        Tenho interesse - Falar com consultor
                    </a>

                    <!-- Descrição rápida -->
                    <div class="veiculo-descricao-rapida">
                        Veículo em excelente estado, pronto para negociação. Entre em contato para agendar uma visita ou test drive.
                    </div>
                </div>
            </div>

            <!-- Opcionais -->
            <div class="veiculo-opcionais">
                <h3>✨ Opcionais e Itens de Série</h3>
                <div class="opcionais-lista">
                    ${opcionaisHtml}
                </div>
            </div>

            <!-- Observações -->
            <div class="veiculo-observacoes">
                <h3>📝 Observações do Vendedor</h3>
                <div class="observacoes-texto">${this.escapeHtml(observacoes).replace(/\n/g, '<br>')}</div>
            </div>
        `;
    }
    
    // Renderizar veículos similares
    static renderSimilares(vehicles, currentId, currentMarca) {
        const similares = vehicles
            .filter(v => v.idveiculo !== currentId && v.marca === currentMarca)
            .slice(0, 4);
        
        if (similares.length === 0) {
            return '<p style="grid-column: 1/-1; text-align: center; color: var(--gray-500); padding: 40px;">Nenhum veículo similar encontrado.</p>';
        }
        
        return similares.map(v => this.renderCard(v, true)).join('');
    }
    
    // Função auxiliar para escapar HTML e prevenir XSS
    static escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}