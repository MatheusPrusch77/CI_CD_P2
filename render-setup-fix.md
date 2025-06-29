# 🔧 Correção do Deploy no Render

## Problema
```
error: Erro ao inicializar servidor {"error":"SSL/TLS required","service":"tarefas-api","timestamp":"2025-06-28T00:38:43.587Z"}
```

## Causa
O Render está exigindo SSL/TLS, mas a aplicação não estava configurada para detectar e lidar com o ambiente do Render.

## Soluções Aplicadas

### 1. ✅ Configurações do Servidor Atualizadas

**Arquivo**: `backend/server.js`

- **Detecção do Render**: `const isRender = process.env.RENDER === 'true'`
- **CORS configurado**: Para aceitar requisições HTTPS do Render
- **Helmet configurado**: Políticas de segurança específicas para o Render
- **Bind address**: `0.0.0.0` para aceitar conexões externas
- **SSL detection**: Detecta automaticamente se está usando HTTPS

### 2. ✅ Variável de Ambiente Adicionada

**Workflow**: `.github/workflows/ci-cd.yml`

```yaml
{
  "key": "RENDER",
  "value": "true"
}
```

### 3. ✅ Configurações Específicas do Render

- **CORS**: Aceita `https://*.onrender.com`
- **Helmet**: Políticas de segurança relaxadas para o Render
- **SSL**: Detecta automaticamente `x-forwarded-proto: https`

## Verificação no Render

### 1. Acesse o Dashboard do Render
- Vá para: https://dashboard.render.com
- Selecione seu serviço `tarefas-api`

### 2. Verifique as Variáveis de Ambiente
- **NODE_ENV**: `production`
- **RENDER**: `true` ✅ NOVO
- **DB_HOST**: Seu host do banco
- **DB_PORT**: Seu port do banco
- **DB_USER**: Seu usuário do banco
- **DB_PASSWORD**: Sua senha do banco
- **DB_NAME**: Seu nome do banco
- **BETTERSTACK_SOURCE_TOKEN**: Seu token do BetterStack

### 3. Verifique a Configuração do Serviço
- **Environment**: `Docker`
- **Region**: Sua região preferida
- **Branch**: `main`
- **Auto-Deploy**: Habilitado

## Teste da Correção

### 1. Faça Commit e Push
```bash
git add .
git commit -m "fix: adiciona suporte SSL/TLS para Render"
git push origin main
```

### 2. Monitore o Deploy
- GitHub Actions: Deve criar nova versão
- Docker Hub: Nova imagem publicada
- Render: Deploy automático iniciado

### 3. Verifique os Logs
- Render Dashboard → Seu serviço → Logs
- Deve mostrar: `🔒 Render detectado - SSL/TLS habilitado`

## Endpoints para Testar

Após o deploy, teste:

1. **Health Check**: `https://tarefas-api.onrender.com/health`
2. **API Root**: `https://tarefas-api.onrender.com/`
3. **Swagger Docs**: `https://tarefas-api.onrender.com/api-docs`
4. **Tarefas**: `https://tarefas-api.onrender.com/tarefas`

## Troubleshooting

### Se ainda der erro SSL:
1. Verifique se `RENDER=true` está nas variáveis de ambiente
2. Confirme que a nova imagem foi publicada no Docker Hub
3. Force um novo deploy no Render

### Se der erro de CORS:
1. Verifique se o frontend está usando HTTPS
2. Confirme se a URL do frontend está nas configurações CORS

### Se der erro de banco:
1. Verifique se as variáveis do banco estão corretas
2. Confirme se o banco está acessível do Render

## Próximos Passos

1. ✅ Commit e push das correções
2. ✅ Aguardar deploy automático
3. ✅ Testar endpoints
4. ✅ Verificar logs do Render
5. ✅ Confirmar funcionamento

A correção deve resolver o erro SSL/TLS e permitir que a aplicação funcione corretamente no Render! 🚀 