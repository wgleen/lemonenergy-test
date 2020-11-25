import nock from 'nock'
import * as config from '../config'
import * as githubTestHelpers from '../../tests/helpers/github'
import * as github from './github'

nock.disableNetConnect()

const mockRequests = (usersPerBatch = config.USERS_PER_REQUEST) => {
  const scope = nock(config.BASE_API_URL).defaultReplyHeaders({
    'access-control-allow-origin': '*',
    'access-control-allow-credentials': 'true',
    'access-control-allow-headers': 'Authorization',
  })

  let usersMock = []

  const batchMock = githubTestHelpers.generateUserBatchMock(
    0,
    usersPerBatch,
    usersPerBatch,
  )
  const batchEndpoint = `${config.USER_ENDPOINT}?since=0&per_page=${usersPerBatch}`
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

  return usersMock
}

describe('github service', () => {
  describe('getUsers()', () => {
    describe('when USERS_PER_REQUEST request is successful', () => {
      const perPage = 2
      const expectedUsersStaticMock = [
        {
          login: 'login1',
          id: 1,
          avatar_url: 'https://avatars1.githubusercontent.com/u/1?v=4',
          name: 'name1',
          bio: 'bio1',
          public_repos: 1,
          public_gists: 1,
        },
        {
          login: 'login2',
          id: 2,
          avatar_url: 'https://avatars1.githubusercontent.com/u/2?v=4',
          name: 'name2',
          bio: 'bio2',
          public_repos: 2,
          public_gists: 2,
        },
      ]

      mockRequests(perPage)

      it('should return a list of users with details', async () => {
        const users = await github.getUsers({
          since: 0,
          usersPerBatch: perPage,
        })

        expect(users).toStrictEqual(expectedUsersStaticMock)
      })
    })
  })
})
