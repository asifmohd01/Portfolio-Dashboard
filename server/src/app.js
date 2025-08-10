import express from "express"
import cors from "cors"
import morgan from "morgan"
import authRoutes from "./routes/auth.js"
import portfolioRoutes from "./routes/portfolio.js"
import { notFound, errorHandler } from "./middleware/error.js"

const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: "1mb" }))
app.use(morgan("dev"))

app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "WealthManager API" })
})

app.use("/api/auth", authRoutes)
app.use("/api/portfolio", portfolioRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
