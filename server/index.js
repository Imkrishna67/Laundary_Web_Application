import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import User from './models/User.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 10000

// middleware
app.use(express.json())
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://laundary-web-application.vercel.app'
  ]
}))

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err))

// ---------------- ROUTES ----------------

// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" })
})

// root
app.get("/", (req, res) => {
  res.json({ message: "QuickWash Backend Running 🚀" })
})

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, mobile, email, password } = req.body

    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] })

    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email or mobile already exists.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      fullName,
      mobile,
      email,
      password: hashedPassword
    })

    await user.save()

    res.status(201).json({ message: "Account created successfully. You can login now." })

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

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." })
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials." })
    }

    res.json({
      message: "Login successful! Welcome to QuickWash.",
      user: {
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile
      }
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ---------------- START ----------------
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`)
})