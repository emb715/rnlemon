import React, {ComponentType, useEffect, useMemo, useRef} from 'react'
import {
  Appearance,
  ColorSchemeName,
  FlexStyle,
  ImageStyle,
  Platform,
  ShadowStyleIOS as RNShadowStyleIOS,
  StyleProp,
  StyleSheet,
  TextStyle,
  TextStyleAndroid as RNTextStyleAndroid,
  TextStyleIOS as RNTextStyleIOS,
  TransformsStyle as RNTransformsStyle,
  ViewStyle
} from 'react-native'
import {create} from 'zustand'

/*****************************
 * EMB Tiny base. Simple UI Lib
 *****************************/

/**
 * UTILS COLOR
 **************/
type ColorMode = {
  colorMode: ColorSchemeName
}

export const useColorMode = create<ColorMode>(() => ({
  colorMode: Appearance.getColorScheme()
}))

export const useTinyBase = () => {
  const initRef = useRef<boolean>(false)
  useEffect(() => {
    if (initRef.current === false) {
      Appearance.addChangeListener(colorMode => {
        useColorMode.setState({colorMode: colorMode.colorScheme})
      })
      initRef.current = true
    }
  }, [])
}

export const useColorModeValue = <
  TLight extends string | Record<string, unknown>,
  TDark extends string | Record<string, unknown>
>(
  light: TLight,
  dark: TDark
) => {
  const {colorMode} = useColorMode()

  return useMemo(
    () => (colorMode === 'dark' ? (dark as TDark) : (light as TLight)),
    [colorMode, light, dark]
  )
}

function getRGB(c: string) {
  return parseInt(c, 16)
}
function getsRGB(c: string) {
  return getRGB(c) / 255 <= 0.03928
    ? getRGB(c) / 255 / 12.92
    : Math.pow((getRGB(c) / 255 + 0.055) / 1.055, 2.4)
}
function getLuminance(hexColor: string) {
  return (
    0.2126 * getsRGB(hexColor.substr(1, 2)) +
    0.7152 * getsRGB(hexColor.substr(3, 2)) +
    0.0722 * getsRGB(hexColor.substr(-2))
  )
}
function getContrast(f: string, b: string) {
  const L1 = getLuminance(f)
  const L2 = getLuminance(b)
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
}

const colors = {
  white: '#ffffff',
  black: '#000000'
} as const

type Color = typeof colors.white | typeof colors.black

export function getTextColor(bgColor: string, alpha?: number): Color | string {
  const whiteContrast = getContrast(bgColor, colors.white)
  const blackContrast = getContrast(bgColor, colors.black)
  const color = whiteContrast > blackContrast ? colors.white : colors.black
  if (!alpha) {
    return color
  }
  return getHexAlpha(color, alpha)
}

export function getStatusBarStyle(bgColor: string) {
  const textColor = getTextColor(bgColor)
  return textColor === colors.white ? 'light-content' : 'dark-content'
}

/**
 * @param alpha {number} between 0 and 1
 */
export function getHexAlpha(color: string, alpha: number) {
  // const isHex = color.startsWith('#')
  if (!color.startsWith('#')) {
    console.warn('getHexAlpha: missing # in hex color.')
    return color
  }
  const hexLength = color.slice(1).length
  const hexAlpha = Math.round(alpha * 255)
    .toString(16)
    .toUpperCase()
    .padStart(2, '0')

  const colorFull =
    hexLength === 3
      ? color
          .slice(1)
          .split('')
          .flatMap(x => x + x)
          .join('')
      : color.slice(1)
  return `#${colorFull}${hexAlpha}`
}

/**
 * COMPONENT CREATION
 ***********************/

type StylesType = ViewStyle | TextStyle | ImageStyle

type WebStyles = React.CSSProperties

type CustomPropStyle<TStyle = StylesType> = StylesType & {
  _light?: TStyle
  _dark?: TStyle
  _web?: WebStyles
  _native?: TStyle
  _ios?: TStyle
  _android?: TStyle
}

type PropsWithStyles<TStyle extends StyleProp<unknown>> =
  CustomPropStyle<TStyle>

export const createComponent =
  <Props extends {style?: StyleProp<unknown>}>(
    Component: ComponentType<Props>,
    customStyleProps?: PropsWithStyles<Props['style']>
  ) =>
  (props: Props & PropsWithStyles<Props['style']>) => {
    const mergeStyleProps = {...customStyleProps, ...props}
    const resolvedProps = resolveProps<Props>(
      mergeStyleProps,
      Component.displayName as LookPropsComponentType
    )

    const generatedStyles = createStyle({
      styleProp: resolvedProps.styleProp,
      atomicStyles: resolvedProps.atomic,
      light: resolvedProps.customProps?._light,
      dark: resolvedProps.customProps?._dark,
      web: resolvedProps.customProps?._web,
      native: resolvedProps.customProps?._native,
      ios: resolvedProps.customProps?._ios,
      android: resolvedProps.customProps?._android
    })

    // Select by platform
    const platformStyle = Platform.select({
      web: generatedStyles.web,
      native: generatedStyles.native,
      ios: generatedStyles.ios,
      android: generatedStyles.android,
      default: {}
    })
    const colorModeStyle = useColorModeValue(
      generatedStyles.light as Record<string, unknown>,
      generatedStyles.dark as Record<string, unknown>
    )

    const mergedStyles = useMemo(
      () => [generatedStyles.component, platformStyle, colorModeStyle],
      [colorModeStyle, generatedStyles.component, platformStyle]
    )
    return React.createElement(Component, {...props, style: mergedStyles})
  }

type CreateStyleParams = {
  styleProp?: object
  atomicStyles?: object
  light?: object
  dark?: object
  web?: object
  native?: object
  ios?: object
  android?: object
}
function createStyle({
  styleProp = {},
  atomicStyles = {},
  light = {},
  dark = {},
  web = {},
  native = {},
  ios = {},
  android = {}
}: CreateStyleParams) {
  return StyleSheet.create({
    component: StyleSheet.flatten([atomicStyles, styleProp]),
    light,
    dark,
    web,
    native,
    ios,
    android
  })
}

type LookPropsComponentType = keyof typeof StylePropsLookUp

function resolveProps<TProps extends object>(
  props: TProps,
  componentType?: LookPropsComponentType
) {
  const LookUpProps = componentType ? StylePropsLookUp[componentType] : null

  const atomic = {} as Record<keyof typeof LookUpProps | string, unknown>
  let styleProp = {} as Record<string, unknown>
  const originalProps = {} as Partial<TProps>
  const customProps = {} as Record<keyof typeof CustomStyleProps, object>

  Object.entries(props).forEach(([propKey, propValue]) => {
    if (propKey === 'children') {
      originalProps[propKey as keyof TProps] = propValue
      return
    }
    if (propKey === 'style') {
      styleProp = propValue
      return
    }
    if (LookUpProps) {
      if (propKey in LookUpProps) {
        atomic[propKey as keyof typeof LookUpProps] = propValue
      }
    }
    if (propKey in CustomStyleProps) {
      customProps[propKey as keyof typeof CustomStyleProps] = propValue
    } else {
      originalProps[propKey as keyof TProps] = propValue
    }
  })

  return {
    props: originalProps,
    styleProp,
    atomic,
    customProps
  }
}

type PropStyleMatch<T extends StylesType> = Readonly<{
  [Property in keyof T]: Property
}>
type PropStyle<T extends StylesType> = PropStyleMatch<T>

const CustomStyleProps = {
  _light: '_light',
  _dark: '_dark',
  _web: '_web',
  _native: '_native',
  _ios: '_ios',
  _android: '_android'
} as const

const FlexStyleProps: PropStyle<FlexStyle> = {
  alignContent: 'alignContent',
  alignItems: 'alignItems',
  alignSelf: 'alignSelf',
  aspectRatio: 'aspectRatio',
  borderBottomWidth: 'borderBottomWidth',
  borderEndWidth: 'borderEndWidth',
  borderLeftWidth: 'borderLeftWidth',
  borderRightWidth: 'borderRightWidth',
  borderStartWidth: 'borderStartWidth',
  borderTopWidth: 'borderTopWidth',
  borderWidth: 'borderWidth',
  bottom: 'bottom',
  display: 'display',
  end: 'end',
  flex: 'flex',
  flexBasis: 'flexBasis',
  flexDirection: 'flexDirection',
  rowGap: 'rowGap',
  gap: 'gap',
  columnGap: 'columnGap',
  flexGrow: 'flexGrow',
  flexShrink: 'flexShrink',
  flexWrap: 'flexWrap',
  height: 'height',
  justifyContent: 'justifyContent',
  left: 'left',
  margin: 'margin',
  marginBottom: 'marginBottom',
  marginEnd: 'marginEnd',
  marginHorizontal: 'marginHorizontal',
  marginLeft: 'marginLeft',
  marginRight: 'marginRight',
  marginStart: 'marginStart',
  marginTop: 'marginTop',
  marginVertical: 'marginVertical',
  maxHeight: 'maxHeight',
  maxWidth: 'maxWidth',
  minHeight: 'minHeight',
  minWidth: 'minWidth',
  overflow: 'overflow',
  padding: 'padding',
  paddingBottom: 'paddingBottom',
  paddingEnd: 'paddingEnd',
  paddingHorizontal: 'paddingHorizontal',
  paddingLeft: 'paddingLeft',
  paddingRight: 'paddingRight',
  paddingStart: 'paddingStart',
  paddingTop: 'paddingTop',
  paddingVertical: 'paddingVertical',
  position: 'position',
  right: 'right',
  start: 'start',
  top: 'top',
  width: 'width',
  zIndex: 'zIndex',
  direction: 'direction'
}

const ShadowStyleIOS: PropStyle<RNShadowStyleIOS> = {
  shadowColor: 'shadowColor',
  shadowOffset: 'shadowOffset',
  shadowOpacity: 'shadowOpacity',
  shadowRadius: 'shadowRadius'
}

const TransformsStyle: PropStyle<RNTransformsStyle> = {
  transform: 'transform',
  transformMatrix: 'transformMatrix',
  rotation: 'rotation',
  scaleX: 'scaleX',
  scaleY: 'scaleY',
  translateX: 'translateX',
  translateY: 'translateY'
}

const ViewStyleProps: PropStyle<ViewStyle> = {
  ...FlexStyleProps,
  ...ShadowStyleIOS,
  ...TransformsStyle,
  backfaceVisibility: 'backfaceVisibility',
  backgroundColor: 'backgroundColor',
  borderBlockColor: 'borderBlockColor',
  borderBlockEndColor: 'borderBlockEndColor',
  borderBlockStartColor: 'borderBlockStartColor',
  borderBottomColor: 'borderBottomColor',
  borderBottomEndRadius: 'borderBottomEndRadius',
  borderBottomLeftRadius: 'borderBottomLeftRadius',
  borderBottomRightRadius: 'borderBottomRightRadius',
  borderBottomStartRadius: 'borderBottomStartRadius',
  borderColor: 'borderColor',
  borderCurve: 'borderCurve',
  borderEndColor: 'borderEndColor',
  borderEndEndRadius: 'borderEndEndRadius',
  borderEndStartRadius: 'borderEndStartRadius',
  borderLeftColor: 'borderLeftColor',
  borderRadius: 'borderRadius',
  borderRightColor: 'borderRightColor',
  borderStartColor: 'borderStartColor',
  borderStartEndRadius: 'borderStartEndRadius',
  borderStartStartRadius: 'borderStartStartRadius',
  borderStyle: 'borderStyle',
  borderTopColor: 'borderTopColor',
  borderTopEndRadius: 'borderTopEndRadius',
  borderTopLeftRadius: 'borderTopLeftRadius',
  borderTopRightRadius: 'borderTopRightRadius',
  borderTopStartRadius: 'borderTopStartRadius',
  opacity: 'opacity',
  elevation: 'elevation',
  pointerEvents: 'pointerEvents',
  cursor: 'cursor',
  transformOrigin: 'transformOrigin'
}

const TextStyleAndroid: PropStyle<RNTextStyleAndroid> = {
  ...ViewStyleProps,
  textAlignVertical: 'textAlignVertical',
  verticalAlign: 'verticalAlign',
  includeFontPadding: 'includeFontPadding'
}

const TextStyleIOS: PropStyle<RNTextStyleIOS> = {
  ...ViewStyleProps,
  fontVariant: 'fontVariant',
  textDecorationColor: 'textDecorationColor',
  textDecorationStyle: 'textDecorationStyle',
  writingDirection: 'writingDirection'
}

const TextStyleProps: PropStyle<TextStyle> = {
  ...ViewStyleProps,
  ...TextStyleIOS,
  ...TextStyleAndroid,
  color: 'color',
  fontFamily: 'fontFamily',
  fontSize: 'fontSize',
  fontStyle: 'fontStyle',
  fontWeight: 'fontWeight',
  letterSpacing: 'letterSpacing',
  lineHeight: 'lineHeight',
  textAlign: 'textAlign',
  textDecorationLine: 'textDecorationLine',
  textDecorationStyle: 'textDecorationStyle',
  textDecorationColor: 'textDecorationColor',
  textShadowColor: 'textShadowColor',
  textShadowOffset: 'textShadowOffset',
  textShadowRadius: 'textShadowRadius',
  textTransform: 'textTransform',
  userSelect: 'userSelect'
}

// Style Props By Component Name
const StylePropsLookUp = {
  View: ViewStyleProps,
  Text: TextStyleProps,
  Pressable: ViewStyleProps
} as const
