import React from 'react'
import { Text } from 'react-native'
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

type IconFamily =
  | 'Ionicons'
  | 'Feather'
  | 'MaterialIcons'
  | 'MaterialCommunityIcons';

export interface TabConfig {
  name: string;
  title: string;
  iconFamily: IconFamily;
  icon: string;
  activeIcon?: string;
  badge?: string;
}

export const TAB_CONFIG: TabConfig[] = [
  {
    name: 'index',
    title: 'Home',
    iconFamily: 'Ionicons',
    icon: 'home-outline',
    activeIcon: 'home',
  },
  {
    name: 'settings',
    title: 'Settings',
    iconFamily: 'Ionicons',
    icon: 'settings-outline',
    activeIcon: 'settings',
  },
  {
    name: 'playground',
    title: 'Playground',
    iconFamily: 'Ionicons',
    icon: 'flask-outline',
    activeIcon: 'flask',
  },
]

const ICON_FAMILIES = {
  Ionicons,
  Feather,
  MaterialIcons,
  MaterialCommunityIcons,
}

interface TabIconProps {
  family: IconFamily;
  name: string;
  size: number;
  color: string;
}

// Icon families have specific name unions per component. Since the component
// is dynamically selected, we cast it once to a shared interface.
type IconProps = { name: string; size: number; color: string };

export function TabIcon({ family, name, size, color }: TabIconProps) {
  const IconComponent = ICON_FAMILIES[family]
  if (!IconComponent) {
    if (__DEV__) {
      console.warn(`[TabIcon] unknown icon family: "${family}"`)
    }
    return <Text style={{ fontSize: size, color }}>{"?"}</Text>
  }
  const Icon = IconComponent as React.ComponentType<IconProps>
  return <Icon name={name} size={size} color={color}/>
}
