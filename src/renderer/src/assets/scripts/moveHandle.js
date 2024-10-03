// 防抖函数
function debounce(func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

// 鼠标移动时发送消息
const sendMouseMoveDebounced = debounce(() => {
  window.message.sendMouseMove()
}, 200)

// 路由变化时的处理函数
function handleRouteChange() {
  const hash = window.location.hash
  if (hash === '#/countdown' || hash === '#/days-calculation' || hash === '#/') {
    document.addEventListener('mousemove', sendMouseMoveDebounced)
  } else {
    document.removeEventListener('mousemove', sendMouseMoveDebounced)
  }
}

// 初始检查
handleRouteChange()

// 监听 hash 变化
window.addEventListener('hashchange', handleRouteChange)
