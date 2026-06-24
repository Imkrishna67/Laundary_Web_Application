import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../login.css'

const apiBaseUrl = 'https://quickwash-backend.onrender.com'

function validateFullName(value) {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return 'Please enter your full name.'
  }

  if (trimmedValue.length < 2) {
    return 'Full name must be at least 2 characters.'
  }

  return ''
}

function validateMobile(value) {
  const digits = value.replace(/\D/g, '')

  if (!digits) {
    return 'Please enter your mobile number.'
  }

  if (!/^[6-9]\d{9}$/.test(digits)) {
    return 'Enter a valid 10-digit mobile number.'
  }

  return ''
}

function validateEmail(value) {
  const trimmedValue = value.trim()
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

  if (!trimmedValue) {
    return 'Please enter your email address.'
  }

  if (!emailPattern.test(trimmedValue)) {
    return 'Enter a valid email address.'
  }

  return ''
}

function validatePassword(value) {
  if (!value) {
    return 'Please enter a password.'
  }

  if (value.length < 6) {
    return 'Password must be at least 6 characters.'
  }

  return ''
}

function normalizeMobile(value) {
  return value.replace(/\D/g, '')
}

function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const [showTerms, setShowTerms] = useState(false)

  function clearFieldError(field) {
    setFieldErrors((currentErrors) => {
      if (!currentErrors[field]) return currentErrors
      return { ...currentErrors, [field]: '' }
    })
    setError('')
    setSuccessMessage('')
  }

  async function handleRegister(event) {
    event.preventDefault()

    const nextErrors = {
      fullName: validateFullName(fullName),
      mobile: validateMobile(mobile),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword:
        !confirmPassword
          ? 'Please confirm your password.'
          : password !== confirmPassword
            ? 'Passwords do not match.'
            : '',
      terms: termsAccepted ? '' : 'Please accept the Terms & Conditions.',
    }

    const hasErrors = Object.values(nextErrors).some(Boolean)

    if (hasErrors) {
      setFieldErrors(nextErrors)
      setError('')
      setSuccessMessage('')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccessMessage('')
    setFieldErrors({})

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          mobile: normalizeMobile(mobile),
          email: email.trim().toLowerCase(),
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Please try again.')
      }

      localStorage.setItem(
        'quickwashUser',
        JSON.stringify({
          identifier: email.trim().toLowerCase(),
          registeredAt: new Date().toISOString(),
        }),
      )
      setSuccessMessage(data.message || 'Account created successfully. You can login now.')
    } catch (caughtError) {
      const isConnectionError =
        caughtError instanceof TypeError && caughtError.message === 'Failed to fetch'

      setError(
        isConnectionError
          ? 'Unable to connect. Please try again later.'
          : caughtError.message
      )
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <main className="login-page">
      <div className="login-bg-orb login-bg-orb-one" />
      <div className="login-bg-orb login-bg-orb-two" />

      <section className="login-shell" aria-labelledby="register-title">
        <div className="brand-section">
          <div className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 64 64" role="img">
              <path
                d="M18 20c0-5.5 4.5-10 10-10h8c5.5 0 10 4.5 10 10v24c0 5.5-4.5 10-10 10h-8c-5.5 0-10-4.5-10-10V20Z"
                fill="#E0F2FE"
              />
              <path
                d="M20 22h24M20 31h24M20 40h16"
                stroke="#18A7FF"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M46 15l2.2-4.2L50.5 15l4.2 2.2-4.2 2.2-2.3 4.3-2.2-4.3-4.2-2.2L46 15Z"
                fill="#FFD166"
              />
            </svg>
          </div>
          <h1 id="register-title">Create Account</h1>
          <p>Start your QuickWash journey</p>
        </div>

        <div className="login-card">
          <form className="login-form" onSubmit={handleRegister} noValidate>
            <div className="field-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={fullName}
                onChange={(event) => {
                  setFullName(event.target.value)
                  clearFieldError('fullName')
                }}
                placeholder="Enter your full name"
                autoComplete="name"
                aria-invalid={Boolean(fieldErrors.fullName)}
                aria-describedby={fieldErrors.fullName ? 'fullName-error' : undefined}
              />
              {fieldErrors.fullName ? (
                <p id="fullName-error" className="field-error">
                  {fieldErrors.fullName}
                </p>
              ) : null}
            </div>

            <div className="field-group">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                value={mobile}
                onChange={(event) => {
                  setMobile(event.target.value)
                  clearFieldError('mobile')
                }}
                placeholder="Enter 10-digit mobile number"
                autoComplete="tel"
                inputMode="numeric"
                maxLength={10}
                aria-invalid={Boolean(fieldErrors.mobile)}
                aria-describedby={fieldErrors.mobile ? 'mobile-error' : undefined}
              />
              {fieldErrors.mobile ? (
                <p id="mobile-error" className="field-error">
                  {fieldErrors.mobile}
                </p>
              ) : null}
            </div>

            <div className="field-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  clearFieldError('email')
                }}
                placeholder="Enter your email"
                autoComplete="email"
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              />
              {fieldErrors.email ? (
                <p id="email-error" className="field-error">
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>

            <div className="field-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-action">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    clearFieldError('password')
                  }}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword((currentValue) => !currentValue)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {fieldErrors.password ? (
                <p id="password-error" className="field-error">
                  {fieldErrors.password}
                </p>
              ) : null}
            </div>

            <div className="field-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-with-action">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value)
                    clearFieldError('confirmPassword')
                  }}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  aria-invalid={Boolean(fieldErrors.confirmPassword)}
                  aria-describedby={
                    fieldErrors.confirmPassword ? 'confirmPassword-error' : undefined
                  }
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowConfirmPassword((currentValue) => !currentValue)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {fieldErrors.confirmPassword ? (
                <p id="confirmPassword-error" className="field-error">
                  {fieldErrors.confirmPassword}
                </p>
              ) : null}
            </div>

            <label className="terms-field" htmlFor="terms">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(event) => {
                  setTermsAccepted(event.target.checked)
                  clearFieldError('terms')
                }}
                aria-invalid={Boolean(fieldErrors.terms)}
                aria-describedby={fieldErrors.terms ? 'terms-error' : undefined}
              />
              <span>
                I agree to the{' '}
                <button type="button" className="inline-link" onClick={() => setShowTerms((current) => !current)}>
                  {showTerms ? 'Hide' : 'View'} Terms & Conditions
                </button>
              </span>
              {showTerms && (
                <div className="terms-box">
                  <p>By creating an account, you agree to our Terms of Service and Privacy Policy. QuickWash provides laundry services at your convenience and is not liable for any damage to delicate items unless explicitly insured.</p>
                  <button type="button" className="terms-close" onClick={() => setShowTerms(false)}>Close</button>
                </div>
              )}
            </label>
            {fieldErrors.terms ? (
              <p id="terms-error" className="field-error">
                {fieldErrors.terms}
              </p>
            ) : null}

            {error ? <div className="error-message" role="alert">{error}</div> : null}
            {successMessage ? (
              <div className="success-message" role="status">
                {successMessage}
              </div>
            ) : null}

            <button className="primary-button" type="submit" disabled={isLoading}>
              {isLoading ? <span className="spinner" aria-hidden="true" /> : null}
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>

          </form>

          <div className="login-link-row">
            Already have an account? <Link to="/" className="signup-link">Login</Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default RegisterPage