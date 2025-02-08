import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Loader2, User, Mail, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { registerApi } from "@/api/authApi"

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

interface SignupFormProps {
    onBackToLogin: () => void
}

export function SignupForm({ onBackToLogin }: SignupFormProps) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [pwd, setPwd] = useState("")
    const [emailError, setEmailError] = useState("")
    const [isPending, setIsPending] = useState(false)
    const { toast } = useToast()

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
        setIsPending(true);
        if (emailError) return
        try {
            await registerApi(name, email, pwd);
            toast({
                title: "Success",
                description: "Your account has been created successfully.",
            })
            setIsPending(false);
            onBackToLogin();
        } catch (error: any) {
            setIsPending(false);
            toast({
                title: "Error",
                description: `Something went wrong. Please try again!`,
                variant: "destructive",
            });
        }

    }

    const isFormValid = name.trim() !== "" && email.trim() !== "" && pwd.trim() !== "" && !emailError

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
                <p className="text-sm text-muted-foreground">Enter your details below to create your account</p>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name" className="sr-only">
                        Name
                    </Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="name"
                            type="text"
                            placeholder="Name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10 transition-all duration-200 ease-in-out"
                        />
                    </div>
                </div>
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
                    {emailError && <p className="text-sm text-red-500 transition-all duration-200 ease-in-out">{emailError}</p>}
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
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                            className="pl-10 transition-all duration-200 ease-in-out"
                        />
                    </div>
                </div>
                <Button
                    type="submit"
                    className={cn(
                        "w-full bg-black text-white transition-all duration-200 ease-in-out",
                        "hover:bg-gray-800",
                        "disabled:bg-gray-500 disabled:text-gray-300"
                    )}
                    disabled={!isFormValid || isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        "Sign Up"
                    )}
                </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                    type="button"
                    onClick={onBackToLogin}
                    className="font-medium text-primary underline-offset-4 hover:underline text-blue-800"
                >
                    Log in
                </button>
            </p>
        </form>
    )
}
