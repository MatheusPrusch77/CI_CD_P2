# 🔧 Correção CORS no Swagger UI

## Problema
```
Failed to fetch.
Possible Reasons:
- CORS
- Network Failure
- URL scheme must be "http" or "https" for CORS request.
```

## Soluções Aplicadas

### 1. ✅ CORS Configurado Corretamente

**Arquivo**: `backend/server.js`

```javascript
app.use(cors({
  origin: isRender ? [
    'https://backendapicicd.onrender.com',
    'https://*.onrender.com',
    'http://localhost:3000',
    'http://localhost:8080',
    'http://localhost:3001',
    process.env.FRONTEND_URL
  ].filter(Boolean) : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

### 2. ✅ Swagger Configurado para Render

**Arquivo**: `backend/config/swagger.js`

- Detecta automaticamente o ambiente
- Adiciona servidor do Render em produção
- Configura URLs corretas

### 3. ✅ Swagger UI Otimizado

**Arquivo**: `backend/server.js`

- Configurações específicas para o Swagger UI
- Endpoint JSON separado
- Validação desabilitada para evitar CORS

## Teste da Correção

### 1. Faça Commit e Push
```bash
git add .
git commit -m "fix: corrige CORS para Swagger UI no Render"
git push origin main
```

### 2. Aguarde o Deploy
- GitHub Actions cria nova versão
- Docker Hub recebe nova imagem
- Render faz deploy automático

### 3. Teste o Swagger
Acesse: `https://backendapicicd.onrender.com/api-docs`

### 4. Verifique os Endpoints
No Swagger UI, teste:

1. **GET /health** - Health check
2. **GET /** - Rota raiz
3. **GET /tarefas** - Listar tarefas
4. **POST /tarefas** - Criar tarefa

## Troubleshooting

### Se ainda der erro CORS:

1. **Verifique a URL**: Use `https://backendapicicd.onrender.com/api-docs`
2. **Limpe o cache**: Ctrl+F5 no navegador
3. **Teste em aba anônima**: Para evitar cache

### Se der erro de rede:

1. **Verifique se a API está rodando**: `https://backendapicicd.onrender.com/health`
2. **Confirme o deploy**: Render Dashboard → Logs
3. **Teste endpoints diretos**: Use Postman ou curl

### Se o Swagger não carregar:

1. **Verifique o JSON**: `https://backendapicicd.onrender.com/api-docs/swagger.json`
2. **Confirme as rotas**: Verifique se as rotas estão documentadas
3. **Teste localmente**: `http://localhost:3000/api-docs`

## Comandos de Teste

### Teste direto da API:
```bash
# Health check
curl https://backendapicicd.onrender.com/health

# Listar tarefas
curl https://backendapicicd.onrender.com/tarefas

# Swagger JSON
curl https://backendapicicd.onrender.com/api-docs/swagger.json
```

### Teste do Swagger UI:
1. Acesse: `https://backendapicicd.onrender.com/api-docs`
2. Clique em "Try it out" em qualquer endpoint
3. Execute a requisição
4. Verifique a resposta

## Resultado Esperado

Após a correção:
- ✅ Swagger UI carrega sem erros
- ✅ Endpoints funcionam corretamente
- ✅ Sem erros de CORS
- ✅ Documentação completa disponível

A correção deve resolver o problema de CORS no Swagger UI! 🚀 