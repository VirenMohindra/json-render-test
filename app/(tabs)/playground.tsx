import { SpecScreen } from '@/lib/json-render/SpecScreen'
import { playgroundSpec } from '@/specs/playground'

export default function PlaygroundScreen() {
  return <SpecScreen spec={playgroundSpec} type="playground" />
}
