import React from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useApp } from '../lib/store.jsx'

export default function Toasts() {
  const { toasts } = useApp()
  if (!toasts.length) return null
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[80] flex w-[min(92%,420px)] -translate-x-1/2 flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-2 rounded-xl px-4 py-3 text-xs font-semibold text-white shadow-soft ${
            toast.tone === 'error' ? 'bg-[#D34C70]' : 'bg-ink'
          }`}
          role="status"
        >
          {toast.tone === 'error' ? (
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
          ) : (
            <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  )
}
