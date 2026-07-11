import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSignIn } from '@clerk/clerk-react'
import '../login.css'

function LoginPage() {
  const navigate = useNavigate()
  const { signIn, isLoaded } = useSignIn()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  function clearFieldError(field) {
    setFieldErrors((currentErrors) => {
      if (!currentErrors[field]) return currentErrors
      return { ...currentErrors, [field]: '' }
    })
    setError('')
    setSuccessMessage('')
  }

  function validateIdentifier(value) {
    const trimmedValue = value.trim()
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    const mobilePattern = /^[6-9]\d{9}$/
    if (!trimmedValue) return 'Please enter your mobile number or email.'
    if (emailPattern.test(trimmedValue) || mobilePattern.test(trimmedValue)) return ''
    return 'Enter a valid email or 10-digit mobile number.'
  }

  function validatePassword(value) {
    if (!value) return 'Please enter your password.'
    if (value.length < 6) return 'Password must be at least 6 characters.'
    return ''
  }

  async function handleLogin(event) {
    event.preventDefault()
    if (!isLoaded) return

    const identifierError = validateIdentifier(identifier)
    const passwordError = validatePassword(password)

    if (identifierError || passwordError) {
      setFieldErrors({ identifier: identifierError, password: passwordError })
      return
    }

    setIsLoading(true)
    setError('')
    setSuccessMessage('')
    setFieldErrors({})

    try {
      const result = await signIn.create({
        identifier: identifier.trim(),
        password,
      })

      if (result.status === 'complete') {
        const user = result.userData || {}
        localStorage.setItem('hexalaundaryUser', JSON.stringify({
          identifier: identifier.trim(),
          fullName: user.fullName || '',
          email: user.emailAddresses?.[0]?.emailAddress || identifier.trim(),
          loggedInAt: new Date().toISOString(),
        }))
        setSuccessMessage('Login successful! Welcome to Hexa Laundary.')
        navigate('/home')
      }
    } catch (err) {
      const message = err?.errors?.[0]?.message || 'Invalid credentials. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleLogin() {
    if (!isLoaded) return
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: `${window.location.origin}/#/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/#/home`,
      })
    } catch (err) {
      setError('Google login failed. Please try again.')
    }
  }

  function handleForgotPassword(event) {
    event.preventDefault()
  }

  return (
    <main className="login-page">
      <div className="login-bg-orb login-bg-orb-one" />
      <div className="login-bg-orb login-bg-orb-two" />

      <section className="login-shell" aria-labelledby="login-title">
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
          <h1 id="login-title">Hexa Laundary</h1>
          <p>Laundry made easy</p>
        </div>

        <div className="login-card">
          <form className="login-form" onSubmit={handleLogin} noValidate>
            <div className="field-group">
              <label htmlFor="identifier">Mobile number / Email</label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                value={identifier}
                onChange={(event) => {
                  setIdentifier(event.target.value)
                  clearFieldError('identifier')
                }}
                placeholder="Enter mobile or email"
                autoComplete="username"
                autoCapitalize="none"
                inputMode="email"
                aria-invalid={Boolean(fieldErrors.identifier)}
                aria-describedby={fieldErrors.identifier ? 'identifier-error' : undefined}
              />
              {fieldErrors.identifier ? (
                <p id="identifier-error" className="field-error">{fieldErrors.identifier}</p>
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
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {fieldErrors.password ? (
                <p id="password-error" className="field-error">{fieldErrors.password}</p>
              ) : null}
            </div>

            {error ? <div className="error-message" role="alert">{error}</div> : null}
            {successMessage ? (
              <div className="success-message" role="status">{successMessage}</div>
            ) : null}

            <button className="primary-button" type="submit" disabled={isLoading || !isLoaded}>
              {isLoading ? <span className="spinner" aria-hidden="true" /> : null}
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            <div className="form-actions">
              <a href="/forgot-password" className="text-link" onClick={handleForgotPassword}>
                Forgot Password?
              </a>
              <span>Don&apos;t have an account?</span>
            </div>

            <div className="divider" aria-hidden="true">
              <span />
              OR
              <span />
            </div>

            <button
              className="google-button"
              type="button"
              onClick={handleGoogleLogin}
              disabled={!isLoaded}
              aria-label="Continue with Google"
            >
              <svg viewBox="0 0 48 48" aria-hidden="true" width="20" height="20">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5Z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7Z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.1 35.2 26.7 36 24 36c-5.3 0-9.8-3.4-11.4-8.1l-6.6 5.1C9.3 39.4 16.1 44 24 44Z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.4 4.2-4.5 5.4l6.2 5.2C38.5 37.5 44 34 44 24c0-1.3-.1-2.4-.4-3.5Z" />
              </svg>
              Continue with Google
            </button>
          </form>

          <div className="signup-row">
            <Link to="/register" className="signup-link">Sign Up</Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LoginPage