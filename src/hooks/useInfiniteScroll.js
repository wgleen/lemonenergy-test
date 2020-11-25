import { useEffect } from 'react'

export const EDGE_OFFSET = 800

export const handleScroll = (el, action, handleRef) => {
  if (el.scrollTop + el.offsetHeight < el.scrollHeight - EDGE_OFFSET)
    return false

  el.removeEventListener('scroll', handleRef)

  return action()
}

export const infiniteScrollHookCallback = (elRef, action, loading) => {
  const el = elRef.current

  const currentHandleScroll = () =>
    handleScroll(el, action, currentHandleScroll)

  if (loading) {
    el.removeEventListener('scroll', currentHandleScroll)
  } else {
    el.addEventListener('scroll', currentHandleScroll)
  }

  return () => {
    el.removeEventListener('scroll', currentHandleScroll)
  }
}

const useInfiniteScroll = (elRef, action, loading) => {
  useEffect(() => infiniteScrollHookCallback(elRef, action, loading), [loading])
}

export default useInfiniteScroll
