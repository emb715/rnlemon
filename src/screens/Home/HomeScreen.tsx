import React, {useCallback, useMemo, useRef, useState} from 'react'
import {
  Image,
  Pressable,
  RefreshControl,
  TextInput,
  TouchableOpacity
} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useThrottledCallback} from 'use-debounce'
import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView
} from '@gorhom/bottom-sheet'
import {useNavigation} from '@react-navigation/native'
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list'
import {
  BottomSheetCustomBackdrop,
  Box,
  Center,
  HeartFilledIcon,
  HeartIcon,
  HStack,
  LogoutIcon,
  ScreenWrapper,
  SearchIcon,
  Typography,
  VStack
} from '../../components'
import {Avatar} from '../../components/Avatar'
import {Background} from '../../components/Background'
import {NativeScreenProp} from '../../navigators/RootNavigator'
import {
  CoinData,
  useCryptoInfoQuery,
  useCryptoListQuery
} from '../../store/features/coin-market'
import {useAppStore} from '../../store/useAppStore'
import {useUserInfo} from '../../store/useSessionStore'
import {theme} from '../../theme/theme'
import {getHexAlpha, useColorModeValue} from '../../theme/tinybase'

export function HomeScreen(_: NativeScreenProp<'Home'>) {
  const insets = useSafeAreaInsets()
  const [filter, setFilter] = useState<string>()
  const [filterFav, setFilterFav] = useState<boolean>(false)

  const userInfo = useUserInfo()
  const {favorite} = useAppStore()
  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const {
    data: crypto,
    isLoading,
    isError,
    isFetching,
    refetch
  } = useCryptoListQuery({
    select: data => {
      if (!filter && !filterFav) {
        return data
      }
      let filtered = data.data

      if (filterFav) {
        filtered = filtered.filter(item => {
          return favorite.includes(item.id.toString())
        })
      }
      if (filter) {
        filtered = filtered.filter(
          item =>
            item.name.toLowerCase().includes(filter.toLowerCase()) ||
            item.symbol.toUpperCase().includes(filter.toUpperCase())
        )
      }
      return {
        ...data,
        data: filtered
      }
    }
  })

  const screenBackgroundColor = useColorModeValue(
    theme.light.background,
    theme.dark.background
  )
  const filterTextColor = useColorModeValue(theme.light.text, theme.dark.text)
  const filterFavIconColor = useColorModeValue(
    theme.light.primary,
    theme.dark.primary
  )
  const filterIconColor = useColorModeValue(
    theme.light.palette.gray[900],
    theme.dark.palette.gray[100]
  )
  const placeholderTextColor = useColorModeValue(
    theme.light.palette.gray[300],
    theme.dark.palette.gray[600]
  )

  const onFilter = useCallback((text: string) => setFilter(text), [setFilter])

  const onPressAvatar = useThrottledCallback(() => {
    // Open Profile Sheet
    bottomSheetRef.current?.present()
  }, 300)

  const onPressFilterFav = useThrottledCallback(() => {
    // filter list by fav
    setFilterFav(currentFav => !currentFav)
  }, 300)

  const avatarLetters = useMemo(() => {
    if (userInfo?.givenName && userInfo?.familyName) {
      return userInfo?.givenName?.charAt(0) + userInfo?.familyName?.charAt(0)
    }
    return `${userInfo?.name?.charAt(0)}${userInfo?.name?.charAt(1)}`
  }, [userInfo])

  const renderLoading = useMemo(
    () => (isLoading && !isError ? <Loading /> : null),
    [isLoading, isError]
  )
  const renderError = useMemo(
    () => (!isLoading && isError ? <ErrorComponent retry={refetch} /> : null),
    [isLoading, isError, refetch]
  )
  const renderListEmpty = useMemo(() => {
    const emptyText = filterFav ? 'Nothing mark as favorite' : undefined
    return <ListEmptyComponent text={emptyText} />
  }, [filterFav])

  const renderContent = useMemo(
    () =>
      !isLoading && !isError ? (
        <VStack flexGrow={1} marginTop={16}>
          {crypto?.status?.timestamp && (
            <HStack alignSelf="flex-end" marginRight={8}>
              <Typography preset="smallest" variant="light">
                {`Last update: ${new Date(
                  crypto?.status?.timestamp
                ).toLocaleTimeString()}`}
              </Typography>
            </HStack>
          )}
          <FlashList
            refreshControl={
              <RefreshControl refreshing={isFetching} onRefresh={refetch} />
            }
            data={crypto?.data}
            estimatedItemSize={200}
            renderItem={itemProps => <CryptoListItem {...itemProps} />}
            ListEmptyComponent={renderListEmpty}
            contentContainerStyle={{
              paddingTop: 8,
              paddingBottom: insets.bottom
            }}
          />
        </VStack>
      ) : null,
    [
      isLoading,
      isError,
      crypto?.status?.timestamp,
      crypto?.data,
      isFetching,
      refetch,
      renderListEmpty,
      insets.bottom
    ]
  )

  const renderHeader = useMemo(
    () => (
      <HStack>
        <VStack flexGrow={1}>
          <Typography
            preset="h6"
            variant="light"
            _light={{
              color: theme.light.palette.gray[300]
            }}
            _dark={{
              color: theme.dark.palette.gray[600]
            }}>
            Hello, {userInfo?.name}!
          </Typography>
          <Typography
            preset="h2"
            variant="light"
            _light={{
              color: theme.light.primary
            }}
            _dark={{
              color: theme.dark.primary
            }}>
            Welcome
          </Typography>
        </VStack>
        <Box alignSelf="center">
          <Pressable onPressIn={onPressAvatar}>
            <Avatar image={userInfo?.photo} letters={avatarLetters} />
          </Pressable>
        </Box>
      </HStack>
    ),
    [userInfo, avatarLetters, onPressAvatar]
  )

  const renderFilter = useMemo(
    () => (
      <HStack flexWrap="nowrap">
        <HStack
          flexGrow={1}
          borderRadius={4}
          paddingHorizontal={8}
          paddingVertical={8}
          borderWidth={1}
          _light={{
            borderColor: getHexAlpha(theme.light.border, 0.4),
            backgroundColor: getHexAlpha(theme.light.background, 0.8)
          }}
          _dark={{
            borderColor: getHexAlpha(theme.dark.border, 0.4),
            backgroundColor: getHexAlpha(theme.dark.border, 0.3)
          }}
          _android={{
            paddingVertical: 0
          }}>
          <Center marginRight={8}>
            <SearchIcon size={16} fill={filterIconColor} />
          </Center>
          <TextInput
            value={filter}
            onChangeText={onFilter}
            placeholder="Filter"
            clearButtonMode="while-editing"
            placeholderTextColor={placeholderTextColor}
            returnKeyType="done"
            style={{
              flexGrow: 1,
              color: filterTextColor
            }}
          />
        </HStack>
        <HStack alignItems="center" alignContent="center" marginLeft={8}>
          <Pressable onPressIn={onPressFilterFav}>
            <Center>
              {filterFav ? (
                <HeartFilledIcon size={24} fill={filterFavIconColor} />
              ) : (
                <HeartIcon size={24} fill={filterFavIconColor} />
              )}
            </Center>
          </Pressable>
        </HStack>
      </HStack>
    ),
    [
      filterIconColor,
      filter,
      onFilter,
      placeholderTextColor,
      filterTextColor,
      onPressFilterFav,
      filterFav,
      filterFavIconColor
    ]
  )

  return (
    <ScreenWrapper screenBackgroundColor={screenBackgroundColor} unsafe>
      <Background />
      <VStack
        style={{
          flexGrow: 1,
          paddingTop: insets.top
        }}>
        <VStack marginBottom={8} paddingVertical={4} paddingHorizontal={8}>
          {renderHeader}
        </VStack>

        <VStack paddingHorizontal={8} marginTop={12}>
          {renderFilter}
        </VStack>

        {renderLoading}
        {renderError}
        {renderContent}
      </VStack>

      <ProfileSheetModal ref={bottomSheetRef} />
    </ScreenWrapper>
  )
}

const ProfileSheetModal = React.forwardRef<BottomSheetModal>(function (
  _,
  forwardedRef
) {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const bottomSheetStyles = useColorModeValue(
    {
      backgroundColor: theme.light.card
    },
    {
      backgroundColor: theme.dark.border
    }
  )
  const logoutIconColor = useColorModeValue(theme.light.text, theme.dark.text)

  const onPressLogout = useThrottledCallback(() => {
    navigation.navigate('Logout')
  }, 300)

  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetCustomBackdrop {...backdropProps} style={{zIndex: 2}} />
    ),
    []
  )

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={forwardedRef}
        snapPoints={[88]}
        enableDismissOnClose
        enableContentPanningGesture={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleStyle={{
          display: 'none'
        }}
        backgroundStyle={{
          backgroundColor: bottomSheetStyles.backgroundColor
        }}
        containerStyle={{
          zIndex: 9,
          backgroundColor: 'transparent'
        }}
        style={{
          zIndex: 9,
          marginHorizontal: 12,
          backgroundColor: 'transparent'
        }}
        bottomInset={insets.bottom > 0 ? insets.bottom : 12}
        detached={true}>
        <BottomSheetView
          style={{
            flex: 1,
            paddingHorizontal: 16,
            justifyContent: 'center'
          }}>
          <Pressable onPress={onPressLogout}>
            <HStack
              paddingHorizontal={12}
              paddingVertical={8}
              borderRadius={6}
              height={44}
              alignItems="center"
              borderWidth={1}
              _light={{
                backgroundColor: theme.light.background,
                borderTopColor: getHexAlpha(theme.light.primary, 0.1),
                borderLeftColor: getHexAlpha(theme.light.primary, 0.1),
                borderBottomColor: getHexAlpha(theme.light.background, 0.5),
                borderRightColor: getHexAlpha(theme.light.background, 0.5)
              }}
              _dark={{
                backgroundColor: theme.dark.card,
                borderTopColor: getHexAlpha(theme.dark.primary, 0.1),
                borderLeftColor: getHexAlpha(theme.dark.primary, 0.1),
                borderBottomColor: getHexAlpha(theme.dark.background, 0.5),
                borderRightColor: getHexAlpha(theme.dark.background, 0.5)
              }}>
              <Center marginRight={8}>
                <LogoutIcon size={16} fill={logoutIconColor} />
              </Center>
              <Typography variant="semibold">Logout</Typography>
            </HStack>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  )
})

function CryptoListItem({item}: ListRenderItemInfo<CoinData>) {
  const navigation = useNavigation()
  const {data: metadata} = useCryptoInfoQuery(item.id.toString())

  const [itemQuoteType, itemQuote] = Object.entries(item.quote).slice(0, 1)[0]

  const onPress = useThrottledCallback(
    () => {
      navigation.navigate('Details', {
        id: item.id.toString()
      })
    },
    300,
    {
      leading: true
    }
  )

  return (
    <TouchableOpacity key={item.id} onPress={onPress}>
      <CryptoItem
        logo={metadata?.logo as string}
        name={item.name}
        symbol={item.symbol}
        quote={{
          type: itemQuoteType,
          price: itemQuote.price
        }}
      />
    </TouchableOpacity>
  )
}

function CryptoItem(props: {
  logo: string
  name: string
  symbol: string
  quote: {
    type: string
    price: number
  }
}) {
  return (
    <HStack
      paddingVertical={12}
      paddingHorizontal={8}
      marginHorizontal={4}
      marginBottom={6}
      borderRadius={8}
      borderWidth={1}
      _light={{
        borderColor: getHexAlpha(theme.light.border, 0.4),
        backgroundColor: getHexAlpha(theme.light.background, 0.6)
      }}
      _dark={{
        borderColor: getHexAlpha(theme.dark.border, 0.6),
        backgroundColor: getHexAlpha(theme.dark.background, 0.8)
      }}>
      <Center marginRight={12}>
        <Image
          src={props?.logo}
          alt={props.name}
          style={{
            width: 32,
            height: 32
          }}
        />
      </Center>
      <VStack flexGrow={1}>
        <Typography
          preset="h6"
          variant="semibold"
          _light={{
            color: theme.light.palette.gray[900]
          }}
          _dark={{
            color: theme.light.palette.gray[100]
          }}>
          {props.name}
        </Typography>
        <Typography
          preset="small"
          variant="light"
          marginTop={2}
          _light={{
            color: theme.light.palette.gray[900]
          }}
          _dark={{
            color: theme.light.palette.gray[300]
          }}>
          {props.symbol}
        </Typography>
      </VStack>
      <VStack justifyContent="center">
        <Typography preset="medium" variant="semibold">
          {props.quote.type} {props.quote.price.toFixed(2)}
        </Typography>
      </VStack>
    </HStack>
  )
}
CryptoItem.Skeleton = () => (
  <HStack
    paddingVertical={12}
    paddingHorizontal={8}
    marginHorizontal={4}
    marginBottom={6}
    borderRadius={8}
    borderWidth={1}
    _light={{
      borderColor: 'transparent',
      backgroundColor: getHexAlpha(theme.light.background, 0.6)
    }}
    _dark={{
      borderColor: getHexAlpha(theme.dark.border, 0.6),
      backgroundColor: getHexAlpha(theme.dark.background, 0.8)
    }}>
    <Center marginRight={12}>
      <Box
        borderRadius={99}
        _light={{
          backgroundColor: getHexAlpha(theme.light.card, 0.5)
        }}
        _dark={{
          backgroundColor: getHexAlpha(theme.dark.card, 0.5)
        }}
        style={{
          width: 32,
          height: 32
        }}
      />
    </Center>
    <VStack flexGrow={1}>
      <Typography
        preset="h6"
        variant="semibold"
        maxWidth={70}
        borderRadius={3}
        height={12}
        _light={{
          backgroundColor: getHexAlpha(theme.light.card, 0.5)
        }}
        _dark={{
          backgroundColor: getHexAlpha(theme.dark.card, 0.5)
        }}
      />
      <Typography
        preset="small"
        variant="light"
        marginTop={4}
        maxWidth={50}
        height={12}
        borderRadius={3}
        _light={{
          backgroundColor: getHexAlpha(theme.light.card, 0.5)
        }}
        _dark={{
          backgroundColor: getHexAlpha(theme.dark.card, 0.5)
        }}
      />
    </VStack>
  </HStack>
)

function ListEmptyComponent(props: {text?: string}) {
  return (
    <VStack marginTop={12}>
      <Center>
        <Typography preset="medium" variant="light">
          {props.text ?? 'No items found'}
        </Typography>
      </Center>
    </VStack>
  )
}
function Loading() {
  const loadingAmount = 6

  const getOpacityForIndex = (index: number) => {
    index += 1
    const decreaseBy = 0.1
    return index === 1 ? 1 : Number((1 - index * decreaseBy).toFixed(1))
  }
  return (
    <VStack marginTop={12} paddingHorizontal={8}>
      <HStack alignSelf="flex-end" marginBottom={0} marginRight={8}>
        <Typography preset="smallest" variant="light" />
      </HStack>
      <VStack paddingTop={8}>
        {Array.from({length: loadingAmount}).map((_, index) => (
          <Box
            key={`loading-${index}`}
            style={{
              opacity: getOpacityForIndex(index)
            }}>
            <CryptoItem.Skeleton />
          </Box>
        ))}
      </VStack>
    </VStack>
  )
}

function ErrorComponent(props: {msg?: string; retry?: () => void}) {
  const errorMsg = props.msg ?? 'Something went wrong'
  return (
    <VStack marginTop={12} paddingHorizontal={8}>
      <VStack paddingTop={8}>
        <Center>
          <Typography preset="medium" variant="light">
            {errorMsg}
          </Typography>
          {props.retry && (
            <TouchableOpacity
              onPress={props.retry}
              style={{
                marginTop: 12
              }}>
              <Box
                borderRadius={4}
                paddingHorizontal={12}
                paddingVertical={4}
                borderWidth={1}
                _light={{
                  borderColor: theme.light.border
                }}
                _dark={{
                  borderColor: theme.dark.border
                }}>
                <Typography preset="medium" variant="light">
                  Retry
                </Typography>
              </Box>
            </TouchableOpacity>
          )}
        </Center>
      </VStack>
    </VStack>
  )
}
