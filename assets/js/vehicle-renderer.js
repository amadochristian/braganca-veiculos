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
                    <a href="veiculo.html?id=${vehicle.idveiculo}" class="btn btn-outline--dark btn-sm card__btn">Ver mais →</a>
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

        // Link para a página de obrigado (resumo do veículo + redirecionamento automático ao WhatsApp)
        const nomeVeiculo = `${vehicle.marca} ${vehicle.modelo} ${vehicle.versao || ''}`.trim();
        const thankYouParams = new URLSearchParams({
            nome: nomeVeiculo,
            ano: vehicle.anoFull || ano,
            cor: vehicle.cor || '',
            cambio: vehicle.cambio || '',
            km: km,
            url: window.location.href,
        });
        const whatsappUrl = `obrigado-veiculo.html?${thankYouParams.toString()}`;

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
                    <div class="veiculo-status-badge">
                        <span class="veiculo-status-badge__dot"></span>
                        Disponível para visita
                    </div>

                    <h1 class="veiculo-nome">${this.escapeHtml(nomeCompleto)}</h1>
                    <div class="veiculo-versao">${this.escapeHtml(vehicle.versao || 'Sem versão')}</div>

                    <!-- Destaques rápidos -->
                    <div class="veiculo-highlights">
                        <span>✅ Revisado e com garantia</span>
                        <span>📄 Procedência verificada</span>
                        <span>💳 Financiamento facilitado</span>
                    </div>

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
                        Quero esse carro - Falar com consultor
                    </a>
                    <div class="veiculo-cta-nota">🔒 Atendimento humano · Resposta rápida pelo WhatsApp</div>

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

            <!-- Por que comprar na Bragança Veículos -->
            <div class="veiculo-trust">
                <div class="veiculo-trust-item">
                    <div class="veiculo-trust-item__icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <h4>Garantia</h4>
                    <p>Veículos revisados e com garantia para sua tranquilidade</p>
                </div>
                <div class="veiculo-trust-item">
                    <div class="veiculo-trust-item__icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                    </div>
                    <h4>Procedência</h4>
                    <p>Documentação em dia e histórico transparente</p>
                </div>
                <div class="veiculo-trust-item">
                    <div class="veiculo-trust-item__icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10h18M6 10V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4M4 10h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8Z"/></svg>
                    </div>
                    <h4>Financiamento facilitado</h4>
                    <p>Mais de 16 bancos parceiros disputando a melhor condição</p>
                </div>
                <div class="veiculo-trust-item">
                    <div class="veiculo-trust-item__icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <h4>Atendimento</h4>
                    <p>Equipe dedicada para te ajudar a fechar o melhor negócio</p>
                </div>
            </div>

            <!-- CTA final -->
            <div class="veiculo-cta-banner">
                <div class="veiculo-cta-banner__content">
                    <h2>Gostou do ${this.escapeHtml(nomeCompleto)}?</h2>
                    <p>Fale agora com um consultor e garanta condições exclusivas antes que esse veículo saia do estoque.</p>
                    <div class="veiculo-cta-banner__buttons">
                        <a href="${whatsappUrl}" target="_blank" class="btn btn-whatsapp btn-lg">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            Falar no WhatsApp agora
                        </a>
                        <a href="catalogo.html" class="btn btn-outline btn-lg">Ver outros veículos</a>
                    </div>
                </div>
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