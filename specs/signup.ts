import type { Spec } from '@json-render/core'
import { createScreenSpec, formGroupElements, headerElements } from './builders'

export const signupSpec: Spec = createScreenSpec({
  state: {
    name: '',
    email: '',
    password: '',
  },
  headerKey: 'header',
  header: headerElements({
    title: 'create account',
    subtitle: 'get started with your new account',
  }),
  bodyChildren: ['signupForm', 'loginLink'],
  body: {
    ...formGroupElements({
      key: 'signupForm',
      fields: [
        {
          key: 'nameField',
          label: 'name',
          placeholder: 'enter your name',
          statePath: '/name',
        },
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
          placeholder: 'choose a password',
          statePath: '/password',
          secureTextEntry: true,
        },
      ],
      submitLabel: 'sign up',
      submitAction: 'signup',
      submitParams: {
        name: { path: '/name' },
        email: { path: '/email' },
        password: { path: '/password' },
      },
    }),
    loginLink: {
      type: 'Container',
      props: { padding: 16 },
      children: ['loginLinkBtn'],
    },
    loginLinkBtn: {
      type: 'Button',
      props: {
        label: 'already have an account? log in',
        variant: 'ghost',
      },
      on: {
        press: {
          action: 'navigate',
          params: { screen: '/(auth)/login' },
        },
      },
    },
  },
})
