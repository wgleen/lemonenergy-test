import React from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import theme from '../theme'
import { Body100, Body200, Overline100 } from './Text'

describe('Text', () => {
  describe('Body100', () => {
    it('should have a font-family style property equal to theme.typography.font.primary', () => {
      const component = render(
        <ThemeProvider theme={theme}>
          <Body100 data-testid="boddy100" />
        </ThemeProvider>,
      )

      expect(component.getByTestId('boddy100')).toHaveStyle(
        `font-family: ${theme.typography.font.primary}`,
      )
    })
  })

  describe('Body200', () => {
    it('should have a font-family style property equal to theme.typography.font.primary', () => {
      const component = render(
        <ThemeProvider theme={theme}>
          <Body200 data-testid="boddy200" />
        </ThemeProvider>,
      )

      expect(component.getByTestId('boddy200')).toHaveStyle(
        `font-family: ${theme.typography.font.primary}`,
      )
    })

    it('should have a color style property equal to theme.colors.text.light', () => {
      const component = render(
        <ThemeProvider theme={theme}>
          <Body200 data-testid="boddy200" />
        </ThemeProvider>,
      )

      expect(component.getByTestId('boddy200')).toHaveStyle(
        `color: ${theme.colors.text.light}`,
      )
    })

    it('should have a font-size style property equal to 0.775rem', () => {
      const component = render(
        <ThemeProvider theme={theme}>
          <Body200 data-testid="boddy200" />
        </ThemeProvider>,
      )

      expect(component.getByTestId('boddy200')).toHaveStyle(
        'font-size: 0.875rem',
      )
    })
  })

  describe('Overline100', () => {
    it('should have a font-family style property equal to theme.typography.font.secondary', () => {
      const component = render(
        <ThemeProvider theme={theme}>
          <Overline100 data-testid="overline100" />
        </ThemeProvider>,
      )

      expect(component.getByTestId('overline100')).toHaveStyle(
        `font-family: ${theme.typography.font.secondary}`,
      )
    })
  })
})
