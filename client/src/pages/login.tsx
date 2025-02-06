import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center text-2xl font-semibold tracking-tight mb-10">
            <GalleryVerticalEnd className="h-8 w-8 mr-2" />
            <span>Status App</span>
          </div>
          <LoginForm />
        </div>
      </div>
      <div className="relative hidden lg:flex lg:flex-1 lg:flex-col overflow-hidden">
        <div className="absolute inset-0 bg-gray-900 transition-all duration-500 ease-in-out hover:bg-gray-800" />
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center p-8 text-white transition-all duration-500 ease-in-out">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900 opacity-70" />
          <div className="relative z-20 text-center space-y-8">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">
              Welcome to <span className="text-blue-400">Status App</span>
            </h2>
            <p className="text-xl max-w-md font-medium leading-relaxed">
              Manage the status of your services with ease and precision.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse [animation-delay:0.2s]" />
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse [animation-delay:0.4s]" />
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

