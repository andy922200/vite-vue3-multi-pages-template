import { config } from '@vue/test-utils'

// Mock i18n
config.global.mocks.$t = (phrase: string) => phrase
