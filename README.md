# 📚 Fundamentos do Node.js

Este projeto é da Pós Tech Developer 360 realizado pela Faculdade de Tecnologia da RocketSeat, um estudo completo sobre os conceitos fundamentais do Node.js, abordando desde a criação de servidores HTTP básicos até o uso avançado de Streams e Buffers.

## 🏗️ Estrutura do Projeto

```
01-fundamentos-nodejs/
├── package.json              # Configurações do projeto NPM
├── src/                      # Código fonte principal
│   └── server.js            # Servidor HTTP com API REST básica
└── streams/                 # Exemplos de trabalho com Streams
    ├── buffer.js           # Conceitos básicos de Buffer
    ├── fundamentals.js     # Fundamentos das Streams
    ├── fake-upload-to-http-stream.js  # Cliente que simula upload via stream
    └── stream-http-server.js          # Servidor que trabalha com streams
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

## 🖥️ Servidor Principal (`src/server.js`)

### Conceitos Abordados

Este arquivo implementa um servidor HTTP básico que demonstra:

#### 1. **Métodos HTTP**

- **GET**: Buscar recursos do backend
- **POST**: Criar novos recursos
- **PUT**: Atualizar recursos completos
- **PATCH**: Atualizar informações específicas
- **DELETE**: Remover recursos

#### 2. **Stateless vs Stateful**

O servidor é **stateless** - cada requisição é independente e não mantém estado entre chamadas até o momento.

#### 3. **JSON (JavaScript Object Notation)**

Formato padrão para troca de dados entre cliente e servidor.

#### 4. **Headers HTTP**

Metadados que acompanham requisições e respostas.

#### 5. **HTTP Status Codes**

- `200`: Sucesso
- `201`: Criado com sucesso
- `404`: Não encontrado

### Funcionalidades Implementadas

#### API de Usuários

- **GET `/users`**: Lista todos os usuários cadastrados
- **POST `/users`**: Cria um novo usuário

### Processamento do Body da Requisição

```javascript
const buffers = []
for await (const chunk of req) {
  buffers.push(chunk)
}

try {
  req.body = JSON.parse(Buffer.concat(buffers).toString())
} catch {
  req.body = null
}
```

Este trecho demonstra como:

1. **Ler dados em chunks**: O body da requisição chega em pedaços
2. **Trabalhar com Buffers**: Concatenar os chunks em um buffer único
3. **Parse JSON**: Converter o buffer em objeto JavaScript
4. **Tratamento de erros**: Lidar com JSON inválido

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

### 1. Servidor Principal

```bash
npm run dev
# ou
node --watch src/server.js
```

- Acessa: http://localhost:3333
- API disponível em `/users`

### 2. Servidor de Streams

```bash
node streams/stream-http-server.js
```

- Escuta na porta 3334

### 3. Exemplos de Streams

```bash
# Fundamentos das streams
node streams/fundamentals.js

# Exemplo de buffer
node streams/buffer.js

# Cliente de upload (requer servidor na porta 3334)
node streams/fake-upload-to-http-stream.js
```

## 🧪 Testando a API

### Listar usuários

```bash
curl http://localhost:3333/users
```

### Criar usuário

```bash
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{"name": "João", "email": "joao@email.com"}'
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

À medida que o projeto cresce, serão adicionados:

- ✅ Conceitos básicos de HTTP
- ✅ Trabalho com Buffers
- ✅ Streams Readable, Writable e Transform
- ✅ Integração HTTP + Streams
- 🔄 Middleware de parsing
- 🔄 Roteamento avançado
- 🔄 Manipulação de arquivos
- 🔄 Banco de dados
- 🔄 Autenticação
- 🔄 Testes

---

**Observação**: Este é um projeto educacional focado no aprendizado dos fundamentos do Node.js. Cada arquivo foi criado para demonstrar conceitos específicos de forma isolada e didática.
