const axios = require('axios');

const endpoint = process.env.BETTERSTACK_HTTP_ENDPOINT || 'https://in.logs.betterstack.com/2XnDQX5gwYyViuGFNAkamqkB'; // Substitua pelo seu endpoint se não usar .env
axios.post(endpoint, {
  level: 'info',
  message: 'Teste manual de log via script',
  timestamp: new Date().toISOString(),
}).then(() => console.log('Log enviado com sucesso para o BetterStack!'))
  .catch((err) => {
    console.error('Erro ao enviar log para o BetterStack:', err.message);
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
    }
  }); 