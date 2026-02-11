import { SpecScreen } from '@/lib/json-render/SpecScreen'
import { settingsSpec } from '@/specs/settings'

export default function SettingsScreen() {
  return <SpecScreen spec={settingsSpec} type="settings" />
}
