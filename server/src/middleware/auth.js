import jwt from "jsonwebtoken"

export function authRequired(req, res, next) {
  const auth = req.headers.authorization || ""
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null
  if (!token) return res.status(401).json({ error: "Missing token" })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: decoded.sub }
    next()
  } catch (_e) {
    return res.status(401).json({ error: "Invalid token" })
  }
}
