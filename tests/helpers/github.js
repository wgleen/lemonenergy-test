import * as config from '../../src/config'

export const generateDetailedUserMock = id => ({
  login: `login${id}`,
  id,
  avatar_url: `https://avatars1.githubusercontent.com/u/${id}?v=4`,

  name: `name${id}`,
  bio: `bio${id}`,
  public_repos: id,
  public_gists: id,
})

export const generateUserMock = id => ({
  id,
  login: `login${id}`,
})

export const generateUserBatchMock = (
  since,
  usersPerBatch = config.USERS_PER_REQUEST,
) => {
  const mocks = []

  for (let i = since, j = 0; i < since + usersPerBatch; i += 1, j += 1) {
    const id = i + 1
    mocks[j] = generateUserMock(id)
  }

  return mocks
}
