# 🔧 Troubleshooting Docker Hub 401 Error

## Problema
```
Error: buildx failed with: ERROR: failed to build: failed to solve: failed to fetch oauth token: unexpected status from GET request to https://auth.docker.io/token?scope=repository%3Aluizrinaldiriato%2Fcicd%3Apull%2Cpush&service=registry.docker.io: 401 Unauthorized
```

## Possíveis Causas e Soluções

### 1. 🔑 Token Expirado ou Inválido

**Sintoma**: Erro 401 mesmo com credenciais configuradas

**Solução**:
1. Vá para https://hub.docker.com/settings/security
2. Delete o token antigo
3. Crie um novo token com permissões `Read & Write`
4. Atualize o secret `DOCKER_PASSWORD` no GitHub

### 2. 📦 Repositório Não Existe

**Sintoma**: Erro ao tentar fazer push para repositório inexistente

**Solução**:
1. Acesse https://hub.docker.com/repositories
2. Clique em "Create Repository"
3. Nome: `cicd`
4. Visibilidade: Public
5. Ou execute o script de teste para criar automaticamente

### 3. 🔐 Permissões Insuficientes

**Sintoma**: Token não tem permissão para push

**Solução**:
1. Verifique se o token tem permissão `Read & Write`
2. Confirme se você é owner do repositório Docker
3. Teste localmente com o script `test-docker-hub.sh`

### 4. 🏷️ Nome do Repositório Incorreto

**Sintoma**: Tentativa de push para repositório com nome errado

**Verificação**:
- GitHub repo: `luizriato/cicd`
- Docker repo deve ser: `luizrinaldiriato/cicd`
- Verifique se não há caracteres especiais

### 5. 👤 Username Incorreto

**Sintoma**: Username do Docker Hub diferente do GitHub

**Solução**:
- GitHub username: `luizriato`
- Docker Hub username: `luizrinaldiriato`
- Configure o secret `DOCKER_USERNAME` como `luizrinaldiriato`

## Teste Local

Execute o script de teste para verificar a configuração:

```bash
# Configure as variáveis de ambiente
export DOCKER_USERNAME=luizrinaldiriato
export DOCKER_PASSWORD=seu_token_aqui

# Execute o teste
chmod +x test-docker-hub.sh
./test-docker-hub.sh
```

## Verificação dos Secrets no GitHub

1. Vá para: `https://github.com/luizriato/cicd/settings/secrets/actions`
2. Verifique se existem:
   - `DOCKER_USERNAME` = `luizrinaldiriato`
   - `DOCKER_PASSWORD` = `dckr_pat_...` (token válido)

## Debug no GitHub Actions

O workflow atualizado inclui passos de debug que vão mostrar:
- ✅ Se as credenciais estão sendo lidas
- ✅ Se o login no Docker Hub funciona
- ✅ Se o repositório existe
- ✅ Se conseguimos fazer pull/push

## Solução Rápida

Se nada funcionar, tente esta abordagem:

1. **Crie o repositório manualmente**:
   - Vá para https://hub.docker.com/repositories
   - Crie um repositório chamado `cicd`

2. **Gere um novo token**:
   - Delete o token antigo
   - Crie um novo com permissões `Read & Write`

3. **Atualize os secrets**:
   - `DOCKER_USERNAME`: `luizrinaldiriato`
   - `DOCKER_PASSWORD`: novo token

4. **Teste localmente**:
   ```bash
   docker login -u luizrinaldiriato -p seu_token
   docker pull hello-world
   ```

5. **Faça commit e push** para testar o workflow

## Comandos Úteis

```bash
# Testar login
docker login -u luizrinaldiriato -p seu_token

# Verificar se está logado
docker info

# Testar pull
docker pull hello-world

# Testar push (substitua pela sua imagem)
docker tag hello-world luizrinaldiriato/cicd:test
docker push luizrinaldiriato/cicd:test
```

## Próximos Passos

1. ✅ Execute o teste local
2. ✅ Verifique os secrets no GitHub
3. ✅ Crie o repositório Docker se necessário
4. ✅ Faça commit e push para testar
5. ✅ Monitore os logs do GitHub Actions

Se o problema persistir, os logs de debug vão mostrar exatamente onde está falhando! 🎯 