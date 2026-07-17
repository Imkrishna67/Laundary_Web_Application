import { SignUp } from '@clerk/clerk-react'
import '../login.css'

function RegisterPage() {
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
                fill="none"
              />
              <path
                d="M46 15l2.2-4.2L50.5 15l4.2 2.2-4.2 2.2-2.3 4.3-2.2-4.3-4.2-2.2L46 15Z"
                fill="#FFD166"
              />
            </svg>
          </div>
          <h1 id="register-title" className="brand-heading">Create Account</h1>
          <p>Start your Hexa Laundry journey</p>
        </div>

        <div className="clerk-box">
          <SignUp
            signInUrl="/"
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
                
                // --- SIDE BY SIDE BUTTONS SETUP (PERFECT WORKING STRUCTURE) ---
                socialButtonsBlock: {
                  display: 'flex !important',
                  flexDirection: 'row !important',
                  gap: '12px !important',
                  width: '100% !important',
                },
                socialButtonsBlockButton: {
                  flex: '1 !important',
                  display: 'flex !important',
                  justifyContent: 'center !important',
                  alignItems: 'center !important',
                  background: '#21262d',
                  border: '1px solid #30363d',
                  color: '#ffffff',
                  padding: '10px !important',
                  height: '40px',
                },
                socialButtonsBlockButtonText: {
                  fontSize: '14px',
                  fontWeight: '600',
                },
                // ----------------------------------

                dividerLine: { background: '#30363d' },
                dividerText: { color: '#8b949e' },
                formFieldLabel: { color: '#8b949e' },
                formFieldInput: {
                  background: '#0d1117',
                  border: '1px solid #30363d',
                  color: '#ffffff',
                },
                // Main continue key font optimization
                formButtonPrimary: {
                  background: '#18A7FF',
                  color: '#ffffff !important', // Strictly keeps text visible white
                  fontWeight: '700',
                  textTransform: 'none',
                  fontSize: '14px',
                  '&:hover': {
                    background: '#1596e6',
                  }
                },
                // Secondary check targeting internal localization texts
                formButtonPrimary__continue: {
                  color: '#ffffff !important',
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

export default RegisterPage