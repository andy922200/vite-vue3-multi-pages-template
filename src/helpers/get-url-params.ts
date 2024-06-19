function getURLParams() {
  const urlObj = new URL(window.location.href)
  const params = new URLSearchParams(urlObj.search)
  const queryParams: Record<string, string | number> = {}

  params.forEach((value, key) => {
    queryParams[key] = value
  })

  return queryParams
}

export { getURLParams }
