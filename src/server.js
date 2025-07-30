import http from "http"
import { json } from "./middlewares/json.js"
import { Database } from "./database.js"
import { randomUUID } from "node:crypto"
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

const database = new Database()

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  if (method === "GET" && url === "/users") {
    const users = database.select("users")
    return res.end(JSON.stringify(users))
  }

  if (method === "POST" && url === "/users") {
    const { name, email } = req.body

    const user = {
      id: randomUUID(),
      name,
      email,
    }
    database.insert("users", user)

    return res.writeHead(201).end()
  }

  return res.writeHead(404).end()
})

server.listen(3333)
