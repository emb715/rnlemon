import {GoogleSignin} from '@react-native-google-signin/google-signin'
import {sessionClear, sessionInit} from '../store/useSessionStore'

GoogleSignin.configure({
  // Required for android to work
  webClientId:
    '511163273597-c2vr50vnjrmk86158k4b3qcmuourt75m.apps.googleusercontent.com'
})

export const signInSilentlyWithGoogle = async ({
  onSuccess,
  onError
}: {
  onSuccess: () => void
  onError: (e: unknown) => void
}) => {
  try {
    const userInfo = await GoogleSignin.signInSilently()
    if (userInfo && userInfo.idToken) {
      sessionInit(userInfo)
    }
    onSuccess()
  } catch (error) {
    onError(error)
  }
}

export const signInWithGoogle = async ({
  onSuccess,
  onError
}: {
  onSuccess: () => void
  onError: (e: unknown) => void
}) => {
  try {
    await GoogleSignin.hasPlayServices()
    const userInfo = await GoogleSignin.signIn()
    if (!userInfo || !userInfo.idToken) {
      // A valid user should have idToken
      throw new Error('SignIn fail, no user info or idToken')
    }
    sessionInit(userInfo)
    onSuccess()
  } catch (error) {
    onError(error)
  }
}

export const signOutWithGoogle = async ({
  onError
}: {
  onError: (e: unknown) => void
}) => {
  try {
    await GoogleSignin.signOut()
    sessionClear()
  } catch (error) {
    onError(error)
  }
}
