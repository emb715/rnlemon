import * as AppStore from '../useAppStore'

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks()
})

describe('App store actions', () => {
  describe('storeActions.hasFavorite', () => {
    test('be false', () => {
      const mockCoinId = 'myId'
      const result = AppStore.storeActions.hasFavorite(mockCoinId)

      expect(result).toBe(false)
    })

    test('be true', () => {
      const mockCoinId = 'myId'
      const mockState = {
        favorite: [mockCoinId]
      }
      AppStore.useAppStore.setState(mockState)

      const result = AppStore.storeActions.hasFavorite(mockCoinId)
      expect(result).toBe(true)
    })
  })
  test('storeActions.addFavorite', () => {
    const mockCoinId = 'myId'
    expect(AppStore.storeActions.addFavorite(mockCoinId)).toBeUndefined()
    expect(
      AppStore.useAppStore.getState().favorite.includes(mockCoinId)
    ).toBeTruthy()
  })
  test('storeActions.removeFavorite', () => {
    const mockCoinId = 'myId'
    const mockState = {
      favorite: [mockCoinId]
    }
    AppStore.useAppStore.setState(mockState)

    expect(AppStore.storeActions.removeFavorite(mockCoinId)).toBeUndefined()
    expect(AppStore.useAppStore.getState().favorite.length).toBe(0)
  })

  test('storeActions.toggleFavorite', () => {
    const mockCoinId = 'myId'
    expect(AppStore.storeActions.toggleFavorite(mockCoinId)).toBeUndefined()
  })
})
