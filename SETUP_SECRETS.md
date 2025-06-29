# Configuração de Secrets - GitHub Actions

Este guia explica como configurar todos os secrets necessários para o pipeline CI/CD funcionar corretamente.

## 🔐 Secrets Necessários

### 1. Docker Hub
- **DOCKER_USERNAME**: Seu nome de usuário no Docker Hub
- **DOCKER_PASSWORD**: Sua senha ou token de acesso do Docker Hub

**Como obter:**
1. Acesse https://hub.docker.com
2. Faça login na sua conta
3. Vá em Account Settings > Security
4. Crie um Access Token
5. Use o token como DOCKER_PASSWORD

### 2. Render
- **RENDER_API_KEY**: Chave da API do Render
- **RENDER_SERVICE_ID**: ID do serviço criado no Render

**Como obter:**
1. Acesse https://render.com
2. Faça login na sua conta
3. Vá em Account Settings > API Keys
4. Crie uma nova API Key
5. Para o SERVICE_ID, crie um serviço no Render e copie o ID da URL

### 3. Banco de Dados
- **DB_HOST**: Host do banco de dados (ex: db.example.com)
- **DB_PORT**: Porta do banco (geralmente 3306)
- **DB_USER**: Usuário do banco de dados
- **DB_PASSWORD**: Senha do banco de dados
- **DB_NAME**: Nome do banco de dados

**Opções de banco:**
- **PlanetScale**: Banco MySQL gerenciado
- **Railway**: Banco MySQL/PostgreSQL
- **Supabase**: Banco PostgreSQL
- **AWS RDS**: Banco MySQL/PostgreSQL

### 4. BetterStack
- **BETTERSTACK_SOURCE_TOKEN**: Token do stream de logs

**Como obter:**
1. Acesse https://betterstack.com
2. Faça login na sua conta
3. Crie um novo Log Source
4. Copie o Source Token

### 5. Email (para notificações)
- **EMAIL_USERNAME**: Seu email Gmail
- **EMAIL_PASSWORD**: Senha de app do Gmail (não a senha normal)
- **NOTIFICATION_EMAIL**: Email para receber notificações de erro

**Como configurar Gmail:**
1. Ative a verificação em duas etapas
2. Vá em Segurança > Senhas de app
3. Gere uma senha para "GitHub Actions"
4. Use essa senha como EMAIL_PASSWORD

## ⚙️ Como Configurar no GitHub

### Via Interface Web:

1. Acesse seu repositório no GitHub
2. Vá em **Settings** > **Secrets and variables** > **Actions**
3. Clique em **New repository secret**
4. Adicione cada secret com o nome e valor corretos

### Via GitHub CLI:

```bash
# Instalar GitHub CLI
# https://cli.github.com/

# Fazer login
gh auth login

# Adicionar secrets
gh secret set DOCKER_USERNAME --body "seu_usuario_docker"
gh secret set DOCKER_PASSWORD --body "sua_senha_docker"
gh secret set RENDER_API_KEY --body "sua_api_key_render"
gh secret set RENDER_SERVICE_ID --body "id_do_servico_render"
gh secret set DB_HOST --body "host_do_banco"
gh secret set DB_PORT --body "3306"
gh secret set DB_USER --body "usuario_do_banco"
gh secret set DB_PASSWORD --body "senha_do_banco"
gh secret set DB_NAME --body "nome_do_banco"
gh secret set BETTERSTACK_SOURCE_TOKEN --body "seu_token_betterstack"
gh secret set EMAIL_USERNAME --body "seu_email@gmail.com"
gh secret set EMAIL_PASSWORD --body "sua_senha_app_gmail"
gh secret set NOTIFICATION_EMAIL --body "email_notificacoes@exemplo.com"
```

## 🔍 Verificar Configuração

### Listar secrets configurados:

```bash
gh secret list
```

### Testar pipeline:

1. Faça um push para a branch main
2. Vá em **Actions** no GitHub
3. Verifique se o pipeline está executando
4. Monitore os logs para identificar problemas

## 🚨 Troubleshooting

### Erro de autenticação Docker:
- Verifique se DOCKER_USERNAME e DOCKER_PASSWORD estão corretos
- Use token de acesso em vez da senha normal

### Erro de deploy no Render:
- Verifique se RENDER_API_KEY e RENDER_SERVICE_ID estão corretos
- Confirme se o serviço existe no Render

### Erro de conexão com banco:
- Verifique se as credenciais do banco estão corretas
- Confirme se o banco está acessível publicamente

### Erro de email:
- Use senha de app do Gmail, não a senha normal
- Verifique se a verificação em duas etapas está ativa

## 📋 Checklist de Configuração

- [ ] Docker Hub configurado
- [ ] Render configurado
- [ ] Banco de dados configurado
- [ ] BetterStack configurado
- [ ] Email configurado
- [ ] Pipeline testado com sucesso
- [ ] Deploy funcionando no Render
- [ ] Logs aparecendo no BetterStack

## 🔗 Links Úteis

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Docker Hub Access Tokens](https://docs.docker.com/docker-hub/access-tokens/)
- [Render API Documentation](https://render.com/docs/api)
- [BetterStack Documentation](https://betterstack.com/docs/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)

---

**Importante**: Nunca commite secrets no código. Sempre use as secrets do GitHub Actions. 