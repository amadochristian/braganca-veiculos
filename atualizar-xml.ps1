# ==============================
# CONFIGURAÇÕES
# ==============================

$xmlUrl = "https://sistema.autocerto.com/xml/Anuncios?idcliente=6960&cnpj=09498412000178&chave=aut@cert@"
$pastaSite = "C:\Users\VENDEDORES\Documents\GitHub\braganca-veiculos"
$arquivoXml = "C:\Users\VENDEDORES\Documents\GitHub\braganca-veiculos\Anuncios.xml"

# ==============================
# BAIXAR XML
# ==============================

try {
    Write-Host "Baixando XML..."

    Invoke-WebRequest `
        -Uri $xmlUrl `
        -OutFile "$arquivoXml.tmp" `
        -UseBasicParsing

    # Verifica se o arquivo realmente é um XML válido
    [xml]$xmlTeste = Get-Content "$arquivoXml.tmp"

    # Se chegou aqui, o XML é válido
    Move-Item "$arquivoXml.tmp" $arquivoXml -Force

    Write-Host "XML atualizado com sucesso."
}
catch {
    Write-Host "ERRO ao atualizar XML:"
    Write-Host $_

    if (Test-Path "$arquivoXml.tmp") {
        Remove-Item "$arquivoXml.tmp" -Force
    }

    exit 1
}

# ==============================
# GIT
# ==============================

Set-Location $pastaSite

git add Anuncios.xml

# Verifica se houve alteração
$alteracoes = git status --porcelain

if ($alteracoes) {

    $data = Get-Date -Format "yyyy-MM-dd HH:mm"

    git commit -m "Atualização automática do XML - $data"

    git push

    Write-Host "Git atualizado com sucesso."

} else {

    Write-Host "Nenhuma alteração no XML."

}