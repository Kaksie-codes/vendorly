// If someone visits /reset-password without a token, send them to forgot-password
import { redirect } from 'next/navigation'

export default function ResetPasswordNoToken() {
  redirect('/forgot-password')
}
