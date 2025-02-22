import styled, { css } from 'styled-components'

export const Body100 = styled.p(
  ({ bold, theme: { typography } }) => css`
    font-family: ${typography.font.primary};
    font-weight: ${!bold ? '400' : '700'};
    font-size: 1rem;
    line-height: 1.5rem;
    letter-spacing: 0.02rem;
  `,
)

export const Body200 = styled.p(
  ({ bold, theme: { colors, typography } }) => css`
    font-family: ${typography.font.primary};
    font-weight: ${!bold ? '400' : '700'};
    font-size: 0.875rem;
    line-height: 1.5rem;
    letter-spacing: 0.02rem;
    color: ${colors.text.light};
  `,
)

export const Title100 = styled.h1(
  () => css`
    font-weight: 900;
    font-size: 2rem;
    line-height: 2.5rem;
  `,
)

export const Title200 = styled.h1(
  () => css`
    font-weight: 700;
    font-size: 1.5rem;
    line-height: 2rem;
  `,
)

export const Overline100 = styled.p(
  ({ theme: { typography } }) => css`
    font-family: ${typography.font.secondary};
    font-weight: 700;
    font-size: 0.5rem;
    text-transform: uppercase;
    line-height: 0.68rem;
    letter-spacing: 0.2rem;
  `,
)

export const Button100 = styled.span(
  () => css`
    font-weight: 900;
    font-size: 0.875rem;
    text-transform: uppercase;
    line-height: 1rem;
    letter-spacing: 0.2rem;
  `,
)
