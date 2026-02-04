import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, KeyRound, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@store/authStore'
import { Button } from '@components/common/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@components/common/Card'
import { Input } from '@components/common/Input'
import { cn } from '@utils/cn'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { isLoading, error, login, verifyOtp, clearError } = useAuthStore()

  const [step, setStep] = useState('credentials')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    if (resendTimer <= 0) return

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [resendTimer])

  useEffect(() => {
    clearError()
  }, [step, clearError])

  function getMaskedEmail() {
    if (!email) return ''
    const [local, domain] = email.split('@')
    if (!domain) return email
    const visible = local.slice(0, 2)
    return `${visible}${'*'.repeat(Math.max(local.length - 2, 0))}@${domain}`
  }

  async function handleLoginSubmit(e) {
    e.preventDefault()
    if (!email || !password) return

    const result = await login(email, password)
    if (result?.otpRequired) {
      setStep('otp')
      setResendTimer(60)
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault()
    if (otp.length !== 6) return

    const success = await verifyOtp(email, otp)
    if (success) {
      navigate('/admin/dashboard')
    }
  }

  function handleResend() {
    if (resendTimer > 0) return
    setResendTimer(60)
    setOtp('')
  }

  const handleOtpChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setOtp(value)
  }, [])

  if (step === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-sage-50 dark:bg-sage-950">
        <Card variant="elevated" className="w-full max-w-md mx-auto" padding="lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-3">
              <KeyRound size={22} className="text-white" />
            </div>
            <CardTitle as="h1" className="text-xl">
              Enter Verification Code
            </CardTitle>
            <p className="text-sm text-olive-500 dark:text-sage-400 mt-1">
              We've sent a 6-digit code to {getMaskedEmail()}
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="000000"
                  className={cn(
                    'w-full text-center text-3xl font-mono tracking-[0.5em] py-4',
                    'bg-sage-50 border border-sage-200 rounded-xl',
                    'focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500',
                    'dark:bg-sage-900 dark:border-sage-700 dark:text-sage-100',
                    'dark:focus:border-green-400 dark:focus:ring-green-400/50',
                    'placeholder:text-sage-300 dark:placeholder:text-sage-600'
                  )}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                fullWidth
                loading={isLoading}
                disabled={otp.length !== 6}
              >
                Verify Code
              </Button>

              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-olive-400 dark:text-sage-500">
                    Resend code in {resendTimer}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
                  >
                    Resend code
                  </button>
                )}
              </div>

              <p className="text-xs text-center text-olive-400 dark:text-sage-500">
                Demo: Enter any 6 digits
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-sage-50 dark:bg-sage-950">
      <Card variant="elevated" className="w-full max-w-md mx-auto" padding="lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-3">
            <Lock size={22} className="text-white" />
          </div>
          <CardTitle as="h1" className="text-xl">
            Admin Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@demo.com"
              leftIcon={Mail}
              required
            />

            <div>
              <label className="block text-sm font-medium text-olive-700 dark:text-sage-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-olive-400 dark:text-sage-500">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className={cn(
                    'w-full pl-10 pr-10 py-2 text-sm rounded-xl',
                    'bg-sage-50 border border-sage-200 text-olive-800 placeholder:text-olive-400',
                    'transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500',
                    'dark:bg-sage-900 dark:border-sage-700 dark:text-sage-100 dark:placeholder:text-sage-500',
                    'dark:focus:border-green-400 dark:focus:ring-green-400/50'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-olive-400 hover:text-olive-600 dark:text-sage-500 dark:hover:text-sage-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              disabled={!email || !password}
            >
              Sign In
            </Button>

            <p className="text-xs text-center text-olive-400 dark:text-sage-500">
              Demo: Use any email and password
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
