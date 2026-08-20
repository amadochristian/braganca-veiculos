$xmlUrl = "https://sistema.autocerto.com/xml/Anuncios?idcliente=6960&cnpj=09498412000178&chave=aut@cert@"

$pastaSite = "C:\Users\VENDEDORES\Documents\GitHub\braganca-veiculos"

$arquivoXml = "$pastaSite\Anuncios.xml"

$arquivoTemp = "$pastaSite\Anuncios_temp.xml"

Write-Host ""
Write-Host "========================================"
Write-Host " ATUALIZADOR DE XML - BRAGANCA VEICULOS"
Write-Host "========================================"
Write-Host ""

try {

    Write-Host "Baixando XML..."

    $headers = @{
        "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
        "Accept" = "application/xml,text/xml,application/xhtml+xml,text/html;q=0.9,*/*;q=0.8"
        "Accept-Language" = "pt-BR,pt;q=0.9"
    }

    Invoke-WebRequest `
        -Uri $xmlUrl `
        -Headers $headers `
        -OutFile $arquivoTemp `
        -MaximumRedirection 5

    Write-Host "Download concluido!"

    # Verifica se o arquivo foi criado
    if (!(Test-Path $arquivoTemp)) {
        throw "O arquivo temporario nao foi criado."
    }

    $tamanho = (Get-Item $arquivoTemp).Length

    Write-Host "Tamanho baixado: $tamanho bytes"

    if ($tamanho -lt 100) {
        throw "O arquivo baixado parece estar vazio ou invalido."
    }

    # Testa se é um XML válido
    Write-Host "Validando XML..."

    [xml]$xmlTeste = Get-Content $arquivoTemp -Raw

    Write-Host "XML valido!"

    # Backup do XML anterior
    if (Test-Path $arquivoXml) {

        $data = Get-Date -Format "yyyyMMdd-HHmmss"

        Copy-Item `
            -Path $arquivoXml `
            -Destination "$pastaSite\backup-Anuncios-$data.xml"

        Write-Host "Backup criado."
    }

    # Substitui o XML
    Move-Item `
        -Path $arquivoTemp `
        -Destination $arquivoXml `
        -Force

    Write-Host ""
    Write-Host "========================================"
    Write-Host " XML ATUALIZADO COM SUCESSO!"
    Write-Host "========================================"

}
catch {

    Write-Host ""
    Write-Host "========================================"
    Write-Host " ERRO AO ATUALIZAR"
    Write-Host "========================================"

    Write-Host ""
    Write-Host $_.Exception.Message
    Write-Host ""

    # Remove temporário caso tenha dado erro
    if (Test-Path $arquivoTemp) {
        Remove-Item $arquivoTemp -Force
    }
}

Write-Host ""
Write-Host "Pressione ENTER para fechar..."
Read-Host