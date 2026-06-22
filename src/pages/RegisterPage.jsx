import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../login.css'

const apiBaseUrl = 'http://localhost:5000'

const apiUnavailableMessage =
  'Unable to connect to QuickWash API. Start the Node server with npm run server.'

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
  const [socialMessage, setSocialMessage] = useState('')
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

      setError(isConnectionError ? apiUnavailableMessage : caughtError.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleGoogleSignup() {
    setSocialMessage('Google signup will be available soon. Please fill the form to create your account.')
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

            <div className="divider" aria-hidden="true">
              <span />
              OR
              <span />
            </div>

            {socialMessage ? (
              <p className="helper-message" role="status">{socialMessage}</p>
            ) : null}

            <button
              className="google-button"
              type="button"
              onClick={handleGoogleSignup}
              aria-label="Continue with Google"
            >
              <svg viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5Z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7Z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.1 35.2 26.7 36 24 36c-5.3 0-9.8-3.4-11.4-8.1l-6.6 5.1C9.3 39.4 16.1 44 24 44Z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.4 4.2-4.5 5.4l.1.1 6.2 5.2-.4.4C38.5 37.5 40 34.9 40 32c0-4.4-1.7-8.3-4.4-11.2 0 0 8-2.3 8-.3Z" />
              </svg>
              Continue with Google
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
