import http from "http"
// - Criar usuarios
// - Listar usuarios
// - Editar usuarios
// - Remoção de usuarios

// - HTTP
//  - Metodos HTTP
//    - GET, POST, PUT , PATCH, DELETE
//      - GET => Buscar um recurso do back-end
//      - POST => Criar um recurso do back-end
//      - PUT => Atualizar um recurso do back-end
//      - PATCH => Atualizar uma informação especifica de um recurso no back-end
//      - DELETE => Apaga um recurso do back-end
//  - URL
//    - GET /users => Buscando usuarios do back-end
//    - POST /users => Criar um usuario no back-end
// - Stateful - Stateless
// - JASON - JavaScript object Notation
// - Cebeçalhos (Requisição/Resposta) => Metadados
// - HTTP Status Code

const users = []

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  const buffers = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    req.body = null
  }

  if (method === "GET" && url === "/users") {
    return res
      .setHeader("Content-type", "application/json")
      .end(JSON.stringify(users))
  }

  if (method === "POST" && url === "/users") {
    const { name, email } = req.body

    users.push({
      id: 1,
      name,
      email,
    })
    return res.writeHead(201).end()
  }

  return res.writeHead(404).end()
})

server.listen(3333)
