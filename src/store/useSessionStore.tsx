import {create} from 'zustand'
import {User} from '@react-native-google-signin/google-signin'
import {useAppStore} from './useAppStore'

export const sessionInit = (
  userInfo: User,
  {onSuccess}: {onSuccess?: () => void} = {}
) => {
  _sessionSetUser(userInfo)
  onSuccess?.()
}

export const sessionClear = () => {
  useSessionStore.setState(initialState)
  // reset app store on logout
  useAppStore.getState()._reset()
}

export const _sessionSetUser = (userSession: User) => {
  useSessionStore.setState(() => ({
    token: userSession.idToken as string,
    userInfo: userSession.user
  }))
}

export const useIsAuth = () => {
  const {token} = useSessionStore()
  return !!token
}

export const useUserInfo = () => {
  const {userInfo} = useSessionStore()
  return userInfo
}

type State = {
  token?: string
  userInfo?: User['user']
}
const initialState: State = {
  token: undefined,
  userInfo: undefined
}

export const useSessionStore = create(() => initialState)
