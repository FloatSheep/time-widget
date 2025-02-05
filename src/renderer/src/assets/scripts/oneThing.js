// 鼠标中键

document.addEventListener('mousedown', function (event) {
  if (event.button === 1) {
    // 1 表示鼠标中键
    event.preventDefault() // 阻止默认行为
  }
})
