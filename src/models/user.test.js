import userModel from './user'

describe('userModel', () => {
  it('should return an object properly configured', () => {
    const userMock = {
      login: 'login1',
      avatar_url: 'https://avatars1.githubusercontent.com/u/1?v=4',
      name: 'name1',
      bio: 'bio1',
      public_repos: 1,
      public_gists: 1,
    }

    const expectedUserMock = {
      avatar: userMock.avatar_url,
      login: userMock.login,
      repos: userMock.public_repos,
      gists: userMock.public_gists,
      bio: userMock.bio,
      name: userMock.name,
    }

    const user = userModel(userMock)

    expect(user).toStrictEqual(expectedUserMock)
  })
})
