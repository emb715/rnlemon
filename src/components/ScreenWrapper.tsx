import React, {useMemo} from 'react'
import {
  SafeAreaView,
  StatusBar,
  StatusBarStyle,
  View,
  ViewStyle
} from 'react-native'
import {getStatusBarStyle} from '../theme/tinybase'

type ScreenWrapperProps = React.PropsWithChildren & {
  statusBarStyle?: StatusBarStyle
  statusBarBackgroundColor?: string
  screenBackgroundColor?: string
  screenContainerStyle?: ViewStyle
  viewContainerStyle?: ViewStyle
  viewContainerProps?: React.ComponentProps<typeof View>
  unsafe?: boolean
}

export function ScreenWrapper({
  children,
  statusBarStyle,
  statusBarBackgroundColor,
  screenBackgroundColor,
  screenContainerStyle = {},
  viewContainerStyle = {},
  viewContainerProps = {},
  unsafe
}: ScreenWrapperProps) {
  const defaultBackgroundColor = '#fff'

  const currentBackgroundColor = screenBackgroundColor ?? defaultBackgroundColor
  const statusBarBg = statusBarBackgroundColor ?? currentBackgroundColor
  const defaultStatusBarStyle = getStatusBarStyle(statusBarBg)

  const statusBarContentStyle = useMemo(() => {
    if (statusBarStyle) {
      return statusBarStyle
    } else if (statusBarBg) {
      return getStatusBarStyle(statusBarBg)
    } else {
      return defaultStatusBarStyle
    }
  }, [statusBarStyle, statusBarBg, defaultStatusBarStyle])

  return (
    <View
      style={{flex: 1, flexShrink: 0, height: '100%', ...viewContainerStyle}}
      {...viewContainerProps}>
      {unsafe ? (
        <>
          <StatusBar
            barStyle={statusBarContentStyle}
            backgroundColor={statusBarBg}
          />
          {children}
        </>
      ) : (
        <>
          <StatusBar
            barStyle={statusBarContentStyle}
            backgroundColor={statusBarBg}
          />

          <SafeAreaView
            style={{
              flex: 0,
              zIndex: 99,
              backgroundColor: statusBarBg
            }}
          />
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: currentBackgroundColor,
              ...screenContainerStyle
            }}>
            {children}
          </SafeAreaView>
        </>
      )}
    </View>
  )
}
