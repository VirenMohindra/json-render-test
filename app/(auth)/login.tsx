import { SpecScreen } from '@/lib/json-render/SpecScreen'
import { loginSpec } from '@/specs/login'

export default function LoginScreen() {
  return <SpecScreen spec={loginSpec} type="auth" />
}
