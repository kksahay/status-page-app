import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useContext, useState } from "react"
import { SignupForm } from "./signup-form"
import { Loader2, Mail, Lock } from "lucide-react"
import type React from "react"
import { useToast } from "@/hooks/use-toast"
import { loginApi } from "@/api/authApi"
import { AuthContext } from "@/context/authContext"
import { useNavigate } from "react-router-dom"

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast()
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("Email is required")
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address")
    } else {
      setEmailError("")
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    validateEmail(newEmail)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (emailError) return
    setIsPending(true);
    try {
      const data = await loginApi(email, password);
      login(data.role);
      navigate(data.role === "admin" ? "/admin" : "/dashboard");
      setIsPending(false);
    } catch (error) {
      setIsPending(false);
      toast({
        title: "Error",
        description: "Login failed. Please check your credentials.",
        variant: "destructive",
      });
    }
  }

  const isFormValid = email.trim() !== "" && password.trim() !== "" && !emailError

  return (
    <div className={cn("space-y-6", className)} {...props}>
      {isLogin ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => validateEmail(email)}
                  className={cn("pl-10 transition-all duration-200 ease-in-out", emailError ? "border-red-500" : "")}
                />
              </div>
              {emailError && (
                <p className="text-sm text-red-500 transition-all duration-200 ease-in-out">{emailError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 transition-all duration-200 ease-in-out"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-black text-white transition-all duration-200 ease-in-out hover:bg-gray-800 disabled:bg-gray-700 disabled:text-gray-400"
              disabled={!isFormValid || isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </Button>

          </div>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className="font-medium text-primary underline-offset-4 hover:underline text-blue-700"
            >
              Sign up
            </button>
          </p>
        </form>
      ) : (
        <SignupForm onBackToLogin={() => setIsLogin(true)} />
      )}
    </div>
  )
}

