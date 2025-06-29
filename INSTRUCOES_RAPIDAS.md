# 🚀 Instruções Rápidas - Setup Completo

## 📋 Checklist de Configuração

### 1. ✅ Repositório GitHub
- [ ] Repositório criado no GitHub
- [ ] Código enviado para o repositório
- [ ] Usuário `festmedeiros` adicionado como contribuidor

### 2. 🔐 Secrets do GitHub Actions
Configure os seguintes secrets no seu repositório:

```bash
# Docker Hub
DOCKER_USERNAME=seu_usuario_docker
DOCKER_PASSWORD=sua_senha_docker

# Render
RENDER_API_KEY=sua_api_key_render
RENDER_SERVICE_ID=id_do_servico_render

# Banco de Dados
DB_HOST=host_do_banco
DB_PORT=3306
DB_USER=usuario_do_banco
DB_PASSWORD=senha_do_banco
DB_NAME=nome_do_banco

# BetterStack
BETTERSTACK_SOURCE_TOKEN=seu_token_betterstack

# Email (para notificações)
EMAIL_USERNAME=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_app_gmail
NOTIFICATION_EMAIL=email_notificacoes@exemplo.com
```

### 3. 🐳 Docker Hub
- [ ] Criar conta no Docker Hub
- [ ] Criar repositório com o mesmo nome do GitHub
- [ ] Gerar Access Token para autenticação

### 4. ☁️ Render
- [ ] Criar conta no Render
- [ ] Conectar repositório GitHub
- [ ] Criar serviço Web Service
- [ ] Configurar variáveis de ambiente
- [ ] Obter API Key e Service ID

### 5. 📊 BetterStack
- [ ] Criar conta no BetterStack
- [ ] Criar novo Log Source
- [ ] Copiar Source Token

### 6. 🗄️ Banco de Dados
Escolha uma opção:
- **PlanetScale** (MySQL gerenciado)
- **Railway** (MySQL/PostgreSQL)
- **Supabase** (PostgreSQL)
- **AWS RDS** (MySQL/PostgreSQL)

### 7. 📧 Email (Gmail)
- [ ] Ativar verificação em duas etapas
- [ ] Gerar senha de app para "GitHub Actions"

## 🚀 Como Testar

### 1. Teste Local
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio

# Execute com Docker Compose
docker-compose up --build

# Teste a API
curl http://localhost:3000/health
curl http://localhost:3000/tarefas
```

### 2. Teste do Pipeline
```bash
# Faça um commit e push
git add .
git commit -m "feat: implementa pipeline CI/CD completo"
git push origin main

# Verifique o pipeline no GitHub Actions
# Acesse: https://github.com/seu-usuario/seu-repositorio/actions
```

### 3. Teste da API em Produção
```bash
# Substitua pela URL do seu serviço no Render
curl https://seu-servico.onrender.com/health
curl https://seu-servico.onrender.com/tarefas
```

## 📸 Prints Necessários

### Pré-validação:
1. **Tela do serviço criado no Render**
   - Dashboard do Render mostrando o serviço ativo
   - URL pública do serviço

2. **Logs da aplicação no BetterStack**
   - Dashboard do BetterStack com logs aparecendo
   - Stream de logs configurado

### Pós-validação (será solicitado via Teams):
1. **BetterStack**: Logs gerados durante a validação
2. **Render**: Eventos de deploy gerados durante validação

## 🔧 Comandos Úteis

### Git e GitHub
```bash
# Adicionar contribuidor
gh repo add-collaborator SEU_USUARIO/SEU_REPOSITORIO festmedeiros --permission write

# Listar secrets
gh secret list

# Verificar status do pipeline
gh run list
```

### Docker
```bash
# Build da imagem
docker build -t tarefas-api ./backend

# Executar localmente
docker-compose up --build

# Ver logs
docker-compose logs -f backend
```

### API
```bash
# Health check
curl http://localhost:3000/health

# Listar tarefas
curl http://localhost:3000/tarefas

# Criar tarefa
curl -X POST http://localhost:3000/tarefas \
  -H "Content-Type: application/json" \
  -d '{"descricao": "Teste", "status": "pendente"}'
```

## 🚨 Troubleshooting

### Pipeline falha:
1. Verifique se todos os secrets estão configurados
2. Confirme se o Docker Hub tem o repositório criado
3. Verifique se o Render tem o serviço configurado

### API não responde:
1. Verifique se o banco de dados está acessível
2. Confirme se as variáveis de ambiente estão corretas
3. Verifique os logs no Render

### Logs não aparecem no BetterStack:
1. Confirme se o token está correto
2. Verifique se o stream foi criado
3. Teste com uma requisição manual

## 📞 Suporte

- **GitHub Issues**: Para problemas no código
- **Render Support**: Para problemas de deploy
- **BetterStack Support**: Para problemas de logs
- **Documentação Swagger**: http://localhost:3000/api-docs

---

**🎯 Objetivo**: Ter um pipeline CI/CD completo funcionando com deploy automático no Render e logs no BetterStack. 