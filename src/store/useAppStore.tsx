import {create} from 'zustand'
import {createJSONStorage, persist, StateStorage} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

type State = {
  favorite: string[]
}

type Action = {
  hasFavorite: (coinId: string) => boolean
  addFavorite: (coinId: string) => void
  removeFavorite: (coinId: string) => void
  toggleFavorite: (coinId: string) => void
  _reset: () => void
}

export const storeActions: Action = {
  hasFavorite: coinId => {
    const {favorite} = useAppStore.getState()
    return Boolean(
      favorite.length > 0 && favorite.findIndex(f => f === coinId) !== -1
    )
  },
  addFavorite: coinId =>
    useAppStore.setState(prev => ({
      favorite: [...prev.favorite, coinId]
    })),
  removeFavorite: coinId =>
    useAppStore.setState(prev => {
      const index = prev.favorite.findIndex(f => f === coinId)
      if (index !== -1) {
        prev.favorite.splice(index, 1)
        return {favorite: [...prev.favorite]}
      }
      return prev
    }),
  toggleFavorite: coinId => {
    if (storeActions.hasFavorite(coinId)) {
      storeActions.removeFavorite(coinId)
    } else {
      storeActions.addFavorite(coinId)
    }
  },
  _reset: () => {
    useAppStore.setState(initialState)
  }
}

const initialState: State & Action = {
  favorite: [],
  ...storeActions
}

const storage: StateStorage = {
  getItem: async (key: string): Promise<string | null> => {
    const value = await AsyncStorage.getItem(key)
    return value ? JSON.parse(value) : null
  },
  setItem: async (key: string, value: unknown): Promise<void> => {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  },
  removeItem: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key)
  }
}

export const useAppStore = create(
  persist(() => initialState, {
    name: 'app-store-1',
    storage: createJSONStorage(() => storage),
    onRehydrateStorage: () => {
      console.log('hydration starts')
      // optional
      return (_, error) => {
        if (error) {
          console.log('an error happened during hydration', error)
        } else {
          console.log('hydration finished')
        }
      }
    }
  })
)
