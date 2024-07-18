import {User} from '@react-native-google-signin/google-signin'
import {renderHook, waitFor} from '@testing-library/react-native'
import * as AppStore from '../useAppStore'
import * as SessionStore from '../useSessionStore'

const mockUser = {
  idToken: 'mytokenid',
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

describe('useIsAuth', () => {
  test('false: no session', async () => {
    const {result} = renderHook(() => SessionStore.useIsAuth())

    await waitFor(() => result.current)
    expect(result.current).toEqual(false)
  })
  test('true: session exist', async () => {
    // set mock user on session
    SessionStore._sessionSetUser(mockUser)

    const {result} = renderHook(() => SessionStore.useIsAuth())

    await waitFor(() => result.current)
    expect(result.current).toEqual(true)
  })
})

describe('sessionInit', () => {
  test('set user data', async () => {
    const onSuccess = jest.fn()
    SessionStore.sessionInit(mockUser, {onSuccess})

    expect(SessionStore.useSessionStore.getState().token).toBe(mockUser.idToken)
    expect(SessionStore.useSessionStore.getState().userInfo).toBe(mockUser.user)
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })
})

describe('sessionClear', () => {
  test('remove user data and clear app store', async () => {
    // Add mock data
    SessionStore.useSessionStore.setState({
      token: mockUser.idToken as string,
      userInfo: mockUser.user
    })
    AppStore.useAppStore.setState({favorite: ['one']})

    SessionStore.sessionClear()

    expect(SessionStore.useSessionStore.getState().token).toBe(undefined)
    expect(SessionStore.useSessionStore.getState().userInfo).toBe(undefined)
    expect(AppStore.useAppStore.getState().favorite.length).toBe(0)
  })
})
