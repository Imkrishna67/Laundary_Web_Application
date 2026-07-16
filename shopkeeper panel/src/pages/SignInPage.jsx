import { SignIn } from '@clerk/clerk-react'
import '../login.css'

function SignInPage() {
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
          <p>Shopkeeper Panel</p>
        </div>

        <div className="login-card clerk-card">
          <SignIn
            routing="hash"
            redirectUrl="/dashboard"
            signUpUrl="/sign-in"
            appearance={{
              variables: {
                colorPrimary: '#4F8EF7',
                colorBackground: 'transparent',
                colorText: 'var(--text)',
                borderRadius: '12px'
              }
            }}
          />
        </div>
      </section>
    </main>
  )
}

export default SignInPage
