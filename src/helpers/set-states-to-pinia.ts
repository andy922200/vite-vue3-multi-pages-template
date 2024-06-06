import { Store } from 'pinia'

export function setStatesToPinia(store: Store, stateObj: Record<string, any>) {
  const storeStateArr = Object.keys(store.$state)
  const stateToBeSetArr = Object.keys(stateObj).filter((key) => storeStateArr.includes(key))

  store.$patch((state: Record<string, any>) => {
    stateToBeSetArr.forEach((key) => {
      state[key] = stateObj[key]
    })
  })
}
