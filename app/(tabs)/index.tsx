import { SpecScreen } from '@/lib/json-render/SpecScreen'
import { dashboardSpec } from '@/specs/dashboard'

export default function HomeScreen() {
  return <SpecScreen spec={dashboardSpec} type="dashboard" />
}
