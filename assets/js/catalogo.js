// assets/js/catalogo.js - Página de Catálogo
document.addEventListener('DOMContentLoaded', async () => {
    // Elementos
    const gridContainer = document.getElementById('catalogo-grid');
    const emptyState = document.getElementById('empty-state');
    const resultsCount = document.getElementById('results-count');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const resetEmptyFilters = document.getElementById('reset-empty-filters');
    
    // Filtros
    const searchInput = document.getElementById('search-input');
    const filterMarca = document.getElementById('filter-marca');
    const filterCambio = document.getElementById('filter-cambio');
    const filterCombustivel = document.getElementById('filter-combustivel');
    const filterAno = document.getElementById('filter-ano');
    const filterCor = document.getElementById('filter-cor');
    const priceMinSlider = document.getElementById('filter-price-min');
    const priceMaxSlider = document.getElementById('filter-price-max');
    const minPriceLabel = document.getElementById('min-price-label');
    const maxPriceLabel = document.getElementById('max-price-label');
    
    let allVehicles = [];
    let filteredVehicles = [];
    
    // Configurar navbar
    setupNavbar();
    
    try {
        // Carregar veículos
        allVehicles = VehicleCache.load();
        if (!allVehicles) {
            allVehicles = await XMLParser.fetchAndParse();
        } else {
            XMLParser.fetchAndParse().catch(console.error);
        }
        
        // Popular selects de filtro
        populateFilters(allVehicles);
        
        // Atualizar lista
        filteredVehicles = [...allVehicles];
        applyFilters();
        
    } catch (error) {
        console.error('Erro ao carregar catálogo:', error);
        gridContainer.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <h3>Erro ao carregar veículos</h3>
                <p>Tente novamente mais tarde.</p>
            </div>
        `;
    }
    
    // Event listeners dos filtros
    searchInput.addEventListener('input', debounce(applyFilters, 300));
    filterMarca.addEventListener('change', applyFilters);
    filterCambio.addEventListener('change', applyFilters);
    filterCombustivel.addEventListener('change', applyFilters);
    filterAno.addEventListener('change', applyFilters);
    filterCor.addEventListener('change', applyFilters);
    priceMinSlider.addEventListener('input', (e) => {
        minPriceLabel.textContent = parseInt(e.target.value).toLocaleString();
        applyFilters();
    });
    priceMaxSlider.addEventListener('input', (e) => {
        maxPriceLabel.textContent = parseInt(e.target.value).toLocaleString();
        applyFilters();
    });
    clearFiltersBtn.addEventListener('click', clearAllFilters);
    if (resetEmptyFilters) resetEmptyFilters.addEventListener('click', clearAllFilters);
    
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedMarca = filterMarca.value;
        const selectedCambio = filterCambio.value;
        const selectedCombustivel = filterCombustivel.value;
        const selectedAno = filterAno.value;
        const selectedCor = filterCor.value;
        const minPrice = parseInt(priceMinSlider.value);
        const maxPrice = parseInt(priceMaxSlider.value);
        
        filteredVehicles = allVehicles.filter(vehicle => {
            // Busca textual
            if (searchTerm) {
                const searchText = `${vehicle.marca} ${vehicle.modelo} ${vehicle.versao} ${vehicle.nomeCompleto}`.toLowerCase();
                if (!searchText.includes(searchTerm)) return false;
            }
            
            // Marca
            if (selectedMarca && vehicle.marca !== selectedMarca) return false;
            
            // Câmbio
            if (selectedCambio && vehicle.cambio !== selectedCambio) return false;
            
            // Combustível
            if (selectedCombustivel && vehicle.combustivel !== selectedCombustivel) return false;
            
            // Ano
            if (selectedAno && vehicle.ano !== selectedAno && !vehicle.anomodelo?.includes(selectedAno)) return false;
            
            // Cor
            if (selectedCor && vehicle.cor !== selectedCor) return false;
            
            // Preço
            const price = vehicle.precodecimal ? parseInt(vehicle.precodecimal) : 0;
            if (price < minPrice || price > maxPrice) return false;
            
            return true;
        });
        
        // Ordenar por menor preço
        filteredVehicles.sort((a, b) => {
            const priceA = a.precodecimal ? parseInt(a.precodecimal) : 0;
            const priceB = b.precodecimal ? parseInt(b.precodecimal) : 0;
            return priceA - priceB;
        });
        
        updateResults();
    }
    
    function updateResults() {
        // Atualizar contador
        resultsCount.textContent = `${filteredVehicles.length} veículo${filteredVehicles.length !== 1 ? 's' : ''} encontrado${filteredVehicles.length !== 1 ? 's' : ''}`;
        
        // Mostrar/ocultar empty state
        if (filteredVehicles.length === 0) {
            gridContainer.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }
        
        gridContainer.style.display = 'grid';
        emptyState.style.display = 'none';
        
        // Renderizar cards com skeleton
        gridContainer.innerHTML = VehicleRenderer.renderSkeleton(Math.min(filteredVehicles.length, 8));
        
        // Pequeno delay para simular carregamento
        setTimeout(() => {
            gridContainer.innerHTML = filteredVehicles.map(v => VehicleRenderer.renderCard(v, true)).join('');
            VehicleRenderer.initLazyLoad();
        }, 100);
    }
    
    function clearAllFilters() {
        searchInput.value = '';
        filterMarca.value = '';
        filterCambio.value = '';
        filterCombustivel.value = '';
        filterAno.value = '';
        filterCor.value = '';
        priceMinSlider.value = '0';
        priceMaxSlider.value = '200000';
        minPriceLabel.textContent = '0';
        maxPriceLabel.textContent = (200000).toLocaleString();
        applyFilters();
    }
    
    function populateFilters(vehicles) {
        // Marcas
        const marcas = [...new Set(vehicles.map(v => v.marca))].sort();
        marcas.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca;
            option.textContent = marca;
            filterMarca.appendChild(option);
        });
        
        // Câmbios
        const cambios = [...new Set(vehicles.map(v => v.cambio))].sort();
        cambios.forEach(cambio => {
            const option = document.createElement('option');
            option.value = cambio;
            option.textContent = cambio;
            filterCambio.appendChild(option);
        });
        
        // Combustíveis
        const combustiveis = [...new Set(vehicles.map(v => v.combustivel))].sort();
        combustiveis.forEach(comb => {
            const option = document.createElement('option');
            option.value = comb;
            option.textContent = comb;
            filterCombustivel.appendChild(option);
        });
        
        // Anos
        const anos = [...new Set(vehicles.map(v => v.ano).filter(a => a))].sort((a,b) => b - a);
        anos.forEach(ano => {
            const option = document.createElement('option');
            option.value = ano;
            option.textContent = ano;
            filterAno.appendChild(option);
        });
        
        // Cores
        const cores = [...new Set(vehicles.map(v => v.cor))].sort();
        cores.forEach(cor => {
            const option = document.createElement('option');
            option.value = cor;
            option.textContent = cor;
            filterCor.appendChild(option);
        });
    }
});