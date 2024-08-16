import { it, describe, expect, vi, MockInstance } from 'vitest'
import { overrideAddEventListener } from '@/helpers/non-passive-event-listener'
// Mocking EventTarget's addEventListener
let originalAddEventListener: MockInstance | undefined = undefined

beforeAll(() => {
  originalAddEventListener = vi.spyOn(EventTarget.prototype, 'addEventListener')
  overrideAddEventListener()
})

afterAll(() => {
  originalAddEventListener?.mockRestore()
})

describe('overrideAddEventListener', () => {
  it('should set passive to false by default', () => {
    const element = document.createElement('div')
    const handler = vi.fn()

    element.addEventListener('click', handler)

    // Expect that the original addEventListener is called with passive set to false
    expect(originalAddEventListener).toHaveBeenCalledWith('click', handler, { passive: false })
  })

  it('should preserve existing options', () => {
    const element = document.createElement('div')
    const handler = vi.fn()
    const options = { capture: true, once: true }

    element.addEventListener('click', handler, options)

    // Expect that the original addEventListener is called with passive set to false and other options preserved
    expect(originalAddEventListener).toHaveBeenCalledWith('click', handler, {
      ...options,
      passive: false,
    })
  })

  it('should not change boolean capture options', () => {
    const element = document.createElement('div')
    const handler = vi.fn()

    element.addEventListener('click', handler, true)

    // Expect that the original addEventListener is called with the boolean capture option unchanged
    expect(originalAddEventListener).toHaveBeenCalledWith('click', handler, true)
  })

  it('should allow passive to be set explicitly', () => {
    const element = document.createElement('div')
    const handler = vi.fn()
    const options = { passive: true }

    element.addEventListener('click', handler, options)

    // Expect that the original addEventListener is called with passive set to true
    expect(originalAddEventListener).toHaveBeenCalledWith('click', handler, options)
  })
})
