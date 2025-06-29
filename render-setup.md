# ☁️ Configuração do Render

## Passos para configurar o Render para deploy automático

### 1. Criar conta no Render

1. Acesse https://render.com
2. Clique em "Get Started"
3. Faça login com GitHub (recomendado)
4. Complete o cadastro

### 2. Conectar repositório GitHub

1. No dashboard do Render, clique em **"New +"**
2. Selecione **"Web Service"**
3. Clique em **"Connect account"** se ainda não conectou o GitHub
4. Selecione seu repositório da lista

### 3. Configurar Web Service

Configure o serviço com os seguintes parâmetros:

#### Informações Básicas:
- **Name**: `tarefas-api` (ou nome desejado)
- **Environment**: `Docker`
- **Region**: Escolha a mais próxima (ex: Oregon)
- **Branch**: `main`
- **Root Directory**: Deixe vazio (raiz do repositório)

#### Configurações Avançadas:
- **Build Command**: Deixe vazio (usará Dockerfile)
- **Start Command**: Deixe vazio (usará CMD do Dockerfile)
- **Health Check Path**: `/health`

### 4. Configurar variáveis de ambiente

Adicione as seguintes variáveis de ambiente:

```env
NODE_ENV=production
PORT=3000
DB_HOST=seu_host_do_banco
DB_PORT=3306
DB_USER=seu_usuario_do_banco
DB_PASSWORD=sua_senha_do_banco
DB_NAME=seu_nome_do_banco
BETTERSTACK_SOURCE_TOKEN=seu_token_betterstack
```

### 5. Configurações de deploy

- **Auto-Deploy**: ✅ Habilitado
- **Deploy on Push**: ✅ Habilitado
- **Deploy on Pull Request**: ❌ Desabilitado (opcional)

### 6. Obter API Key e Service ID

#### API Key:
1. Vá em **Account Settings** > **API Keys**
2. Clique em **"New API Key"**
3. Dê um nome (ex: "GitHub Actions")
4. Copie a chave gerada

#### Service ID:
1. No dashboard do seu serviço
2. A URL será algo como: `https://dashboard.render.com/web/srv-abc123def456`
3. O Service ID é: `srv-abc123def456`

### 7. Configurar secrets no GitHub

Adicione os seguintes secrets no seu repositório GitHub:

```bash
RENDER_API_KEY=sua_api_key_aqui
RENDER_SERVICE_ID=srv-abc123def456
```

### 8. Configurar banco de dados

#### Opção 1: Banco externo (recomendado)
- **PlanetScale**: MySQL gerenciado
- **Railway**: MySQL/PostgreSQL
- **Supabase**: PostgreSQL
- **AWS RDS**: MySQL/PostgreSQL

#### Opção 2: Banco no Render
1. Crie um **PostgreSQL** ou **MySQL** no Render
2. Use as credenciais fornecidas
3. Configure as variáveis de ambiente

### 9. Verificar deploy

Após a configuração:

1. O primeiro deploy será automático
2. Monitore o progresso no dashboard do Render
3. Verifique os logs se houver problemas
4. Teste a URL pública gerada

### 10. URLs importantes

- **Dashboard**: https://dashboard.render.com
- **Seu serviço**: https://seu-servico.onrender.com
- **Health check**: https://seu-servico.onrender.com/health
- **Documentação**: https://seu-servico.onrender.com/api-docs

### 11. Monitoramento

#### Logs:
- Acesse o dashboard do serviço
- Vá na aba **"Logs"**
- Monitore logs em tempo real

#### Métricas:
- **CPU Usage**: Monitoramento de CPU
- **Memory Usage**: Uso de memória
- **Request Count**: Número de requisições

### 12. Troubleshooting

#### Deploy falha:
1. Verifique os logs no Render
2. Confirme se o Dockerfile está correto
3. Verifique se as variáveis de ambiente estão configuradas
4. Teste localmente com `docker-compose up`

#### API não responde:
1. Verifique se o serviço está "Live"
2. Teste o health check: `/health`
3. Verifique se o banco de dados está acessível
4. Confirme se as credenciais do banco estão corretas

#### Erro de conexão com banco:
1. Verifique se o banco está acessível publicamente
2. Confirme se as credenciais estão corretas
3. Teste a conexão manualmente
4. Verifique se o banco está ativo

### 13. Comandos úteis

```bash
# Testar API localmente
curl http://localhost:3000/health

# Testar API em produção
curl https://seu-servico.onrender.com/health

# Ver logs do serviço
# (via dashboard do Render)

# Fazer deploy manual
# (via dashboard do Render)
```

### 14. Configurações avançadas

#### Custom Domains:
1. Vá em **Settings** > **Custom Domains**
2. Adicione seu domínio
3. Configure DNS conforme instruções

#### Environment Variables:
- Use variáveis de ambiente para configurações sensíveis
- Nunca commite secrets no código
- Use diferentes valores para dev/prod

#### Health Checks:
- O Render verifica automaticamente o endpoint `/health`
- Configure timeout adequado
- Monitore falhas de health check

---

**Importante**: Mantenha as credenciais do banco de dados seguras e nunca as commite no repositório. 