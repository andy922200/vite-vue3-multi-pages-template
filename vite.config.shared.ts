import { resolve } from 'path'

export const projectName = 'project-name'
export const port = 5765

export const htmlFiles = {
  index: resolve(__dirname, 'index.html'),
  contact: resolve(__dirname, 'contact.html'),
  owner: resolve(__dirname, 'owner.html'),
}
