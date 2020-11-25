import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import nock from 'nock'
import {
  render,
  waitForDomChange,
  fireEvent,
  within,
} from '@testing-library/react'

import Assignment from './Assignment'

import * as githubTestHelpers from '../../../tests/helpers/github'
import * as config from '../../config'
import theme from '../../theme'

nock.disableNetConnect()

const mockRequests = (batches, usersPerBatch = config.USERS_PER_REQUEST) => {
  const scope = nock(config.BASE_API_URL).defaultReplyHeaders({
    'access-control-allow-origin': '*',
    'access-control-allow-credentials': 'true',
    'access-control-allow-headers': 'Authorization',
  })

  let usersMock = []
  for (let i = 0; i < batches; i += 1) {
    const batchMock = githubTestHelpers.generateUserBatchMock(
      i * usersPerBatch,
      usersPerBatch,
    )
    const batchEndpoint = `${config.USER_ENDPOINT}?since=${
      i * usersPerBatch
    }&per_page=${usersPerBatch}`
    scope.options(batchEndpoint).reply(200)
    scope.get(batchEndpoint).reply(200, batchMock)

    const currentUsersMock = batchMock.map(userMock => {
      const detailedUserMock = githubTestHelpers.generateDetailedUserMock(
        userMock.id,
      )

      const detailedUserEndpoint = `${config.USER_ENDPOINT}/${userMock.login}`
      scope
        .options(detailedUserEndpoint)
        .reply(200)
        .get(detailedUserEndpoint)
        .reply(200, detailedUserMock)

      return { ...userMock, ...detailedUserMock }
    })

    usersMock = [...usersMock, ...currentUsersMock]
  }

  return usersMock
}

describe('Assignment', () => {
  beforeEach(() => {
    window.location.assign = jest.fn()
  })

  afterAll(() => {
    window.location.assign.mockRestore()
  })

  const renderPage = () =>
    render(
      <ThemeProvider theme={theme}>
        <Assignment />
      </ThemeProvider>,
    )

  it(`should fetch ${config.USERS_PER_REQUEST} github users on load`, async () => {
    const usersMock = mockRequests(1)
    const { getByTestId } = renderPage()

    await waitForDomChange(getByTestId('card_grid'))

    usersMock.forEach((userMock, i) => {
      const card = getByTestId(`card_${i}`)
      expect(within(card).getByTestId('overline')).toHaveTextContent(
        userMock.name,
      )
      expect(within(card).getByTestId('title')).toHaveTextContent(
        userMock.login,
      )
      expect(within(card).getByTestId('description')).toHaveTextContent(
        userMock.bio,
      )
      expect(within(card).getByTestId('stats_0')).toHaveTextContent(
        userMock.public_repos,
      )
      expect(within(card).getByTestId('stats_1')).toHaveTextContent(
        userMock.public_gists,
      )
    })
  })

  const originalOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetHeight',
  )

  const originalScrollHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'scrollHeight',
  )

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: 0,
    })

    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      value: 1600,
    })
  })

  afterAll(() => {
    Object.defineProperty(
      HTMLElement.prototype,
      'offsetHeight',
      originalOffsetHeight,
    )
    Object.defineProperty(
      HTMLElement.prototype,
      'scrollHeight',
      originalScrollHeight,
    )
  })

  it(`should fetch ${config.USERS_PER_REQUEST} more github users on scroll`, async () => {
    const usersMock = mockRequests(2)
    const { getByTestId } = renderPage()
    const grid = getByTestId('card_grid')

    fireEvent.scroll(grid, { target: { scrollTop: 801 } })

    await waitForDomChange(
      () => {
        usersMock.forEach((userMock, i) => {
          const card = getByTestId(`card_${i}`)

          expect(within(card).getByTestId('overline')).toHaveTextContent(
            userMock.name,
          )
          expect(within(card).getByTestId('title')).toHaveTextContent(
            userMock.login,
          )
          expect(within(card).getByTestId('description')).toHaveTextContent(
            userMock.bio,
          )
          expect(within(card).getByTestId('stats_0')).toHaveTextContent(
            userMock.public_repos,
          )
          expect(within(card).getByTestId('stats_1')).toHaveTextContent(
            userMock.public_gists,
          )
        })
      },
      { container: grid },
    )
  })

  it(`should redirect to user profile's page`, async () => {
    mockRequests(2)
    const { getByTestId } = renderPage()
    window.confirm = jest.fn(() => true)
    const grid = getByTestId('card_grid')

    await waitForDomChange({ container: grid }, () => {
      fireEvent.click(getByTestId('card_51'))

      expect(window.location.assign).toHaveBeenCalledWith(
        'https://github.com/login52',
      )

      window.confirm.mockRestore()
    })
  })

  it(`should not redirect to user profile's page`, async () => {
    mockRequests(2)
    const { getByTestId } = renderPage()
    window.confirm = jest.fn(() => false)
    const grid = getByTestId('card_grid')

    await waitForDomChange({ container: grid }, () => {
      fireEvent.scroll(grid)

      fireEvent.click(getByTestId('card_51'))

      expect(window.location.assign).not.toHaveBeenCalledWith(
        'https://github.com/login52',
      )

      window.confirm.mockRestore()
    })
  })
})
