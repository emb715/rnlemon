import React, {useCallback, useEffect, useState} from 'react'
import {Image, Pressable} from 'react-native'
import {useThrottledCallback} from 'use-debounce'
import {
  GoogleSigninButton,
  isErrorWithCode,
  statusCodes
} from '@react-native-google-signin/google-signin'
import {
  Box,
  Center,
  HStack,
  ScreenWrapper,
  Typography,
  VStack
} from '../components'
import {NativeScreenProp} from '../navigators/RootNavigator'
import {
  signInSilentlyWithGoogle,
  signInWithGoogle
} from '../services/googleSignIn'
import {theme} from '../theme/theme'
import {getHexAlpha, useColorModeValue} from '../theme/tinybase'

const LogoImage = require('../assets/5447805-logo.png')

export function LoginScreen(_: NativeScreenProp<'Login'>) {
  const [isError, setIsError] = useState<string>()
  const [inProgress, setInProgress] = useState<boolean>(false)

  const screenBackgroundColor = useColorModeValue(
    theme.light.background,
    theme.dark.background
  )

  useEffect(() => {
    tryToSignInWithGoogle()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSuccess = useCallback(() => {
    console.log('LOG: > onSuccess > onSuccess')
    // Show ui feedback until navigation is ready after auth
  }, [])

  const tryToSignInWithGoogle = useCallback(async () => {
    try {
      setInProgress(() => true)
      await signInSilentlyWithGoogle({
        onSuccess,
        onError: () => {
          // fail silently
        }
      })
    } catch {
      //
    } finally {
      setInProgress(() => false)
    }
  }, [onSuccess])

  const onError = useCallback((error: unknown) => {
    console.log('LOG: > onError > error:', error)
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          // User cancelled action. Fail silently
          break
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // Android-only: play services not available or outdated
          // Web: when calling an unimplemented api (requestAuthorization)
          setIsError('Play services not available or outdated.')
          break
        default:
          setIsError('There was a problem signing in. Try again.')
        // something else happened
      }
    } else {
      setIsError('Unexpected error')
    }
  }, [])

  const signIn = useThrottledCallback(
    async () => {
      setInProgress(() => true)
      try {
        await signInWithGoogle({onSuccess, onError})
      } finally {
        setInProgress(() => false)
      }
    },
    300,
    {
      leading: true
    }
  )

  return (
    <ScreenWrapper screenBackgroundColor={screenBackgroundColor}>
      <VStack
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <Center>
          <Image
            source={LogoImage}
            style={{
              width: 200,
              height: 140
            }}
          />
        </Center>

        <Center marginTop={8}>
          <Typography
            preset="h1"
            variant="light"
            _light={{
              color: theme.light.palette.gray[900]
            }}
            _dark={{
              color: theme.light.palette.gray[100]
            }}>
            EMB Wallet
          </Typography>
          <Typography
            preset="small"
            variant="light"
            marginTop={2}
            _light={{
              color: theme.light.palette.gray[600]
            }}
            _dark={{
              color: theme.light.palette.gray[300]
            }}>
            Some cool description 🎉
          </Typography>
        </Center>
        <Typography preset="medium" variant="light" marginTop={44}>
          Login Screen
        </Typography>

        <Center marginTop={44}>
          <Pressable onPress={signIn} disabled={inProgress}>
            <HStack
              alignItems="center"
              justifyContent="center"
              borderRadius={24}
              paddingLeft={16}
              paddingRight={0}
              borderWidth={1}
              _light={{
                borderColor: theme.light.border,
                backgroundColor: theme.light.background
              }}
              _dark={{
                borderColor: theme.dark.border,
                backgroundColor: theme.dark.background
              }}>
              <Typography
                preset="medium"
                _light={{
                  color: theme.light.primary
                }}
                _dark={{
                  color: theme.light.border
                }}>
                Sign in with Google
              </Typography>
              <Center
                marginLeft={8}
                borderWidth={1}
                _light={{
                  borderColor: theme.light.border
                }}
                _dark={{
                  borderColor: theme.dark.border
                }}
                style={{
                  marginRight: -1,
                  width: 36,
                  height: 36,
                  borderRadius: 40,
                  overflow: 'hidden'
                }}>
                <Box
                  backgroundColor={'#fff'}
                  _ios={{
                    top: -2,
                    left: -1
                  }}
                  _android={{
                    top: -0,
                    left: -0
                  }}>
                  <Box
                    style={{
                      position: 'absolute',
                      zIndex: 10,
                      top: 38,
                      width: 50,
                      height: 5,
                      backgroundColor: '#fff'
                    }}
                  />
                  <GoogleSigninButton
                    size={GoogleSigninButton.Size.Icon}
                    color={'light'}
                    style={{
                      width: 44,
                      height: 44
                    }}
                  />
                </Box>
              </Center>
            </HStack>
          </Pressable>
        </Center>
        {isError && <ErrorBox error={isError} />}
      </VStack>
    </ScreenWrapper>
  )
}

function ErrorBox(props: {error: string}) {
  return (
    <Center
      marginTop={12}
      borderRadius={6}
      borderWidth={1}
      paddingHorizontal={12}
      paddingVertical={8}
      _light={{
        borderColor: getHexAlpha(theme.light.primary, 0.3),
        backgroundColor: getHexAlpha(theme.light.primary, 0.2)
      }}
      _dark={{
        borderColor: getHexAlpha(theme.dark.primary, 0.3),
        backgroundColor: getHexAlpha(theme.dark.primary, 0.2)
      }}>
      <Typography preset="small">{props.error}</Typography>
    </Center>
  )
}
