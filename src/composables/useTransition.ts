import { onBeforeUnmount, ref } from 'vue'

export const useCollapseTransition = (options?: Record<string, any>) => {
  const { transitionDuration = 400, transitionTimingFunction = 'cubic-bezier(0.1, 0.5, 0.8, 1)' } =
    options || {}

  // Ref to store the timeout ID for cleanup
  const timeoutId = ref<number | null>(null)

  const beforeEnter = (el: Element) => {
    const htmlElement = el as HTMLElement
    htmlElement.style.height = '0'
    htmlElement.style.overflow = 'hidden'
  }

  const enter = (el: Element) => {
    const htmlElement = el as HTMLElement
    htmlElement.style.height = '0'
    htmlElement.style.overflow = 'hidden'
    htmlElement.style.transition = `height ${transitionDuration}ms ${transitionTimingFunction}`

    // 強制 reflow
    void htmlElement.offsetHeight

    const targetHeight = `${htmlElement.scrollHeight}px`
    htmlElement.style.height = targetHeight

    const cleanup = () => {
      htmlElement.style.height = 'auto'
      htmlElement.style.overflow = ''
      htmlElement.style.transition = ''
      htmlElement.removeEventListener('transitionend', cleanup)
      timeoutId.value = null
    }

    htmlElement.addEventListener('transitionend', cleanup)

    // 保底 timeout：避免 transitionend 沒觸發
    if (timeoutId.value) clearTimeout(timeoutId.value)
    timeoutId.value = window.setTimeout(() => {
      cleanup()
    }, transitionDuration + 50)
  }

  const leave = (el: Element) => {
    const htmlElement = el as HTMLElement

    htmlElement.style.height = `${htmlElement.scrollHeight}px`
    htmlElement.style.transition = `height ${transitionDuration}ms ${transitionTimingFunction}`

    // 強制 reflow
    void htmlElement.offsetHeight

    htmlElement.style.overflow = 'hidden'
    htmlElement.style.height = '0'

    const cleanup = () => {
      htmlElement.style.display = 'none'
      htmlElement.style.overflow = ''
      htmlElement.style.height = ''
      htmlElement.style.transition = ''
      htmlElement.removeEventListener('transitionend', cleanup)
    }

    htmlElement.addEventListener('transitionend', cleanup)
  }

  onBeforeUnmount(() => {
    if (timeoutId.value) clearTimeout(timeoutId.value)
  })

  return {
    beforeEnter,
    enter,
    leave,
  }
}
