import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { registerSchema, loginSchema } from '../validators/auth.js'

export async function register(req, res, next) {
  try {
    const { error, value } = registerSchema.validate(req.body)
    if (error) return res.status(400).json({ error: error.message })
    const { email, password } = value
    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ error: 'Email already registered' })
    const passwordHash = await bcrypt.hash(password, 10)
    await User.create({ email, passwordHash })
    return res.status(201).json({ message: 'User registered' })
  } catch (e) {
    next(e)
  }
}

export async function login(req, res, next) {
  try {
    const { error, value } = loginSchema.validate(req.body)
    if (error) return res.status(400).json({ error: error.message })
    const { email, password } = value

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign({}, process.env.JWT_SECRET, {
      subject: user._id.toString(),
      expiresIn: '7d',
    })
    return res.json({ token })
  } catch (e) {
    next(e)
  }
}
