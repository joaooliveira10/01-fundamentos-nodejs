import http from "node:http"
import { Transform } from "node:stream"

class InverseNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1

    console.log(transformed)

    callback(null, Buffer.from(String(transformed)))
  }
}

// req => ReadableStream
// res => WritableStream

const server = http.createServer(async (req, res) => {
  console.log("Conexão recebida")
  const buffers = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  //  Neste caso precisamos receber o dado completo, usando o await e async podemos receber o dado e só quando conluir mostrar/enviar
  // {"name": "Joao", "email": "joao@gmail.com"}
  // {"name": "Joao", "em       nessa situação vir só parte dos dados não é interessante

  const fullStreamContent = Buffer.concat(buffers).toString()
  console.log(fullStreamContent)

  req.on("end", () => {
    console.log("Stream finalizada")
    res.end()
  })

  req.on("error", (err) => {
    console.error("Erro na requisição:", err)
    res.statusCode = 500
    res.end()
  })

  return res.end(fullStreamContent)

  // return req.pipe(new InverseNumberStream()).pipe(res)
})
server.listen(3334)
