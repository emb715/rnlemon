import React, {useCallback, useEffect, useState} from 'react'
import {ActivityIndicator, Pressable} from 'react-native'
import {useThrottledCallback} from 'use-debounce'
import {Center, ScreenWrapper, Typography, VStack} from '../components'
import {NativeScreenProp} from '../navigators/RootNavigator'
import {signOutWithGoogle} from '../services/googleSignIn'
import {sessionClear} from '../store/useSessionStore'
import {theme} from '../theme/theme'
import {useColorModeValue} from '../theme/tinybase'

export function LogoutScreen(_: NativeScreenProp<'Logout'>) {
  const [isError, setIsError] = useState<boolean>(false)

  const screenBackgroundColor = useColorModeValue(
    theme.light.background,
    theme.dark.background
  )

  const onError = useCallback((error: unknown) => {
    console.error('Logout:', error)
    setIsError(() => true)
  }, [])

  const signOut = useCallback(async () => {
    await signOutWithGoogle({onError})
  }, [onError])

  const forceLogout = useThrottledCallback(() => {
    sessionClear()
  }, 300)

  useEffect(() => {
    signOut()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ScreenWrapper screenBackgroundColor={screenBackgroundColor}>
      <VStack style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Center marginBottom={16}>
          <ActivityIndicator />
        </Center>
        <Typography>Login Out</Typography>

        {isError && (
          <Center marginTop={16}>
            <Typography preset="h5">Unexpected error occurred.</Typography>
            <Pressable
              onPress={forceLogout}
              style={{
                marginTop: 12,
                borderRadius: 6,
                borderColor: '#ccc',
                borderWidth: 1,
                paddingHorizontal: 12,
                paddingVertical: 6
              }}>
              <Typography>Press here to continue</Typography>
            </Pressable>
          </Center>
        )}
      </VStack>
    </ScreenWrapper>
  )
}
