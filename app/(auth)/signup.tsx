import { SpecScreen } from '@/lib/json-render/SpecScreen'
import { signupSpec } from '@/specs/signup'

export default function SignupScreen() {
  return <SpecScreen spec={signupSpec} type="auth" />
}
