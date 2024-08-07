async function sendInBatches<T>({
  items,
  batchSize,
  asyncFn,
}: {
  items: T[]
  batchSize: number
  asyncFn: (item: T) => Promise<any>
}): Promise<boolean> {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const res = await Promise.allSettled(batch.map((item) => asyncFn(item)))
    const rejectedResults = res.filter(
      (result) => result.status === 'rejected',
    ) as PromiseRejectedResult[]

    if (rejectedResults.length !== 0) {
      return false
    }
  }
  return true
}

export { sendInBatches }
