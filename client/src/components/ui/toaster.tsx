import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, variant, ...props }) => {
        const isError = variant === "destructive"

        return (
          <Toast
            key={id}
            {...props}
            className={cn(
              "relative flex items-center justify-between gap-2 rounded-l p-2 transition-all duration-300",
              "border-none dark:border-gray-800",
              isError
                ? "bg-red-600 text-white"
                : "bg-green-600 text-white"
            )}
          >
            <div className="flex flex-col gap-1">
              {title && <ToastTitle className="text-md font-semibold">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-sm opacity-90">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-white opacity-90 hover:opacity-100 transition-opacity" />
          </Toast>
        )
      })}
      <ToastViewport className="fixed bottom-4 right-4 flex flex-col gap-2 p-4" />
    </ToastProvider>
  )
}
