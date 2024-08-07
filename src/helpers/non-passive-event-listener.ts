interface EventTargetWithFunc extends EventTarget {
  func?: typeof EventTarget.prototype.addEventListener
}

function overrideAddEventListener() {
  if (typeof EventTarget !== 'undefined') {
    const originalAddEventListener = EventTarget.prototype.addEventListener
    EventTarget.prototype.addEventListener = function (
      this: EventTargetWithFunc,
      type,
      fn,
      options,
    ) {
      if (typeof options !== 'boolean') {
        options = options || {}
        options.passive = false
      }
      return originalAddEventListener.call(this, type, fn, options)
    }
  }
}

export { overrideAddEventListener }
