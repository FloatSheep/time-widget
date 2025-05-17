// 鼠标中键
document.addEventListener('mousedown', function (event) {
  if (event.button === 1) {
    // 1 表示鼠标中键
    event.preventDefault() // 阻止默认行为
  }
})

// 处理主题和材料
const material = localStorage.getItem('material')
const appearance = localStorage.getItem('appearance')
const hash = window.location.hash

;(() => {
  if (material) {
    if (
      ['#/countdown', '#/days-calculation'].includes(hash) ||
      (hash === '#/' && material === 'acrylic-7')
    ) {
      window.message.invoke('change-material', 'acrylic-11')
    }

    window.message.invoke('change-material', material)
  } else {
    window.message.invoke('change-material', 'mica')
    localStorage.setItem('material', 'mica')
  }

  if (appearance) {
    window.message.invoke('change-appearance', appearance)
  }
})()

addEventListener('DOMContentLoaded', () => {
  if (hash === '#/' && material === 'acrylic-7') {
    const isDark =
      appearance === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches
    if (isDark && localStorage.getItem('material-tips') !== 'true') {
      localStorage.setItem('material-tips', 'true')
      window.message.send('show-notification', {
        title: '小贴士',
        body: 'Acrylic(Win7+) 与亮色模式更搭哦！\n 此提示只会显示一次'
      })
    } else {
      console.log(isDark, localStorage.getItem('material-tips'), window.message.send)
    }
  }
})
