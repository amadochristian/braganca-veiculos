// assets/js/xml-parser.js - Parser de XML para JSON
class XMLParser {
    
    // Método principal para buscar e processar XML
    static async fetchAndParse() {
        try {
            const response = await fetch(CONFIG.XML_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const xmlText = await response.text();
            const vehicles = this.parseXML(xmlText);
            
            // Salvar no cache
            VehicleCache.save(vehicles);
            
            return vehicles;
        } catch (error) {
            console.error('Erro ao carregar XML:', error);
            // Tentar carregar do cache
            const cached = VehicleCache.load();
            if (cached) {
                console.log('Usando dados do cache');
                return cached;
            }
            throw new Error('Não foi possível carregar os veículos e não há cache disponível');
        }
    }
    
    // Parse do XML para array de objetos
    static parseXML(xmlText) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        // Verificar erro de parsing
        if (xmlDoc.querySelector('parsererror')) {
            throw new Error('Erro ao fazer parsing do XML');
        }
        
        const veiculos = xmlDoc.querySelectorAll('veiculo');
        const vehicles = [];
        
        veiculos.forEach(veiculo => {
            const vehicle = {};
            
            // Extrair campos básicos
            vehicle.idveiculo = this.getText(veiculo, 'idveiculo');
            vehicle.tipoveiculo = this.getText(veiculo, 'tipoveiculo');
            vehicle.dataCadastro = this.getText(veiculo, 'dataCadastro');
            vehicle.zerokm = this.getText(veiculo, 'zerokm');
            vehicle.placa = this.getText(veiculo, 'placa');
            vehicle.marca = this.getText(veiculo, 'marca');
            vehicle.modelo = this.getText(veiculo, 'modelo');
            vehicle.versao = this.getText(veiculo, 'versao');
            vehicle.anomodelo = this.getText(veiculo, 'anomodelo');
            vehicle.cambio = this.getText(veiculo, 'cambio');
            vehicle.quilometragem = this.getText(veiculo, 'quilometragem');
            vehicle.numeroportas = this.getText(veiculo, 'numeroportas');
            vehicle.cor = this.getText(veiculo, 'cor');
            vehicle.combustivel = this.getText(veiculo, 'combustivel');
            vehicle.preco = this.getText(veiculo, 'preco');
            vehicle.precodecimal = this.getText(veiculo, 'precodecimal');
            vehicle.observacoes = this.getText(veiculo, 'observacoes');
            vehicle.linkAnuncioSite = this.getText(veiculo, 'linkAnuncioSite');
            vehicle.linkVideo = this.getText(veiculo, 'linkVideo');
            vehicle.DataAtualizacao = this.getText(veiculo, 'DataAtualizacao');
            
            // Extrair opcionais
            const opcionais = [];
            const opcionalNodes = veiculo.querySelectorAll('opcionais opcional');
            opcionalNodes.forEach(node => {
                opcionais.push(node.textContent);
            });
            vehicle.opcionais = opcionais;
            
            // Extrair fotos
            const fotos = [];
            const fotoNodes = veiculo.querySelectorAll('fotos foto');
            fotoNodes.forEach(foto => {
                fotos.push({
                    ordem: this.getText(foto, 'ordem'),
                    url: this.getText(foto, 'url')
                });
            });
            // Ordenar fotos por ordem
            fotos.sort((a, b) => parseInt(a.ordem) - parseInt(b.ordem));
            vehicle.fotos = fotos;
            vehicle.fotoPrincipal = fotos.length > 0 ? fotos[0].url : null;
            
            // Campos calculados
            vehicle.ano = extractYear(vehicle.anomodelo);
            vehicle.anoFull = extractFullYear(vehicle.anomodelo);
            vehicle.placaMascarada = maskPlate(vehicle.placa);
            vehicle.nomeCompleto = `${vehicle.marca} ${vehicle.modelo} ${vehicle.versao}`;
            vehicle.nomeExibicao = `${vehicle.marca} ${vehicle.modelo}`;
            
            vehicles.push(vehicle);
        });
        
        // Ordenar por data de cadastro (mais recentes primeiro)
        vehicles.sort((a, b) => {
            const dateA = this.parseDate(a.dataCadastro);
            const dateB = this.parseDate(b.dataCadastro);
            return dateB - dateA;
        });
        
        return vehicles;
    }
    
    static getText(parent, tagName) {
        const element = parent.querySelector(tagName);
        return element ? element.textContent.trim() : '';
    }
    
    static parseDate(dateStr) {
        if (!dateStr) return 0;
        // Formato: "15/04/2026 09:55:51"
        const parts = dateStr.split(' ');
        if (parts.length < 2) return new Date(dateStr).getTime();
        
        const dateParts = parts[0].split('/');
        const timeParts = parts[1].split(':');
        
        return new Date(
            parseInt(dateParts[2]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[0]),
            parseInt(timeParts[0]),
            parseInt(timeParts[1]),
            parseInt(timeParts[2])
        ).getTime();
    }
}