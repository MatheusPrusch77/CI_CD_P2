# 🔧 Correção da Configuração do Render

## Problema
```
error: could not find /opt/render/project/src/.backend: stat /opt/render/project/src/.backend: no such file or directory
```

## Causa
O Render está configurado incorretamente, procurando por um diretório `.backend` que não existe.

## Solução: Configuração Correta no Render

### 1. Acesse o Dashboard do Render
- Vá para: https://dashboard.render.com
- Selecione seu serviço `tarefas-api`

### 2. Vá em "Settings" (Configurações)

### 3. Configure as seguintes opções:

#### ✅ Build & Deploy Settings:
- **Environment**: `Docker`
- **Region**: Sua região preferida
- **Branch**: `main`
- **Root Directory**: `/` (deixe vazio ou `/`)
- **Dockerfile Path**: `backend/Dockerfile`
- **Build Command**: **DEIXE VAZIO**
- **Start Command**: **DEIXE VAZIO**

#### ❌ Configurações INCORRETAS (não use):
- Root Directory: `/backend` ❌
- Root Directory: `.backend` ❌
- Build Command: `cd backend && npm install` ❌
- Start Command: `cd backend && npm start` ❌

### 4. Variáveis de Ambiente
Verifique se estas variáveis estão configuradas:

```
NODE_ENV=production
RENDER=true
DB_HOST=seu_host_do_banco
DB_PORT=5432
DB_USER=seu_usuario_do_banco
DB_PASSWORD=sua_senha_do_banco
DB_NAME=seu_nome_do_banco
BETTERSTACK_SOURCE_TOKEN=seu_token_betterstack
```

### 5. Salve as Configurações
- Clique em "Save Changes"
- O Render vai fazer um novo deploy automaticamente

## Estrutura Correta do Projeto

```
cicd/ (repositório raiz)
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── backend/
│   ├── Dockerfile          ← Render usa este
│   ├── server.js
│   ├── package.json
│   └── ...
├── screens/
├── services/
└── ...
```

## Como o Dockerfile Funciona

O Dockerfile em `backend/Dockerfile` já está configurado corretamente:

```dockerfile
# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código da aplicação
COPY . .

# Comando para iniciar a aplicação
CMD ["node", "server.js"]
```

## Verificação

### 1. Após salvar as configurações:
- O Render vai fazer um novo deploy
- Monitore os logs para ver se o erro foi resolvido

### 2. Logs esperados:
```
🚀 Servidor rodando na porta 3000
🌍 Ambiente: production
🔒 Render detectado - SSL/TLS habilitado
```

### 3. Teste os endpoints:
- `https://tarefas-api.onrender.com/health`
- `https://tarefas-api.onrender.com/`
- `https://tarefas-api.onrender.com/api-docs`

## Troubleshooting

### Se ainda der erro:
1. **Force um novo deploy**: Render Dashboard → Manual Deploy
2. **Verifique os logs**: Render Dashboard → Logs
3. **Confirme as configurações**: Root Directory deve ser `/`

### Se der erro de banco:
1. Verifique se as variáveis do banco estão corretas
2. Confirme se o banco está acessível do Render

### Se der erro de dependências:
1. O Dockerfile já instala as dependências automaticamente
2. Não precisa de Build Command manual

## Resumo da Configuração Correta

- ✅ **Root Directory**: `/` (raiz do repositório)
- ✅ **Dockerfile Path**: `backend/Dockerfile`
- ✅ **Build Command**: Vazio (usa Dockerfile)
- ✅ **Start Command**: Vazio (usa Dockerfile)
- ✅ **Environment**: Docker

Esta configuração deve resolver o erro de diretório não encontrado! 🚀 