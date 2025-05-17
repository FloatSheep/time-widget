function debounce(func, wait, immediate = false) {
  let timeout
  return function (...args) {
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = null
      if (!immediate) {
        func.apply(this, args)
      }
    }, wait)
    if (callNow) {
      func.apply(this, args)
    }
  }
}

// 当前hash对应的鼠标移动事件处理函数
let currentMouseMoveHandler = null

// 鼠标移动时发送消息
function localSendMouseMove() {
  const currentHash = window.location.hash
  if (currentMouseMoveHandler && currentHash !== currentMouseMoveHandler.hash) {
    // 如果 hash 变化，清除之前的事件处理函数
    document.removeEventListener('mousemove', currentMouseMoveHandler.handler)
    currentMouseMoveHandler = null
  }
  if (!currentMouseMoveHandler) {
    // 如果当前没有绑定事件处理函数，则绑定新的防抖函数
    const debouncedHandler = debounce(
      () => {
        const currentHash = window.location.hash
        const windowId = window.__WINDOW_ID__ || 'default'

        window.message.send('request-slide', {
          hash: currentHash,
          windowId,
          targetY: 20
        })
      },
      200,
      true
    )
    currentMouseMoveHandler = { hash: currentHash, handler: debouncedHandler }
    document.addEventListener('mousemove', debouncedHandler)

    // 手动触发首次执行
    debouncedHandler()
  }
}

// 路由变化时的处理函数
function handleRouteChange() {
  const hash = window.location.hash
  if (hash === '#/countdown' || hash === '#/days-calculation' || hash === '#/') {
    localSendMouseMove() // 绑定鼠标移动事件
  } else {
    if (currentMouseMoveHandler) {
      // 如果离开指定hash页面，清除事件处理函数
      document.removeEventListener('mousemove', currentMouseMoveHandler.handler)
      currentMouseMoveHandler = null
    }
  }
}

// 监听hash变化
const debouncedHandleRouteChange = debounce(handleRouteChange, 200)

// 初始检查
handleRouteChange()

// 监听hash变化事件
window.addEventListener('hashchange', debouncedHandleRouteChange)
