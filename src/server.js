import http from "http"
import { json } from "./middlewares/json.js"
import { routes } from "./routes.js"
import { extractQueryParams } from "./utils/extract-query-params.js"

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

// Query Parametrs: URL Stateful => Filtros, paginação, não-obrigatorios
// Route Parameters: Identificação de recurso
// Request Body: Envio de informações de um formulário (HTTPs)

// http://localhost:3333/users?userId=1&name=Joao

// GET http://localhost:3333/users/1
// DELETE http://localhost:3333/users/1
// POST http://localhost:3333/users

// Edição e remoção do usuario

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url)
  })
  if (route) {
    const routeParams = req.url.match(route.path)

    // console.log(extractQueryParams(routeParams.groups.query))

    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    // req.params = { ...routeParams.groups }

    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(3333)
