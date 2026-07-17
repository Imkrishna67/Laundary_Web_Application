import { SignIn } from '@clerk/clerk-react'
import '../login.css'

function LoginPage() {
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
                fill="none"
              />
              <path
                d="M46 15l2.2-4.2L50.5 15l4.2 2.2-4.2 2.2-2.3 4.3-2.2-4.3-4.2-2.2L46 15Z"
                fill="#FFD166"
              />
            </svg>
          </div>
          <h1 id="login-title" className="brand-heading">Welcome to Hexa Laundry</h1>
          <p>Your laundry, managed with ease</p>
        </div>

        <div className="clerk-box">
          <SignIn
            signUpUrl="/register"
            forceRedirectUrl="/home"
            appearance={{
              variables: {
                colorBackground: '#0d1117',
                colorText: '#ffffff',
                colorPrimary: '#18A7FF',
                colorInputBackground: '#161b22',
                colorInputText: '#ffffff',
                colorNeutral: '#8b949e',
                borderRadius: '8px',
              },
              elements: {
                card: {
                  background: '#161b22',
                  border: '1px solid #30363d',
                  boxShadow: 'none',
                },
                headerTitle: { color: '#ffffff' },
                headerSubtitle: { color: '#8b949e' },
                
                // --- LOGIN WALA FIXED SIDE-BY-SIDE BUTTON SETUP ---
                socialButtonsBlock: {
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '8px',
                  width: '100%',
                },
                socialButtonsBlockButton: {
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: '#21262d',
                  border: '1px solid #30363d',
                  color: '#ffffff',
                  padding: '10px',
                  height: '40px',
                },
                socialButtonsBlockButtonText: {
                  fontSize: '13px',
                  fontWeight: '500',
                },
                // --------------------------------------------------

                dividerLine: { background: '#30363d' },
                dividerText: { color: '#8b949e' },
                formFieldLabel: { color: '#8b949e' },
                formFieldInput: {
                  background: '#0d1117',
                  border: '1px solid #30363d',
                  color: '#ffffff',
                },
                // Niche waale main button ka color bright white force kiya
                formButtonPrimary: {
                  background: '#18A7FF',
                  color: '#ffffff !important',
                  fontWeight: '700',
                  textTransform: 'none',
                },
                footerActionText: { color: '#8b949e' },
                footerActionLink: { color: '#18A7FF' },
                identityPreviewText: { color: '#ffffff' },
              }
            }}
          />
        </div>
      </section>
    </main>
  )
}

export default LoginPage