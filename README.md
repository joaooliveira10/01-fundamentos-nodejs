# 📚 Fundamentos do Node.js

Este projeto é da Pós Tech Developer 360 realizado pela Faculdade de Tecnologia da RocketSeat, um estudo completo sobre os conceitos fundamentais do Node.js, abordando desde a criação de servidores HTTP básicos até o uso avançado de Streams, Buffers, e construção de APIs REST.

## 🏗️ Estrutura do Projeto

```
01-fundamentos-nodejs/
├── package.json                      # Configurações do projeto NPM
├── db.json                          # Banco de dados JSON simples
├── src/                             # Código fonte principal
│   ├── server.js                    # Servidor HTTP principal
│   ├── routes.js                    # Definição das rotas da API
│   ├── database.js                  # Classe para manipulação do banco JSON
│   ├── middlewares/
│   │   └── json.js                  # Middleware para parsing JSON
│   └── utils/
│       ├── build-route-path.js      # Utilitário para construção de rotas
│       └── extract-query-params.js  # Extração de query parameters
└── streams/                         # Exemplos de trabalho com Streams
    ├── buffer.js                    # Conceitos básicos de Buffer
    ├── fundamentals.js              # Fundamentos das Streams
    ├── fake-upload-to-http-stream.js # Cliente que simula upload via stream
    └── stream-http-server.js        # Servidor que trabalha com streams
```

## 📦 Configuração do Projeto (`package.json`)

O arquivo `package.json` define as configurações básicas do projeto:

- **`"type": "module"`**: Habilita o uso de ES Modules (import/export) ao invés de CommonJS (require)
- **Script `dev`**: Utiliza `--watch` para reiniciar automaticamente o servidor quando há mudanças no código
- **Versão do Node.js**: Compatível com versões modernas que suportam ES Modules

```json
{
  "name": "01-fundamentos-nodejs",
  "type": "module",
  "scripts": {
    "dev": "node --watch src/server.js"
  }
}
```

## 🖥️ API REST de Usuários

O projeto implementa uma API REST completa para gerenciamento de usuários, demonstrando os principais conceitos do desenvolvimento backend com Node.js puro.

### Arquitetura da API

#### 1. **Servidor Principal (`src/server.js`)**

Implementa um servidor HTTP que demonstra:

- **Métodos HTTP**: GET, POST, PUT, DELETE
- **Roteamento dinâmico** com parâmetros e query strings
- **Middleware de parsing JSON**
- **Tratamento de erros** e status codes apropriados

#### 2. **Sistema de Rotas (`src/routes.js`)**

Implementa todas as operações CRUD para usuários:

- **GET `/users`**: Lista todos os usuários com filtro por busca
- **POST `/users`**: Cria um novo usuário
- **PUT `/users/:id`**: Atualiza um usuário completo
- **DELETE `/users/:id`**: Remove um usuário

#### 3. **Banco de Dados (`src/database.js`)**

Classe que simula um banco de dados usando arquivo JSON:

- **Persistência automática** em arquivo
- **Operações CRUD** (Create, Read, Update, Delete)
- **Sistema de busca** com filtros dinâmicos
- **Carregamento assíncrono** dos dados

#### 4. **Utilitários**

- **`json.js`**: Middleware para parsing do body das requisições
- **`build-route-path.js`**: Construção de rotas com parâmetros dinâmicos
- **`extract-query-params.js`**: Extração de parâmetros de query string

### Conceitos HTTP Abordados

#### **Métodos HTTP**

- **GET**: Buscar recursos do backend
- **POST**: Criar novos recursos
- **PUT**: Atualizar recursos completos
- **DELETE**: Remover recursos

#### **Tipos de Parâmetros**

- **Query Parameters**: Filtros e configurações opcionais (`?search=joao&limit=10`)
- **Route Parameters**: Identificação de recursos específicos (`/users/:id`)
- **Request Body**: Dados enviados via JSON no corpo da requisição

#### **Status Codes**

- `200`: Sucesso na consulta
- `201`: Recurso criado com sucesso
- `204`: Operação realizada sem conteúdo de retorno
- `404`: Recurso não encontrado

## 🌊 Streams (`streams/`)

### O que são Streams?

Streams são uma forma de processar dados de forma **assíncrona** e **eficiente**, especialmente úteis para:

- Arquivos grandes
- Upload/download de dados
- Processamento em tempo real
- Economia de memória

### 1. Buffer Básico (`buffer.js`)

```javascript
const buf = Buffer.from("Test")
console.log(buf.toJSON())
```

**Conceito**: Demonstra a criação básica de um Buffer e sua conversão para JSON.

**Buffer**: Estrutura de dados que representa uma sequência de bytes, fundamental para trabalhar com dados binários no Node.js.

### 2. Fundamentos das Streams (`fundamentals.js`)

Este arquivo implementa três tipos de streams personalizadas:

#### **Readable Stream** - `OneToHundredStream`

```javascript
class OneToHundredStream extends Readable {
  index = 1

  _read() {
    const i = this.index++
    setTimeout(() => {
      if (i > 100) {
        this.push(null) // Finaliza a stream
      } else {
        const buf = Buffer.from(String(i))
        this.push(buf) // Envia dados
      }
    }, 1000)
  }
}
```

**Propósito**: Gera números de 1 a 100 com intervalo de 1 segundo entre cada um.

#### **Transform Stream** - `InverseNumberStream`

```javascript
class InverseNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1
    callback(null, Buffer.from(String(transformed)))
  }
}
```

**Propósito**: Transforma cada número recebido em seu valor negativo.

#### **Writable Stream** - `MultiplyByTenStream`

```javascript
class MultiplyByTenStream extends Writable {
  _write(chunk, encoding, callback) {
    console.log(Number(chunk.toString()) * 10)
    callback()
  }
}
```

**Propósito**: Multiplica cada número por 10 e exibe no console.

#### **Pipeline de Transformação**

```javascript
new OneToHundredStream()
  .pipe(new InverseNumberStream())
  .pipe(new MultiplyByTenStream())
```

**Resultado**:

1. Gera: 1, 2, 3, ...
2. Inverte: -1, -2, -3, ...
3. Multiplica por 10: -10, -20, -30, ...

### 3. Cliente HTTP com Stream (`fake-upload-to-http-stream.js`)

```javascript
fetch("http://localhost:3334", {
  method: "POST",
  body: new OneToHundredStream(),
  duplex: "half",
})
```

**Conceitos Importantes**:

- **Streaming Upload**: Envia dados em tempo real sem carregar tudo na memória
- **`duplex: "half"`**: Configuração necessária para streams no fetch API
- **Timeout reduzido**: 100ms para testes mais rápidos

### 4. Servidor HTTP com Streams (`stream-http-server.js`)

#### Abordagem Atual (Buffering Completo)

```javascript
const buffers = []
for await (const chunk of req) {
  buffers.push(chunk)
}
const fullStreamContent = Buffer.concat(buffers).toString()
```

**Quando usar**: Para dados que precisam estar completos antes do processamento (ex: JSON).

#### Abordagem com Pipeline (Comentada)

```javascript
// return req.pipe(new InverseNumberStream()).pipe(res)
```

**Quando usar**: Para processamento em tempo real de grandes volumes de dados.

## 🚀 Como Executar

### 1. Servidor da API (Porta 3333)

```bash
npm run dev
# ou
node --watch src/server.js
```

- **URL**: http://localhost:3333
- **Endpoints disponíveis**: `/users`
- **Auto-reload**: O servidor reinicia automaticamente ao detectar mudanças no código

### 2. Servidor de Streams (Porta 3334)

```bash
node streams/stream-http-server.js
```

### 3. Exemplos de Streams

```bash
# Fundamentos das streams (demonstração de pipeline)
node streams/fundamentals.js

# Exemplo de buffer básico
node streams/buffer.js

# Cliente de upload via stream (requer servidor na porta 3334)
node streams/fake-upload-to-http-stream.js
```

## 🧪 Testando a API

### 1. Listar todos os usuários

```bash
curl http://localhost:3333/users
```

### 2. Buscar usuários com filtro

```bash
curl "http://localhost:3333/users?search=joao"
```

### 3. Criar um novo usuário

```bash
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{"name": "João Silva", "email": "joao@email.com"}'
```

### 4. Atualizar um usuário

```bash
curl -X PUT http://localhost:3333/users/SEU_ID_AQUI \
  -H "Content-Type: application/json" \
  -d '{"name": "João Santos", "email": "joao.santos@email.com"}'
```

### 5. Deletar um usuário

```bash
curl -X DELETE http://localhost:3333/users/SEU_ID_AQUI
```

### Estrutura de Dados

**Usuário:**

```json
{
  "id": "uuid-gerado-automaticamente",
  "name": "Nome do usuário",
  "email": "email@exemplo.com"
}
```

## 📈 Vantagens das Streams

1. **Eficiência de Memória**: Processa dados em chunks pequenos
2. **Performance**: Não precisa aguardar o arquivo completo
3. **Escalabilidade**: Suporta arquivos de qualquer tamanho
4. **Tempo Real**: Processamento enquanto os dados chegam

## 🎯 Casos de Uso Práticos

### Import de Arquivos CSV Grandes

```
Cenário: Arquivo de 1GB com 1.000.000 de registros
- Sem streams: Carrega 1GB na memória
- Com streams: Processa linha por linha (~10MB/s)
```

### Upload de Arquivos

- **Tradicional**: Espera upload completo, depois processa
- **Com Streams**: Processa durante o upload

## 🔄 Evolução do Projeto

### ✅ Funcionalidades Implementadas

- **Servidor HTTP básico** com Node.js puro
- **API REST completa** para usuários (CRUD)
- **Sistema de roteamento** com parâmetros dinâmicos
- **Middleware customizado** para parsing JSON
- **Banco de dados** simulado com persistência em arquivo
- **Sistema de busca** com filtros
- **Streams avançadas** (Readable, Writable, Transform)
- **Upload via streams** com exemplo prático
- **Manipulação de Buffers** para processamento de dados binários

### 🚧 Próximas Implementações

- Validação de dados de entrada
- Tratamento de erros mais robusto
- Sistema de logs
- Paginação de resultados
- Middlewares de autenticação
- Testes automatizados
- Documentação da API (OpenAPI/Swagger)

### � Conceitos Fundamentais Cobertos

- **ES Modules** (import/export)
- **Streams** (Readable, Writable, Transform)
- **Buffers** e manipulação de dados binários
- **HTTP** (métodos, status codes, headers)
- **REST API** design e implementação
- **JSON** parsing e serialização
- **RegExp** para roteamento dinâmico
- **File System** para persistência
- **Async/Await** e Promises

---

## 💡 Destaques Técnicos

### Roteamento Dinâmico

O projeto implementa um sistema de roteamento avançado que suporta:

```javascript
// Definição de rota com parâmetro
buildRoutePath("/users/:id")
// Gera: /^\/users\/(?<id>[a-z0-9-_]+)(?<query>\?(.*))?$/

// Extração automática de parâmetros
req.params.id // ID do usuário
req.query.search // Parâmetro de busca
```

### Middleware Customizado

```javascript
// Middleware JSON parser personalizado
export async function json(req, res) {
  const buffers = []
  for await (const chunk of req) {
    buffers.push(chunk)
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    req.body = null
  }

  res.setHeader("Content-type", "application/json")
}
```

### Banco de Dados Simulado

```javascript
// Persistência automática em arquivo JSON
#persist() {
  fs.writeFile(databasePath, JSON.stringify(this.#database))
}

// Sistema de busca flexível
select(table, search) {
  let data = this.#database[table] ?? []

  if (search) {
    data = data.filter((row) => {
      return Object.entries(search).some(([key, value]) => {
        return row[key].toLowerCase().includes(value.toLowerCase())
      })
    })
  }

  return data
}
```

**Observação**: Este é um projeto educacional focado no aprendizado dos fundamentos do Node.js. Cada arquivo foi criado para demonstrar conceitos específicos de forma isolada e didática, sem o uso de frameworks externos.
