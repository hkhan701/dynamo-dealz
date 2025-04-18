"use client"

import { useEffect } from "react"
import { Link as LinkIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CopyAlertProps {
  show: boolean
  onDismiss: () => void
  message: string
}

export default function CopyAlert({ show, onDismiss, message }: CopyAlertProps) {
  useEffect(() => {
    if (!show) return
    const timer = setTimeout(() => onDismiss(), 3000)
    return () => clearTimeout(timer)
  }, [show, onDismiss])

  return (
    <div
      className={`fixed top-4 right-4 z-50 w-64 max-w-full transition-all duration-300 ease-in-out ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
    >
      <Alert className="bg-green-50 border-green-200 text-green-800 shadow-md rounded-lg">
        <AlertDescription className="flex items-center justify-center py-2 text-sm">
          <LinkIcon className="h-4 w-4 mr-2" />
          {message}
        </AlertDescription>
      </Alert>
    </div>
  )
}