import { resolve } from 'path'

export const projectName = 'project-name'
export const port = 5765

export const htmlFiles = {
  index: resolve(import.meta.dirname, 'index.html'),
  contact: resolve(import.meta.dirname, 'contact.html'),
  owner: resolve(import.meta.dirname, 'owner.html'),
}
