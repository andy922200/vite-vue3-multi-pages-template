import { onMounted, onUnmounted, ref, shallowRef } from 'vue'

export function useExecuteTimer({
  interval = 1000,
  maxTimes = Infinity,
  func = async () => {},
}: {
  interval?: number
  maxTimes?: number
  func?: () => Promise<any>
}) {
  const count = ref(0)
  const result = shallowRef<any>(null)
  let timerId: NodeJS.Timeout | null = null

  const cleanup = () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    }
  }

  const startTimer = () => {
    timerId = setInterval(async () => {
      count.value++
      try {
        result.value = await func?.()
      } catch (error) {
        console.error('Error executing function:', error)
        result.value = null
      }

      if (maxTimes !== Infinity && count.value >= maxTimes && timerId) {
        cleanup()
      }
    }, interval)
  }

  onMounted(() => {
    window.addEventListener('beforeunload', cleanup)
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    timerId,
    count,
    result,
    startTimer,
    cleanTimer: cleanup,
  }
}
