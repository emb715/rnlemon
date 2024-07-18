import React from 'react'
import {useColorScheme} from 'react-native'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer
} from '@react-navigation/native'
import {
  createNativeStackNavigator,
  NativeStackScreenProps
} from '@react-navigation/native-stack'
import {DetailsScreen, HomeScreen, LoginScreen, LogoutScreen} from '../screens/'
import {useIsAuth} from '../store/useSessionStore'

type RootStackParamList = {
  Home: undefined
  Details: {
    id: string
  }
  Login: undefined
  Logout: undefined
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type NativeScreenProp<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>

const Stack = createNativeStackNavigator<RootStackParamList>()

export const RootStack = () => {
  //
  const isAuth = useIsAuth()

  return (
    <GestureHandlerRootView style={{flexGrow: 1}}>
      <Stack.Navigator>
        {!isAuth ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen
              name="Details"
              component={DetailsScreen}
              options={{
                presentation: 'containedModal',
                headerShown: false,
                animation: 'fade'
              }}
            />
            <Stack.Screen
              name="Logout"
              component={LogoutScreen}
              options={{
                headerShown: false
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </GestureHandlerRootView>
  )
}

export const RootNavigator = () => {
  const isDarkMode = useColorScheme() === 'dark'

  const navigationTheme = React.useMemo(() => {
    return isDarkMode ? DarkTheme : DefaultTheme
  }, [isDarkMode])

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootStack />
    </NavigationContainer>
  )
}
