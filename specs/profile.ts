import type { Spec } from '@json-render/core'
import {
  createScreenSpec,
  headerWithBackElements,
  formGroupElements,
} from './builders'

export const profileSpec: Spec = createScreenSpec({
  state: {
    profileName: '',
    profileEmail: '',
    profileBio: '',
  },
  headerKey: 'header',
  header: headerWithBackElements({ title: 'profile' }),
  bodyChildren: ['avatarSection', 'divider1', 'profileForm'],
  body: {
    avatarSection: {
      type: 'Container',
      props: { padding: 16 },
      children: ['avatarRow'],
    },
    avatarRow: {
      type: 'Row',
      props: { justifyContent: 'center' },
      children: ['avatar'],
    },
    avatar: {
      type: 'Avatar',
      props: { initials: 'U', size: 'xl' },
    },
    divider1: { type: 'Divider', props: { margin: 8 } },
    ...formGroupElements({
      key: 'profileForm',
      fields: [
        {
          key: 'nameField',
          label: 'name',
          placeholder: 'your name',
          statePath: '/profileName',
        },
        {
          key: 'emailField',
          label: 'email',
          placeholder: 'your email',
          statePath: '/profileEmail',
          keyboardType: 'email-address',
        },
        {
          key: 'bioField',
          label: 'bio',
          placeholder: 'tell us about yourself',
          statePath: '/profileBio',
        },
      ],
      submitLabel: 'save changes',
      submitAction: 'showAlert',
      submitParams: {
        title: 'saved',
        message: 'your profile has been updated',
      },
    }),
  },
})
