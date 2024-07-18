import React, {memo} from 'react'
import {Image} from 'react-native'
import {theme} from '../theme/theme'
import {useColorModeValue} from '../theme/tinybase'
import {Center, VStack} from './primitives'
import {Typography} from './Typography'

export const Avatar = memo(function (props: {
  image?: string | null
  letters: string
}) {
  const shadowColor = useColorModeValue(theme.light.primary, theme.dark.card)
  return (
    <VStack
      borderRadius={99}
      padding={2}
      _light={{
        backgroundColor: theme.light.card
      }}
      _dark={{
        backgroundColor: theme.dark.card
      }}
      style={{
        shadowColor: shadowColor,
        shadowOffset: {
          width: 0,
          height: 0
        },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 5
      }}>
      {props.image ? (
        <Image
          src={props.image ?? ''}
          alt=""
          style={{
            overflow: 'hidden',
            borderRadius: 99,
            width: 36,
            height: 36
          }}
        />
      ) : (
        <Center
          _light={{
            borderColor: theme.light.border
          }}
          _dark={{
            borderColor: theme.dark.border
          }}
          style={{
            overflow: 'hidden',
            borderWidth: 1,
            borderRadius: 99,
            width: 36,
            height: 36
          }}>
          <Typography>{props.letters.slice(0, 2)}</Typography>
        </Center>
      )}
    </VStack>
  )
})
