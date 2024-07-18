import React, {useEffect, useMemo} from 'react'
import {Image, Pressable} from 'react-native'
import {TouchableOpacity} from 'react-native-gesture-handler'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useThrottledCallback} from 'use-debounce'
import {
  ArrowLeftIcon,
  Background,
  Box,
  Center,
  HeartFilledIcon,
  HeartIcon,
  HStack,
  ScreenWrapper,
  Typography,
  UpdateNowIcon,
  VStack
} from '../../components'
import {NativeScreenProp} from '../../navigators/RootNavigator'
import {
  CoinData,
  useCryptoInfoQuery,
  useCryptoListQuery,
  useFavoriteMutation
} from '../../store/features/coin-market'
import {useAppStore} from '../../store/useAppStore'
import {theme} from '../../theme/theme'
import {getHexAlpha, useColorModeValue} from '../../theme/tinybase'

export function DetailsScreen(props: NativeScreenProp<'Details'>) {
  const coinId = props.route.params.id
  const insets = useSafeAreaInsets()
  const {
    data: coinData,
    refetch,
    isFetching
  } = useCryptoListQuery<CoinData[]>({
    select: data => {
      return data.data.filter(item => item.id.toString() === coinId)
    }
  })
  const {data: metadata} = useCryptoInfoQuery(coinId)

  const {hasFavorite} = useAppStore()
  const isFav = hasFavorite(coinId)
  const favoriteMutation = useFavoriteMutation()

  const coinQuote = useMemo(() => {
    if (!coinData) {
      return undefined
    }
    const quote = Object.entries(coinData[0].quote)[0]
    return {
      type: quote[0],
      quote: quote[1]
    }
  }, [coinData])

  const FavIcon = useMemo(() => {
    return isFav ? HeartFilledIcon : HeartIcon
  }, [isFav])

  const onPressBack = useThrottledCallback(() => {
    props.navigation.goBack()
  }, 300)
  const onPressFav = useThrottledCallback(() => {
    favoriteMutation.mutate(coinId)
  }, 300)

  const screenBackgroundColor = useColorModeValue(
    theme.light.background,
    theme.dark.background
  )
  const headerIconColor = useColorModeValue(
    theme.light.primary,
    theme.dark.primary
  )
  const shadowIconColor = useColorModeValue(
    theme.light.border,
    theme.dark.primary
  )

  return (
    <ScreenWrapper screenBackgroundColor={screenBackgroundColor} unsafe>
      <Background />
      <VStack flexGrow={1} paddingTop={insets.top > 0 ? insets.top : 8}>
        <HStack justifyContent="space-between" paddingHorizontal={8}>
          <TouchableOpacity onPress={onPressBack} hitSlop={10}>
            <Center
              alignSelf="flex-start"
              borderRadius={99}
              padding={6}
              borderWidth={1}
              _light={{
                borderColor: getHexAlpha(theme.light.primary, 0.8)
              }}
              _dark={{
                borderColor: getHexAlpha(theme.dark.primary, 0.8)
              }}>
              <ArrowLeftIcon size={18} fill={headerIconColor} />
            </Center>
          </TouchableOpacity>

          <Pressable onPressIn={onPressFav} hitSlop={10}>
            <Box alignSelf="flex-start" borderRadius={99} padding={4}>
              <Center left={0}>
                <FavIcon size={24} fill={headerIconColor} />
              </Center>
            </Box>
          </Pressable>
        </HStack>

        <VStack marginTop={-12}>
          {metadata && (
            <Center
              style={{
                shadowColor: shadowIconColor,
                shadowOffset: {
                  width: 0,
                  height: -2
                },
                shadowOpacity: 0.7,
                shadowRadius: 6,
                elevation: 3
              }}>
              <Box
                borderWidth={1}
                _light={{
                  borderColor: getHexAlpha(theme.light.border, 0.7),
                  backgroundColor: getHexAlpha(theme.light.background, 0.5)
                }}
                _dark={{
                  borderColor: getHexAlpha(theme.dark.border, 1),
                  backgroundColor: getHexAlpha(theme.dark.background, 0.7)
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  width: 48,
                  height: 46,
                  borderRadius: 99
                }}
              />
              <CoinImage
                src={metadata.logo}
                alt={metadata.name}
                style={{
                  borderRadius: 99,
                  width: 44,
                  height: 44
                }}
              />
            </Center>
          )}
          <Center marginTop={8}>
            <Typography preset="h2" variant="light" textAlign="center">
              {coinData?.[0]?.name}
            </Typography>
            <Typography
              preset="h5"
              variant="light"
              textAlign="center"
              marginTop={2}
              _light={{
                color: theme.light.palette.gray[600]
              }}
              _dark={{
                color: theme.dark.palette.gray[300]
              }}>
              {coinData?.[0]?.symbol}
            </Typography>
          </Center>

          <HStack justifyContent="flex-end" paddingHorizontal={8}>
            <RefetchButton isFetching={isFetching} onPress={refetch} />
          </HStack>

          <Center marginTop={2}>
            <Typography
              preset="h3"
              variant="semibold"
              textAlign="center"
              marginTop={12}
              _light={{
                color: theme.light.palette.gray[900]
              }}
              _dark={{
                color: theme.dark.palette.gray[100]
              }}>
              {`${coinQuote?.type} ${coinQuote?.quote.price.toFixed(2)}`}
            </Typography>
          </Center>

          <HStack marginTop={24} alignSelf="center">
            <Typography
              preset="h4"
              variant="light"
              alignSelf="center"
              textAlign="center"
              marginRight={12}
              _light={{
                color: theme.light.palette.gray[900]
              }}
              _dark={{
                color: theme.dark.palette.gray[100]
              }}>
              24h
            </Typography>
            <VStack
              alignSelf="center"
              borderRadius={8}
              paddingVertical={8}
              paddingHorizontal={10}
              borderWidth={1}
              _light={{
                borderColor: getHexAlpha(theme.light.card, 1),
                backgroundColor: getHexAlpha(theme.light.background, 0.4)
              }}
              _dark={{
                borderColor: theme.dark.border,
                backgroundColor: getHexAlpha(theme.dark.card, 0.4)
              }}>
              <HStack justifyContent="flex-end" alignItems="center">
                <Typography
                  preset="medium"
                  variant="semibold"
                  _light={{
                    color: theme.light.palette.gray[900]
                  }}
                  _dark={{
                    color: theme.dark.palette.gray[100]
                  }}>
                  {coinQuote?.quote.volume_change_24h}
                </Typography>
                <Typography
                  preset="small"
                  justifyContent="flex-end"
                  marginLeft={6}
                  _light={{
                    color: theme.light.palette.gray[900]
                  }}
                  _dark={{
                    color: theme.dark.palette.gray[100]
                  }}>
                  Vol
                </Typography>
              </HStack>

              <HStack justifyContent="space-between" alignItems="center">
                <Typography
                  preset="medium"
                  variant="semibold"
                  _light={{
                    color: theme.light.palette.gray[900]
                  }}
                  _dark={{
                    color: theme.dark.palette.gray[100]
                  }}>
                  {coinQuote?.quote.percent_change_24h}
                </Typography>
                <Typography
                  preset="small"
                  justifyContent="flex-end"
                  marginLeft={6}
                  _light={{
                    color: theme.light.palette.gray[900]
                  }}
                  _dark={{
                    color: theme.dark.palette.gray[100]
                  }}>
                  %
                </Typography>
              </HStack>
            </VStack>
          </HStack>
        </VStack>
      </VStack>
    </ScreenWrapper>
  )
}

function RefetchButton(props: {isFetching: boolean; onPress: () => void}) {
  const sv = useSharedValue<number>(0)

  const duration = 2000
  const easing = Easing.bezier(0.25, -0.5, 0.25, 1)

  useEffect(() => {
    if (props.isFetching) {
      sv.value = withTiming(1, {duration, easing}, () => {
        sv.value = 0
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isFetching])

  const fetchingAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${sv.value * -360}deg`}]
  }))

  const refreshIconColor = useColorModeValue(theme.light.text, theme.dark.text)

  const onPressRefresh = useThrottledCallback(props.onPress, 300)

  return (
    <TouchableOpacity onPress={onPressRefresh}>
      <Center
        alignSelf="flex-start"
        borderRadius={99}
        padding={8}
        borderWidth={1}
        _light={{
          borderColor: getHexAlpha(theme.light.primary, 0.7)
        }}
        _dark={{
          borderColor: getHexAlpha(theme.dark.primary, 0.7)
        }}>
        <Animated.View style={fetchingAnimatedStyle}>
          <UpdateNowIcon size={16} fill={refreshIconColor} />
        </Animated.View>
      </Center>
    </TouchableOpacity>
  )
}

function CoinImage(props: React.ComponentProps<typeof Image>) {
  return (
    <Image src={props.src} alt={props.alt} width={64} height={64} {...props} />
  )
}
