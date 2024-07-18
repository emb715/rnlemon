import {Text as RNText, View as RNView} from 'react-native'
import {theme} from '../theme/theme'
import {createComponent} from '../theme/tinybase'

export const HStack = createComponent(RNView, {
  flexDirection: 'row',
  flexWrap: 'wrap'
})
export const VStack = createComponent(RNView, {
  flexDirection: 'column'
})
export const Center = createComponent(RNView, {
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center'
})

export const Box = createComponent(RNView)

export const Text = createComponent(RNText, {
  _light: {
    color: theme.light.text
  },
  _dark: {
    color: theme.dark.text
  }
})
