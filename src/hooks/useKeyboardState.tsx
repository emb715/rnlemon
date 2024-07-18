import {useEffect, useMemo, useRef, useState} from 'react'
import {Keyboard} from 'react-native'

export function useKeyboardState() {
  const mounted = useRef(false)
  const [keyboardStatus, setKeyboardStatus] = useState(
    'hidden' as 'shown' | 'hidden'
  )

  useEffect(() => {
    let showSubscription = null as ReturnType<
      typeof Keyboard.addListener
    > | null
    let hideSubscription = null as ReturnType<
      typeof Keyboard.addListener
    > | null
    if (mounted.current === false) {
      showSubscription = Keyboard.addListener('keyboardWillShow', () => {
        setKeyboardStatus(() => 'shown')
      })
      hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
        setKeyboardStatus(() => 'hidden')
      })
      mounted.current = true
    }

    return () => {
      if (mounted.current === false) {
        showSubscription && showSubscription?.remove()
        hideSubscription && hideSubscription?.remove()
      }
    }
  }, [])

  const isKeyboardHidden = useMemo(
    () => keyboardStatus === 'hidden',
    [keyboardStatus]
  )

  return {keyboardStatus, isKeyboardHidden}
}
