# Como conectar o formulário ao Google Sheets (novo, do zero)

Sem notificações automáticas — a planilha só recebe os dados, como pedido.

## 1. Crie a planilha

1. Acesse [sheets.google.com](https://sheets.google.com) e crie uma planilha nova.
2. Renomeie a primeira aba para `Agendamentos`.
3. Na linha 1, crie as colunas nesta ordem:

   `Nome | WhatsApp | Dia | Horário | Data do cadastro | UTM Source | UTM Medium | UTM Campaign | UTM Content | UTM Term | Página`

## 2. Crie o Apps Script

1. Na planilha, vá em **Extensões → Apps Script**.
2. Apague o conteúdo padrão e cole o código abaixo:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Agendamentos');
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.nome || '',
    data.whatsapp || '',
    data.dia || '',
    data.horario || '',
    data.data_cadastro || new Date().toISOString(),
    data.utm_source || '',
    data.utm_medium || '',
    data.utm_campaign || '',
    data.utm_content || '',
    data.utm_term || '',
    data.pagina || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Use esta função para testar pelo editor (botão "Executar"), nunca a doPost
// diretamente: rodar doPost sem uma requisição real deixa "e" undefined e
// quebra em "Cannot read properties of undefined (reading 'postData')".
function testDoPost() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        nome: 'Teste',
        whatsapp: '(11) 99999-9999',
        dia: 'Quinta-feira, 23/07',
        horario: '10h',
        data_cadastro: new Date().toISOString(),
        pagina: 'teste-manual',
      }),
    },
  };
  doPost(fakeEvent);
}
```

3. Salve o projeto (ex: nome "Open Garage - Recebimento").

## 3. Publique como Web App

1. Clique em **Implantar → Nova implantação**.
2. Tipo: **App da Web**.
3. Configuração:
   - **Executar como:** Eu (sua conta)
   - **Quem pode acessar:** Qualquer pessoa
4. Clique em **Implantar** e autorize as permissões pedidas pelo Google.
5. Copie a **URL do app da Web** gerada (algo como `https://script.google.com/macros/s/AKfycb.../exec`).

## 4. Cole a URL no site

Abra o arquivo `script.js` e substitua a linha:

```javascript
SHEETS_WEBAPP_URL: 'https://script.google.com/macros/s/SEU_ID_AQUI/exec',
```

pela URL copiada no passo anterior.

## 5. Teste

1. Publique o site (ou abra `index.html` localmente).
2. Preencha o formulário e envie.
3. Confira se uma nova linha apareceu na aba `Agendamentos`.

> Observação: como o navegador envia os dados em modo `no-cors`, o site não consegue ler a resposta do Google — por isso o redirecionamento para a página de agradecimento acontece assim que o envio é disparado, sem esperar confirmação. Se quiser ter certeza de que está tudo certo, faça o teste do passo 5 acima.

## Sempre que precisar reimplantar (editar o script depois)

Se você alterar o código do Apps Script depois de já ter uma URL publicada, use **Implantar → Gerenciar implantações → editar (ícone de lápis) → Nova versão → Implantar**, para manter a mesma URL ativa.
