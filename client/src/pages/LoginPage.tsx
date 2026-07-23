import { Link } from 'react-router-dom'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold gradient-text mb-6">Sign in to AutoVault</h1>
        <p className="text-surface-400 text-sm">Login page coming in step 6.2</p>
        <Link to="/register" className="btn-outline mt-4 w-full text-center block">
          No account? Register
        </Link>
      </div>
    </div>
  )
}
