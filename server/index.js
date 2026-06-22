import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import User from './models/User.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 10000

// __dirname setup (IMPORTANT for ES modules)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(express.json())

app.use(cors())

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err))

// ---------------- ROUTES ----------------

// Root
app.get("/", (req, res) => {
  res.send("QuickWash Full App Running 🚀")
})

// Health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" })
})

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, mobile, email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      fullName,
      mobile,
      email,
      password: hashedPassword
    })

    await user.save()

    res.json({ message: "User created" })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, password } = req.body

    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }]
    })

    if (!user) return res.status(400).json({ message: "User not found" })

    const match = await bcrypt.compare(password, user.password)

    if (!match) return res.status(400).json({ message: "Wrong password" })

    res.json({ message: "Login success", user })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ---------------- FRONTEND SERVE ----------------

// serve frontend build
app.use(express.static(path.join(__dirname, "../dist")))

// fallback route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"))
})

// ---------------- START ----------------
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`)
})