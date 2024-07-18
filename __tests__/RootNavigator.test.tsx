import React from 'react'
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import {NavigationContainer} from '@react-navigation/native'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render, screen, waitFor} from '@testing-library/react-native'
import {RootStack} from '../src/navigators/RootNavigator'

const signInSilently = jest.spyOn(GoogleSignin, 'signInSilently')

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ turns retries off
      retry: false
    }
  }
})

jest.useFakeTimers()

describe('RootNavigator', () => {
  test('given the RooStack, user should see the Login screen', async () => {
    signInSilently.mockRejectedValueOnce('error')

    render(
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </QueryClientProvider>
    )
    await waitFor(() => {
      screen.getByText('Login Screen', {exact: true})
      screen.getByText('Mock Sign in with Google', {exact: true})
    })
  })
})
