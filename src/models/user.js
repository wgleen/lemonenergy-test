const user = ({
  login,
  avatar_url: avatar,
  name,
  bio,
  public_repos: repos,
  public_gists: gists,
}) => {
  return {
    avatar,
    login,
    repos,
    gists,
    bio,
    name,
  }
}

export default user
