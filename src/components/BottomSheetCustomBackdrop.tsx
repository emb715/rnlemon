import React, {useMemo} from 'react'
import {Pressable, StyleSheet} from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle
} from 'react-native-reanimated'
import {
  BottomSheetBackdropProps,
  useBottomSheetModal
} from '@gorhom/bottom-sheet'

export const BottomSheetCustomBackdrop = ({
  animatedIndex,
  style,
  onDismiss
}: BottomSheetBackdropProps & {onDismiss?: () => void}) => {
  const {dismiss} = useBottomSheetModal()

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animatedIndex.value, [-1, 0], [0, 0.5], {
      extrapolateLeft: Extrapolation.CLAMP
    })
    return {
      opacity: opacity
    }
  }, [])

  const containerStyle = useMemo(
    () => [{backgroundColor: '#000'}, style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  )

  return (
    <Animated.View style={[StyleSheet.absoluteFill, containerStyle]}>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          dismiss()
          onDismiss?.()
        }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  )
}
