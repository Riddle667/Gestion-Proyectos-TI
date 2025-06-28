let currentUser = null

export function setLoggedUser(user) {
  currentUser = user
}

export function getLoggedUser() {
  return currentUser
}

export function clearLoggedUser() {
  currentUser = null
}
