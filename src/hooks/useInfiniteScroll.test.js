import {
  EDGE_OFFSET,
  infiniteScrollHookCallback,
  handleScroll,
} from './useInfiniteScroll'

describe('useInfinite hook', () => {
  describe('EDGE_OFFSET', () => {
    it('should be equal to 800', () => {
      expect(EDGE_OFFSET).toStrictEqual(800)
    })
  })

  describe('handleScroll', () => {
    describe('when el.scrollTop + el.offsetHeight is less than el.scrollHeight - EDGE_OFFSET', () => {
      it('should return false', () => {
        const el = {
          scrollTop: 10,
          offsetHeight: 10,
          scrollHeight: EDGE_OFFSET + 30,
        }

        expect(handleScroll(el)).toBeFalsy()
      })
    })

    describe('when el.scrollTop + el.offsetHeight is greater than el.scrollHeight - EDGE_OFFSET', () => {
      it('should return the return of action argument given', () => {
        const actionReturn = 'action return'
        const action = () => actionReturn

        const el = {
          scrollTop: 10,
          offsetHeight: 10,
          scrollHeight: EDGE_OFFSET + 10,
          removeEventListener: () => null,
        }

        expect(handleScroll(el, action)).toStrictEqual(actionReturn)
      })
      it('should call removeEventListener with "scroll" and handleRef arguments given', () => {
        const el = {
          scrollTop: 10,
          offsetHeight: 10,
          scrollHeight: EDGE_OFFSET + 10,
          removeEventListener: jest.fn(),
        }

        const action = () => null
        const handleRef = () => 'handleRef return'

        handleScroll(el, action, handleRef)

        expect(el.removeEventListener).toHaveBeenCalledWith('scroll', handleRef)
      })
    })
  })

  describe('infiniteScrollHookCallback', () => {
    const elRef = {
      current: {
        removeEventListener: jest.fn(),
        addEventListener: jest.fn(),
      },
    }

    const actionSpy = jest.fn()

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should return a function that, when called call removeEventListener from ref element', () => {
      const hookReturn = infiniteScrollHookCallback(elRef, actionSpy)

      elRef.current.removeEventListener.mockClear()

      hookReturn()

      expect(elRef.current.removeEventListener).toHaveBeenCalled()
    })

    describe('when loading argument is true', () => {
      const loading = true

      it('should call removeEventListener from ref element', () => {
        infiniteScrollHookCallback(elRef, actionSpy, loading)

        expect(elRef.current.removeEventListener).toHaveBeenCalled()
      })

      it('should not call addEventListener from ref element', () => {
        infiniteScrollHookCallback(elRef, actionSpy, loading)

        expect(elRef.current.addEventListener).not.toHaveBeenCalled()
      })
    })

    describe('when loading argument is false', () => {
      const loading = false

      it('should call addEventListener from ref element', () => {
        infiniteScrollHookCallback(elRef, actionSpy, loading)

        expect(elRef.current.addEventListener).toHaveBeenCalled()
      })

      it('should not call removeEventListener from ref element', () => {
        infiniteScrollHookCallback(elRef, actionSpy, loading)

        expect(elRef.current.removeEventListener).not.toHaveBeenCalled()
      })
    })
  })
})
