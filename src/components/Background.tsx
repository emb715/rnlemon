import React, {memo} from 'react'
import {theme} from '../theme/theme'
import {useColorModeValue} from '../theme/tinybase'
import {BackgroundSVG} from './BackgroundSVG'
import {Box, Center} from './primitives'

export const Background = memo(function () {
  const shadowColor = useColorModeValue(theme.light.border, theme.dark.card)
  return (
    <Box
      _light={{
        backgroundColor: theme.light.background
      }}
      _dark={{
        backgroundColor: theme.dark.background
      }}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }}>
      <Center opacity={0.1}>
        <BackgroundSVG />
      </Center>
      <Box
        style={{
          position: 'absolute',
          top: -100,
          left: '25%',
          width: '50%',
          height: 100,
          borderRadius: 100,
          backgroundColor: shadowColor,
          shadowColor: shadowColor,
          shadowOffset: {
            width: 0,
            height: 10
          },
          shadowOpacity: 1,
          shadowRadius: 20,
          elevation: 10
        }}
      />

      <Box
        style={{
          position: 'absolute',
          bottom: -100,
          left: '25%',
          width: '50%',
          height: 100,
          borderRadius: 100,
          backgroundColor: shadowColor,
          shadowColor: shadowColor,
          shadowOffset: {
            width: 0,
            height: -10
          },
          shadowOpacity: 1,
          shadowRadius: 20,
          elevation: 10
        }}
      />
    </Box>
  )
})
