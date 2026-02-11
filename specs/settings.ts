import type { Spec } from '@json-render/core'
import { createScreenSpec, headerElements, sectionElements } from './builders'

export const settingsSpec: Spec = createScreenSpec({
  state: {
    notifications: true,
    darkMode: false,
  },
  headerKey: 'header',
  header: headerElements({ title: 'settings' }),
  bodyChildren: [
    'prefsSection',
    'divider1',
    'accountSection',
    'divider2',
    'logoutContainer',
  ],
  body: {
    ...sectionElements({
      key: 'prefsSection',
      title: 'preferences',
      children: ['notifRow', 'darkModeRow'],
    }),
    notifRow: {
      type: 'SettingsRow',
      props: {
        label: 'notifications',
        description: 'receive push notifications',
        trailingType: 'switch',
        statePath: '/notifications',
      },
    },
    darkModeRow: {
      type: 'SettingsRow',
      props: {
        label: 'dark mode',
        description: 'toggle dark theme',
        trailingType: 'switch',
        statePath: '/darkMode',
      },
    },
    divider1: { type: 'Divider', props: { margin: 8 } },
    ...sectionElements({
      key: 'accountSection',
      title: 'account',
      children: ['profileRow', 'securityRow'],
    }),
    profileRow: {
      type: 'SettingsRow',
      props: {
        label: 'profile',
        description: 'edit your profile',
        trailingType: 'chevron',
      },
      on: { press: { action: 'navigate', params: { screen: '/profile' } } },
    },
    securityRow: {
      type: 'SettingsRow',
      props: {
        label: 'security',
        description: 'password and authentication',
        trailingType: 'chevron',
      },
    },
    divider2: { type: 'Divider', props: { margin: 8 } },
    logoutContainer: {
      type: 'Container',
      props: { padding: 16 },
      children: ['logoutBtn'],
    },
    logoutBtn: {
      type: 'Button',
      props: { label: 'log out', variant: 'danger' },
      on: { press: { action: 'logout', params: {} } },
    },
  },
})
