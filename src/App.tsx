import React from 'react'
import {QueryClientProvider} from '@tanstack/react-query'
import {RootNavigator} from './navigators/RootNavigator'
import {queryClient} from './store/queryClient'
import {useTinyBase} from './theme/tinybase'

export default function App() {
  useTinyBase()
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
    </QueryClientProvider>
  )
}
