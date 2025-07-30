import http from "http"
import { json } from "./middlewares/json.js"
import { routes } from "./routes.js"

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

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find((route) => {
    return route.method === method && route.path === url
  })
  if (route) {
    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(3333)
