import dotenv from "dotenv"
dotenv.config()

// Polyfill fetch in Node < 18 (Node 18+ already has global fetch)
try {
  if (typeof fetch === "undefined") {
    const { fetch, Headers, Request, Response } = await import("undici")
    // @ts-ignore
    globalThis.fetch = fetch
    // @ts-ignore
    globalThis.Headers = Headers
    // @ts-ignore
    globalThis.Request = Request
    // @ts-ignore
    globalThis.Response = Response
  }
} catch {}

import app from "./src/app.js"
import { connectDB } from "./src/config/db.js"

const PORT = process.env.PORT || 4000

async function start() {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error("Failed to start server", err)
    process.exit(1)
  }
}

start()
