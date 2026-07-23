import { Link } from 'react-router-dom'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold gradient-text mb-6">Create an account</h1>
        <p className="text-surface-400 text-sm">Register page coming in step 6.2</p>
        <Link to="/login" className="btn-outline mt-4 w-full text-center block">
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  )
}
