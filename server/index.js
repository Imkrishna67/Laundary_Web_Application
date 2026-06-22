import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import User from './models/User.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err))

function normalizeIdentifier(value) {
  return String(value || '').trim().toLowerCase()
}

function normalizeMobile(value) {
  return String(value || '').replace(/\D/g, '')
}

function validateRegisterPayload(payload) {
  const fullName = String(payload.fullName || '').trim()
  const mobile = normalizeMobile(payload.mobile)
  const email = normalizeIdentifier(payload.email)
  const password = String(payload.password || '')
  const errors = {}

  if (fullName.length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.'
  }
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    errors.mobile = 'Enter a valid 10-digit mobile number.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    normalizedUser: { fullName, mobile, email, password },
  }
}

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'] }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  const validation = validateRegisterPayload(req.body)

  if (!validation.isValid) {
    const firstError = Object.values(validation.errors)[0]
    return res.status(400).json({ message: firstError })
  }

  const { fullName, mobile, email, password } = validation.normalizedUser

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] })

    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email or mobile number already exists.',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      fullName,
      mobile,
      email,
      password: hashedPassword,
    })

    await newUser.save()

    return res.status(201).json({
      message: 'Account created successfully. You can login now.',
      user: { fullName, email, mobile },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error. Please try again.' })
  }
})

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { password } = req.body
  const normalizedIdentifier = normalizeIdentifier(req.body.identifier)

  if (!normalizedIdentifier || !password) {
    return res.status(400).json({ message: 'Mobile/email and password are required.' })
  }

  try {
    const matchedUser = await User.findOne({
      $or: [{ email: normalizedIdentifier }, { mobile: normalizedIdentifier }],
    })

    if (!matchedUser) {
      return res.status(401).json({ message: 'Invalid credentials.' })
    }

    const isPasswordCorrect = await bcrypt.compare(password, matchedUser.password)

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials.' })
    }

    return res.json({
      message: 'Login successful! Welcome to QuickWash.',
      user: {
        fullName: matchedUser.fullName,
        identifier: matchedUser.email,
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error. Please try again.' })
  }
})

app.listen(port, () => {
  console.log(`QuickWash API running on http://localhost:${port}`)
})