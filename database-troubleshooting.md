# 🔧 Troubleshooting Banco de Dados PostgreSQL

## Problema
```
error: Erro ao inicializar servidor {"error":"password authentication failed for user \"postgres\"","service":"tarefas-api"}
```

## Causa
As variáveis de ambiente do banco de dados não estão configuradas corretamente no Render.

## Solução

### 1. Verificar Variáveis de Ambiente no Render

Acesse: https://dashboard.render.com → Seu serviço → Environment

Verifique se estas variáveis estão configuradas:

#### ✅ Variáveis Obrigatórias:
```
DB_HOST=seu_host_postgres
DB_PORT=5432
DB_USER=seu_usuario_postgres
DB_PASSWORD=sua_senha_postgres
DB_NAME=seu_nome_do_banco
```

#### ✅ Variáveis Opcionais:
```
NODE_ENV=production
RENDER=true
BETTERSTACK_SOURCE_TOKEN=seu_token_betterstack
```

### 2. Configuração do PostgreSQL no Render

#### Opção A: PostgreSQL do Render (Recomendado)
1. **Criar banco PostgreSQL**:
   - Render Dashboard → New → PostgreSQL
   - Nome: `tarefas-db`
   - Database: `tarefas_db`
   - User: `postgres`
   - Password: (gerado automaticamente)

2. **Copiar as variáveis**:
   - Internal Database URL: `postgresql://postgres:password@host:5432/tarefas_db`
   - Host: `dpg-xxxxx-a.oregon-postgres.render.com`
   - Port: `5432`
   - Database: `tarefas_db`
   - User: `postgres`
   - Password: `sua_senha_aqui`

#### Opção B: PostgreSQL Externo
Se você tem um PostgreSQL externo (Railway, Supabase, etc.):
- Configure as variáveis com os dados do seu banco

### 3. Configuração das Variáveis no Serviço

No seu serviço `backendapicicd` no Render:

1. **Settings** → **Environment**
2. **Add Environment Variable** para cada uma:

```
DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
DB_NAME=tarefas_db
NODE_ENV=production
RENDER=true
BETTERSTACK_SOURCE_TOKEN=seu_token_betterstack
```

### 4. Teste de Conexão

Após configurar, o servidor vai mostrar:

```
🔍 Debug ambiente: {
  NODE_ENV: 'production',
  RENDER: 'true',
  DB_HOST: '***',
  DB_PORT: '5432',
  DB_USER: 'postgres',
  DB_NAME: 'tarefas_db',
  BETTERSTACK_SOURCE_TOKEN: '***'
}
🔌 Tentando conectar ao banco de dados...
✅ Banco de dados conectado com sucesso!
```

### 5. Verificação

#### Se der erro de conexão:
1. Verifique se o host está correto
2. Confirme se a senha está correta
3. Teste se o banco está acessível

#### Se der erro de SSL:
1. O código já está configurado para SSL no Render
2. Verifique se `RENDER=true` está definido

#### Se der erro de tabela:
1. O código cria a tabela automaticamente
2. Verifique se o usuário tem permissões de CREATE

## Próximos Passos

1. ✅ Configure as variáveis de ambiente no Render
2. ✅ Salve as configurações
3. ✅ Aguarde o redeploy automático
4. ✅ Monitore os logs para ver o debug
5. ✅ Teste a conexão com o banco

## Comandos Úteis

### Teste local (se tiver PostgreSQL local):
```bash
# Configure as variáveis
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=postgres
export DB_PASSWORD=sua_senha
export DB_NAME=tarefas_db

# Teste a conexão
node -e "
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('Erro:', err);
  else console.log('Conexão OK:', res.rows[0]);
  pool.end();
});
"
```

A configuração correta das variáveis de ambiente deve resolver o erro de autenticação! 🚀 