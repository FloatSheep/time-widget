// useLocalStorage.ts
import { ref, Ref } from 'vue'
import mediator from './mediator'

const createMediator = () => mediator.install({})

export const useStorage = <T = unknown>(key: string): Ref<T | null> => {
  const storageValue = ref<T | null>(null)
  const sub = createMediator()

  sub.subscribe!(key, (value: unknown) => {
    storageValue.value = value as T
  })

  return storageValue as Ref<T | null>
}
