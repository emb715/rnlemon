import {GoogleSignin, User} from '@react-native-google-signin/google-signin'
import * as SessionStore from '../../store/useSessionStore'
import * as SignInFromGoogle from '../googleSignIn'

const signIn = jest.spyOn(GoogleSignin, 'signIn')
const signOut = jest.spyOn(GoogleSignin, 'signOut')

const mockUser = {
  idToken: 'my-token-id',
  user: {
    id: 'id',
    name: 'name',
    email: 'email',
    photo: 'photo',
    familyName: null,
    givenName: null
  }
} as User

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks()
})

describe('signInWithGoogle', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(jest.fn())
  })

  const onSuccess = jest.fn()
  const onError = jest.fn()

  test('should set data, call onSuccess', async () => {
    signIn.mockImplementationOnce(() => Promise.resolve(mockUser))
    const setSessionSpy = jest
      .spyOn(SessionStore, 'sessionInit')
      .mockImplementation(() => undefined)

    await SignInFromGoogle.signInWithGoogle({onSuccess, onError})

    expect(setSessionSpy).toHaveBeenCalledWith(mockUser)
    expect(onSuccess).toHaveBeenCalled()
    setSessionSpy.mockRestore()
  })

  test('should error', async () => {
    signIn.mockImplementationOnce(() => Promise.reject('error'))

    await SignInFromGoogle.signInWithGoogle({onSuccess, onError})
    expect(onError).toHaveBeenCalledWith('error')
  })
})
describe('signOutWithGoogle', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(jest.fn())
  })

  const onError = jest.fn()

  test('should be successful', async () => {
    signOut.mockImplementationOnce(() => Promise.resolve(null))

    const clearSessionSpy = jest
      .spyOn(SessionStore, 'sessionClear')
      .mockImplementation(() => undefined)

    await SignInFromGoogle.signOutWithGoogle({onError})

    expect(clearSessionSpy).toHaveBeenCalledWith()
    clearSessionSpy.mockRestore()
  })

  test('should error', async () => {
    signOut.mockImplementationOnce(() => Promise.reject('error'))

    await SignInFromGoogle.signOutWithGoogle({onError})
    expect(onError).toHaveBeenCalledWith('error')
  })
})
