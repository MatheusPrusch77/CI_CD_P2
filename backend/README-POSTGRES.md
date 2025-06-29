# Imagem Docker PostgreSQL

Esta imagem Docker contém um PostgreSQL 15 configurado especificamente para o projeto de gerenciamento de tarefas.

## Imagens Disponíveis

A imagem está disponível no Docker Hub em: `luizrinaldiriato/dockerpostgres`

### Tags Disponíveis

- `latest` - Versão mais recente
- `postgres15` - Versão específica do PostgreSQL 15
- `{commit-sha}` - Versão específica baseada no commit

## Como Usar

### Executar com Docker

```bash
# Executar com configurações padrão
docker run -d \
  --name postgres-tarefas \
  -p 5432:5432 \
  -e POSTGRES_DB=tarefas_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  luizrinaldiriato/dockerpostgres:latest

# Executar com configurações personalizadas
docker run -d \
  --name postgres-tarefas \
  -p 5432:5432 \
  -e POSTGRES_DB=meu_banco \
  -e POSTGRES_USER=meu_usuario \
  -e POSTGRES_PASSWORD=minha_senha \
  -v postgres_data:/var/lib/postgresql/data \
  luizrinaldiriato/dockerpostgres:latest
```

### Executar com Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: luizrinaldiriato/dockerpostgres:latest
    container_name: postgres-tarefas
    environment:
      POSTGRES_DB: tarefas_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d tarefas_db"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
```

## Configurações Padrão

- **Versão do PostgreSQL**: 15
- **Porta**: 5432
- **Banco de dados**: tarefas_db
- **Usuário**: postgres
- **Senha**: password

## Estrutura do Banco

A imagem inclui automaticamente:

1. **Tabela `tarefas`** com os campos:
   - `id` (SERIAL PRIMARY KEY)
   - `descricao` (VARCHAR(255))
   - `status` (VARCHAR(20)) - valores: 'pendente', 'em_andamento', 'completa'
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

2. **Dados de exemplo** inseridos automaticamente

## Variáveis de Ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `POSTGRES_DB` | tarefas_db | Nome do banco de dados |
| `POSTGRES_USER` | postgres | Nome do usuário |
| `POSTGRES_PASSWORD` | password | Senha do usuário |
| `POSTGRES_HOST_AUTH_METHOD` | md5 | Método de autenticação |

## Health Check

A imagem inclui um health check que verifica se o PostgreSQL está pronto para aceitar conexões:

```bash
pg_isready -U $POSTGRES_USER -d $POSTGRES_DB
```

## Conectar ao Banco

### Via psql (dentro do container)

```bash
docker exec -it postgres-tarefas psql -U postgres -d tarefas_db
```

### Via aplicação Node.js

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'tarefas_db'
});
```

## Backup e Restore

### Backup

```bash
docker exec postgres-tarefas pg_dump -U postgres tarefas_db > backup.sql
```

### Restore

```bash
docker exec -i postgres-tarefas psql -U postgres tarefas_db < backup.sql
```

## Logs

Para ver os logs do PostgreSQL:

```bash
docker logs postgres-tarefas
```

## Troubleshooting

### Erro de conexão recusada

Verifique se o container está rodando:

```bash
docker ps
```

### Erro de autenticação

Verifique se as credenciais estão corretas:

```bash
docker exec -it postgres-tarefas psql -U postgres -d tarefas_db
```

### Reset do banco

Para resetar completamente o banco:

```bash
docker stop postgres-tarefas
docker rm postgres-tarefas
docker volume rm postgres_data
docker run -d --name postgres-tarefas -p 5432:5432 luizrinaldiriato/dockerpostgres:latest
```

## Desenvolvimento Local

Para desenvolvimento local, você pode usar esta imagem com o arquivo `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=tarefas_db
DB_SSL=false
```

## CI/CD

Esta imagem é automaticamente construída e enviada para o Docker Hub através do pipeline CI/CD sempre que há um push para a branch `main`. 