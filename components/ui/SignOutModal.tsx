// -----------------------------------------------------------------------------
// File: SignOutModal.tsx
// Path: components/ui/SignOutModal.tsx
// -----------------------------------------------------------------------------

'use client'

import { useRouter }    from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { apiClient }    from '@/lib/api/client'

export function SignOutModal({ onClose }: { onClose: () => void }) {
  const router    = useRouter()
  const clearAuth = useAuthStore((s) => s.clearAuth)

  const handleSignOut = async () => {
    // Tell the backend to invalidate the session — fire and forget,
    // we don't block the UI on this call
    apiClient.post('/auth/logout', {}).catch(() => {})

    clearAuth()
    onClose()
    router.push('/login')
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-[#fee2e2] flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </div>

        {/* Text */}
        <h2 className="text-center font-semibold text-[#111111] text-lg mb-1">Sign out?</h2>
        <p className="text-center text-sm text-[#6b6b6b] mb-6">
          You'll need to sign back in to access your account.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#e5e5e5] rounded-xl text-sm font-medium text-[#6b6b6b] hover:bg-[#f5f5f4] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSignOut}
            className="flex-1 py-2.5 bg-[#dc2626] text-white rounded-xl text-sm font-semibold hover:bg-[#b91c1c] transition-colors"
          >
            Yes, Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
