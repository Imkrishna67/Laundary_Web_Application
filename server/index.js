import cors from 'cors'
import express from 'express'

const app = express()
const port = process.env.PORT || 5000

const registeredUsers = [
  {
    fullName: 'QuickWash Demo User',
    identifiers: ['quickwash@example.com', '9876543210'],
    password: 'QuickWash@123',
  },
]

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
    normalizedUser: {
      fullName,
      mobile,
      email,
      password,
      identifiers: [mobile, email],
    },
  }
}

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/auth/register', (req, res) => {
  const validation = validateRegisterPayload(req.body)

  if (!validation.isValid) {
    const firstError = Object.values(validation.errors)[0]
    return res.status(400).json({ message: firstError })
  }

  const { fullName, identifiers, email, mobile } = validation.normalizedUser
  const isDuplicate = registeredUsers.some((user) =>
    user.identifiers.some((identifier) => identifiers.includes(identifier)),
  )

  if (isDuplicate) {
    return res.status(409).json({
      message: 'An account with this email or mobile number already exists.',
    })
  }

  registeredUsers.push({
    fullName,
    identifiers,
    password: validation.normalizedUser.password,
    createdAt: new Date().toISOString(),
  })

  return res.status(201).json({
    message: 'Account created successfully. You can login now.',
    user: {
      fullName,
      email,
      mobile,
    },
  })
})

app.post('/api/auth/login', (req, res) => {
  const { password } = req.body
  const normalizedIdentifier = normalizeIdentifier(req.body.identifier)

  if (!normalizedIdentifier || !password) {
    return res.status(400).json({ message: 'Mobile/email and password are required.' })
  }

  const matchedUser = registeredUsers.find(
    (user) => user.identifiers.includes(normalizedIdentifier) && user.password === password,
  )

  if (!matchedUser) {
    return res.status(401).json({
      message: 'Invalid credentials. Try quickwash@example.com / QuickWash@123 or 9876543210 / QuickWash@123.',
    })
  }

  return res.json({
    message: 'Login successful! Welcome to QuickWash.',
    user: {
      fullName: matchedUser.fullName,
      identifier: matchedUser.identifiers[0],
    },
  })
})

app.listen(port, () => {
  console.log(`QuickWash API running on http://localhost:${port}`)
})
