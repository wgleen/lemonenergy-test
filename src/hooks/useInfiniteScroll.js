import { useEffect } from 'react'

const edgeOffset = 800

const useInfiniteScroll = (elRef, action) => {
  useEffect(() => {
    const el = elRef.current

    const handleScroll = () => {
      if (el.scrollTop + el.offsetHeight < el.scrollHeight - edgeOffset) return
      action()
    }

    el.addEventListener('scroll', handleScroll)

    return () => {
      el.removeEventListener('scroll', handleScroll)
    }
  })
}

export default useInfiniteScroll
