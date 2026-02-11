import type { Spec } from '@json-render/core'
import { createScreenSpec, formGroupElements, headerElements } from './builders'

export const loginSpec: Spec = createScreenSpec({
  state: {
    email: '',
    password: '',
  },
  headerKey: 'header',
  header: headerElements({
    title: 'welcome back',
    subtitle: 'sign in to continue',
  }),
  bodyChildren: ['loginForm', 'signupLink'],
  body: {
    ...formGroupElements({
      key: 'loginForm',
      fields: [
        {
          key: 'emailField',
          label: 'email',
          placeholder: 'enter your email',
          statePath: '/email',
          keyboardType: 'email-address',
        },
        {
          key: 'passwordField',
          label: 'password',
          placeholder: 'enter your password',
          statePath: '/password',
          secureTextEntry: true,
        },
      ],
      submitLabel: 'log in',
      submitAction: 'login',
      submitParams: {
        email: { path: '/email' },
        password: { path: '/password' },
      },
    }),
    signupLink: {
      type: 'Container',
      props: { padding: 16 },
      children: ['signupLinkBtn'],
    },
    signupLinkBtn: {
      type: 'Button',
      props: {
        label: 'don\'t have an account? sign up',
        variant: 'ghost',
      },
      on: {
        press: {
          action: 'navigate',
          params: { screen: '/(auth)/signup' },
        },
      },
    },
  },
})
