import { Readable } from "node:stream"

class OneToHundredStream extends Readable {
  index = 1

  _read() {
    const i = this.index++

    if (i > 100) {
      this.push(null)
      return
    }

    setTimeout(() => {
      const buf = Buffer.from(String(i))
      this.push(buf)
    }, 100) // Reduzindo o delay para 100ms para testar
  }
}

fetch("http://localhost:3334", {
  method: "POST",
  body: new OneToHundredStream(),
  duplex: "half",
})
  .then((response) => {
    console.log("Resposta recebida:", response.status)
    return response.text()
  })
  .then((data) => {
    console.log("Dados:", data)
  })
  .catch((err) => {
    console.error("Erro:", err.message)
  })
