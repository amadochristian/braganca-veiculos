// assets/js/vehicle-cache.js - Sistema de Cache Local
class VehicleCache {
    
    // Salvar veículos no localStorage
    static save(vehicles) {
        try {
            localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(vehicles));
            localStorage.setItem(CONFIG.CACHE_TIMESTAMP_KEY, Date.now().toString());
            console.log('Cache salvo com sucesso');
        } catch (error) {
            console.error('Erro ao salvar cache:', error);
        }
    }
    
    // Carregar veículos do localStorage
    static load() {
        try {
            const cached = localStorage.getItem(CONFIG.CACHE_KEY);
            const timestamp = localStorage.getItem(CONFIG.CACHE_TIMESTAMP_KEY);
            
            if (!cached) return null;
            
            // Verificar se o cache expirou
            if (timestamp && this.isCacheExpired(parseInt(timestamp))) {
                console.log('Cache expirado');
                return null;
            }
            
            const vehicles = JSON.parse(cached);
            console.log(`Cache carregado: ${vehicles.length} veículos`);
            return vehicles;
        } catch (error) {
            console.error('Erro ao carregar cache:', error);
            return null;
        }
    }
    
    // Verificar se o cache expirou
    static isCacheExpired(timestamp) {
        return (Date.now() - timestamp) > CONFIG.CACHE_DURATION;
    }
    
    // Limpar cache
    static clear() {
        localStorage.removeItem(CONFIG.CACHE_KEY);
        localStorage.removeItem(CONFIG.CACHE_TIMESTAMP_KEY);
        console.log('Cache limpo');
    }
    
    // Verificar se há cache válido
    static hasValidCache() {
        const cached = localStorage.getItem(CONFIG.CACHE_KEY);
        const timestamp = localStorage.getItem(CONFIG.CACHE_TIMESTAMP_KEY);
        return cached && timestamp && !this.isCacheExpired(parseInt(timestamp));
    }
}