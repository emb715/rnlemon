import React, {useMemo} from 'react'
import {TouchableHighlight, View, ViewStyle} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useThrottledCallback} from 'use-debounce'
import {create} from 'zustand'
import {useNavigation} from '@react-navigation/core'
import {ChevronLeftIcon, CloseIcon} from './Icons'
import {Typography} from './Typography'

export const defaultHeaderHeight = 44

export const useHeaderHeight = create<{
  headerHeight: number
  setHeaderHeight: (height: number) => void
}>(set => ({
  headerHeight: 0,
  setHeaderHeight: (height: number) => set(() => ({headerHeight: height}))
}))

type HeaderProps = {
  title?: string
  titleComponent?: () => React.ReactElement
  rightComponent?: () => React.ReactElement
  onPressBack?: () => void
  safeArea?: boolean
  style?: ViewStyle
}

function Header({
  title,
  titleComponent: TitleComponent,
  rightComponent: RightComponent,
  onPressBack,
  safeArea = true,
  style = {}
}: HeaderProps) {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const onBack = useThrottledCallback(
    () => onPressBack?.() ?? navigation.goBack(),
    300
  )

  const {setHeaderHeight} = useHeaderHeight.getState()

  const renderTitle = useMemo(() => {
    if (TitleComponent) {
      return <TitleComponent />
    }
    return <Typography>{title}</Typography>
  }, [title, TitleComponent])

  const renderRight = useMemo(() => {
    if (RightComponent) {
      return <RightComponent />
    }
    return <HeaderButtonPlaceHolder />
  }, [RightComponent])

  const safeAreaBox = useMemo(() => {
    if (!safeArea) {
      return {
        top: undefined,
        right: undefined,
        left: undefined
      }
    }
    return {
      top: insets.top,
      right: insets.right,
      left: insets.left
    }
  }, [safeArea, insets])

  return (
    <View
      onLayout={event => {
        const height = event.nativeEvent.layout.height
        setHeaderHeight(height)
      }}
      style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: safeAreaBox.top,
        paddingRight: safeAreaBox.right,
        paddingLeft: safeAreaBox.left,
        paddingBottom: 8,
        ...style
      }}>
      <HeaderButtonClose onPress={onBack} />
      <View
        style={{
          position: 'absolute',
          zIndex: -1,
          top: safeAreaBox.top,
          bottom: 8,
          left: 0,
          right: 0,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        {renderTitle}
      </View>

      {renderRight}
    </View>
  )
}

const headerButtonSize = 44
const headerIconSize = 32

type HeaderButtonProps = {
  onPress: () => void
  iconColor?: string
}
function HeaderButtonBack({onPress, iconColor, ...rest}: HeaderButtonProps) {
  return (
    <HeaderButton onPress={onPress} {...rest}>
      <ChevronLeftIcon size={headerIconSize} fill={iconColor ?? '#fff'} />
    </HeaderButton>
  )
}
function HeaderButtonClose({onPress, iconColor, ...rest}: HeaderButtonProps) {
  return (
    <HeaderButton onPress={onPress} {...rest}>
      <CloseIcon size={headerIconSize} fill={iconColor ?? '#fff'} />
    </HeaderButton>
  )
}

function HeaderButton({
  onPress,
  children,
  style = undefined,
  ...rest
}: React.PropsWithChildren<
  HeaderButtonProps & React.ComponentProps<typeof TouchableHighlight>
>) {
  return (
    <TouchableHighlight
      onPress={onPress}
      style={[
        {
          width: headerButtonSize,
          height: headerButtonSize,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10
        },
        (style as ViewStyle) ?? {}
      ]}
      underlayColor="#140528"
      {...rest}>
      <>{children}</>
    </TouchableHighlight>
  )
}
HeaderButton.Back = HeaderButtonBack
HeaderButton.Close = HeaderButtonClose
HeaderButton.PlaceHolder = HeaderButtonPlaceHolder

function HeaderButtonPlaceHolder() {
  return (
    <View
      style={{
        width: headerButtonSize,
        height: headerButtonSize,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    />
  )
}

Header.Button = HeaderButton

export {Header, HeaderButton, headerIconSize, headerButtonSize}
