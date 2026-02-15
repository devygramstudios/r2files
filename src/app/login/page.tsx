
import LoginForm from './login-form'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                        R2 Manager
                    </h1>
                    <p className="text-slate-400">
                        Secure cloud storage management
                    </p>
                </div>

                <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-xl">
                    <LoginForm />
                </div>

                <p className="text-center text-sm text-slate-500">
                    Powered by Cloudflare R2 & Supabase
                </p>
            </div>
        </div>
    )
}
