import * as config from '../config'

const headers = {
  Authorization: `Basic ${btoa(
    `${config.GITHUB_AUTH_USERNAME}:${config.GITHUB_AUTH_PERSONAL_TOKEN}`,
  )}`,
}

export const getUserDetails = async login => {
  if (!login) throw Error('login not valid')
  const endpoint = `${config.BASE_API_URL}${config.USER_ENDPOINT}/${login}`
  const response = await fetch(endpoint, {
    headers,
  })

  if (!response.ok) throw Error('github error fetching users')

  return response.json()
}

export const getUsers = async ({
  since = 0,
  usersPerBatch = config.USERS_PER_REQUEST,
} = {}) => {
  const endpoint = `${config.BASE_API_URL}${config.USER_ENDPOINT}?since=${since}&per_page=${usersPerBatch}`
  const response = await fetch(endpoint, {
    headers,
  })

  if (!response.ok) throw Error('github error fetching users')

  const users = await response.json()

  const usersPromise = users.map(async user => {
    const details = await getUserDetails(user.login)

    return { ...user, ...details }
  })

  const usersResolved = await Promise.allSettled(usersPromise)

  const usersFiltered = usersResolved
    .filter(item => item.status === 'fulfilled')
    .map(item => item.value)

  return Promise.resolve(usersFiltered)
}
