export interface MediatorProps {
  uuid?: number
  publish?: (topic: string, ...args: unknown[]) => void
  subscribe?: (topic: string, callback: (...args: unknown[]) => void) => void
}
const mediator = (function () {
  // eslint-disable-next-line prefer-const
  let topics = [],
    uuid = 0
  function subscribe(topic: string, callback: (...args: unknown[]) => void) {
    uuid++
    topics[topic] = topics[topic] ? [...topics[topic], { callback, uuid }] : [{ callback, uuid }]
  }
  function publish(topic: string, ...args: unknown[]) {
    if (topics[topic]) {
      topics[topic].map((item) => item.callback(...args))
    }
  }
  return {
    install: function (obj: MediatorProps) {
      obj.uuid = uuid
      obj.publish = publish
      obj.subscribe = subscribe
      return obj
    }
  }
})()
export default mediator
