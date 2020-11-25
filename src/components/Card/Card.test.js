import React from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import theme from '../../theme'
import { Footer } from './Card'

describe('Card', () => {
  describe('Footer', () => {
    it('should have a display style property equal to "flex"', () => {
      const component = render(
        <ThemeProvider theme={theme}>
          <Footer data-testid="footer" />
        </ThemeProvider>,
      )

      expect(component.getByTestId('footer')).toHaveStyle('display: flex')
    })

    it('should have a justify-content style property equal to "flex-end"', () => {
      const component = render(
        <ThemeProvider theme={theme}>
          <Footer data-testid="footer" />
        </ThemeProvider>,
      )

      expect(component.getByTestId('footer')).toHaveStyle(
        'justify-content: flex-end',
      )
    })
  })
})
