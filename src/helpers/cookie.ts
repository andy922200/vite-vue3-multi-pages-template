export const clearACookie = (id: string) => {
  document.cookie = `${id}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}
