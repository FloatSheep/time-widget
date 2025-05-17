import { app, shell, BrowserWindow, Tray, Menu, screen, ipcMain, protocol } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { MicaBrowserWindow, IS_WINDOWS_11, WIN10 } from 'mica-electron'
import icon from '../../resources/icon.png?asset'
import { protocolApp } from './utils/protocolHandle'
import { windowsMetadata } from './config/window'

global.globalInstantiated = false

// 防止实例化多个窗口
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
}

// 创建顶部窗口函数
function createWindow(
  xOffset: number,
  yOffset: number,
  windowWidth: number = 200,
  windowHeight: number = 200,
  routePath: string = '/',
  alwaysTop: boolean = true
): void {
  const topOffset = 20
  const movingDistance = -88
  const animationDuration = 500

  // Create the browser window.
  const mainWindow = new MicaBrowserWindow({
    width: windowWidth,
    height: windowHeight,
    show: false,
    x: xOffset,
    y: yOffset + topOffset,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    frame: false,
    alwaysOnTop: alwaysTop,
    transparent: true,
    skipTaskbar: true // 移除任务栏图标
  })

  // 设置窗口背景材料、圆角
  if (IS_WINDOWS_11) {
    mainWindow.setMicaEffect()
    mainWindow.setRoundedCorner()
  } else if (WIN10) {
    mainWindow.setAcrylic()
  }

  // 基本设置
  mainWindow.setMaximizable(false)
  mainWindow.setResizable(false)
  /*   mainWindow.webContents.openDevTools() */

  // 加入窗口列表
  mainWindowList.push(mainWindow)

  // 确保窗口关闭时从列表中移除
  mainWindow.on('closed', () => {
    const index = mainWindowList.indexOf(mainWindow)
    if (index > -1) {
      mainWindowList.splice(index, 1)
    }
  })
  // 没什么用
  mainWindow.webContents.on('before-input-event', (_, input) => {
    if (input.type === 'mouseDown' || input.type === 'mouseUp') {
      mainWindow.setIgnoreMouseEvents(true)
      setTimeout(() => {
        mainWindow.setIgnoreMouseEvents(true, { forward: true })
      }, 100)
    }
  })

  // 显示窗口
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // 拦截新窗口打开事件
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#${routePath}`)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: routePath })
  }

  // 添加计时器和鼠标事件监听器
  let moveToTopTimeout = setTimeout(() => {
    animateWindowPosition(mainWindow, xOffset, movingDistance, animationDuration)
  }, 3000) // 3秒

  const lastMouseMoveTimestamps = new Map<string, number>()

  // 全局变量，控制是否已滑出
  let isSlided = false

  // 当前动画结束时间戳，防止短时间内重复触发
  let lastSlideTime = 0

  // 监听鼠标引起的滑入滑出事件
  ipcMain.on('request-slide', (_event, payload) => {
    const now = Date.now()

    // 如果最近500ms内已滑出，则忽略
    if (now - lastSlideTime < 500 || isSlided) {
      return
    }

    isSlided = true
    lastSlideTime = now

    // 向所有窗口发送 trigger-slide 消息
    const currentTime = Date.now()
    const lastTime = lastMouseMoveTimestamps.get(payload.hash) || 0

    // 如果当前时间与上次时间间隔小于200ms，则忽略本次事件
    if (currentTime - lastTime < 500) {
      return
    }

    // 更新时间戳并处理事件
    lastMouseMoveTimestamps.set(payload.hash, currentTime)
    clearTimeout(moveToTopTimeout) // 清除计时器
    animateWindowPosition(mainWindow, xOffset, yOffset + topOffset, animationDuration) // 移动到原来的位置
    moveToTopTimeout = setTimeout(() => {
      if (!isMouseInWindow(mainWindow)) {
        animateWindowPosition(mainWindow, xOffset, movingDistance, animationDuration) // 再次设置计时器
      }
    }, 2000)

    // 动画结束后重置状态（假设动画持续1秒）
    setTimeout(() => {
      isSlided = false
    }, 1000)
  })

  // ipc 进程通信（用于保存配置等的窗口移动）
  ipcMain.on('win-move', (_event, hash: string) => {
    const currentTime = Date.now()
    const lastTime = lastMouseMoveTimestamps.get(hash) || 0

    // 如果当前时间与上次时间间隔小于200ms，则忽略本次事件
    if (currentTime - lastTime < 500) {
      return
    }

    // 更新时间戳并处理事件
    lastMouseMoveTimestamps.set(hash, currentTime)
    clearTimeout(moveToTopTimeout) // 清除计时器
    animateWindowPosition(mainWindow, xOffset, yOffset + topOffset, animationDuration) // 移动到原来的位置
    moveToTopTimeout = setTimeout(() => {
      if (!isMouseInWindow(mainWindow)) {
        animateWindowPosition(mainWindow, xOffset, movingDistance, animationDuration) // 再次设置计时器
      }
    }, 2000)
  })
}

// 判断鼠标是否在窗口范围内
function isMouseInWindow(window: BrowserWindow): boolean {
  const { x, y, width, height } = window.getBounds() // 获取窗口的边界信息
  const cursorPoint = screen.getCursorScreenPoint() // 获取鼠标当前的全局屏幕坐标
  const mouseX = cursorPoint.x
  const mouseY = cursorPoint.y

  return mouseX >= x && mouseX <= x + width && mouseY >= y && mouseY <= y + height
}

// 缓动函数
// https://easings.net/zh-cn#easeInOutQuart
function easeInOutQuart(x: number): number {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2
}

// 存储所有窗口引用，方便主进程统一操作
const mainWindowList: BrowserWindow[] = []

// 窗口移动动画
function animateWindowPosition(
  window: BrowserWindow,
  targetX: number,
  targetY: number,
  duration: number
) {
  const startX = window.getBounds().x
  const startY = window.getBounds().y
  const startTime = Date.now()

  function step() {
    const currentTime = Date.now()
    const elapsedTime = currentTime - startTime
    const progress = Math.min(elapsedTime / duration, 1)
    const easedProgress = easeInOutQuart(progress)

    const newX = startX + (targetX - startX) * easedProgress
    const newY = startY + (targetY - startY) * easedProgress

    window.setBounds({
      x: Math.round(newX),
      y: Math.round(newY),
      width: window.getBounds().width,
      height: window.getBounds().height
    })

    if (progress < 1) {
      setImmediate(step)
    }
  }

  step()
}

// 添加一个新的 IPC 接收 trigger-slide 事件
ipcMain.on('trigger-slide', (_event, payload) => {
  const targetY = payload.targetY ?? 20 // 可选参数，从渲染进程传入目标 Y 值

  // 遍历所有窗口并触发动画
  mainWindowList.forEach((window) => {
    const bounds = window.getBounds()
    animateWindowPosition(window, bounds.x, targetY, 500)
  })
})

// ipc 进程通信（在浏览器中打开）
ipcMain.on('open-url', (_, url) => {
  shell.openExternal(url)
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

// HardAcceleration
app.commandLine.appendSwitch('enable-features', 'HardwareAcceleration')

// 自定义 macaron:// 协议通信
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'macaron',
    privileges: {
      bypassCSP: true,
      standard: true,
      secure: true,
      supportFetchAPI: true
    }
  }
])

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('app.floatsheep.timeWidget')

  // 处理自定义协议
  protocol.handle('macaron', async (req) => {
    return protocolApp.fetch(req) // 将请求转发给 Hono 处理
  })

  // 初始化托盘
  const myTray = new Tray(icon)

  // 提出窗口
  let settingWindow

  // 防止打开多个设置界面
  let instantiate = false

  const menuContext = Menu.buildFromTemplate([
    {
      type: 'checkbox',
      label: '开机自启动',
      checked: app.getLoginItemSettings().openAtLogin,
      click: function () {
        if (!app.isPackaged) {
          app.setLoginItemSettings({
            openAtLogin: !app.getLoginItemSettings().openAtLogin,
            path: process.execPath
          })
        } else {
          app.setLoginItemSettings({
            openAtLogin: !app.getLoginItemSettings().openAtLogin
          })
        }
      }
    },
    {
      label: '设置',
      click: () => {
        if (!instantiate) {
          const { width, height } = screen.getPrimaryDisplay().workAreaSize

          // 设置窗口的尺寸
          const windowWidth = 800
          const windowHeight = 630

          // 计算窗口位置（居中显示）
          // 但是好像不写也是居中 🥺
          const x = Math.round((width - windowWidth) / 2)
          const y = Math.round((height - windowHeight) / 2)
          settingWindow = new MicaBrowserWindow({
            width: windowWidth,
            height: windowHeight,
            show: true,
            x,
            y,
            autoHideMenuBar: true,
            ...(process.platform === 'linux' ? { icon } : {}),
            webPreferences: {
              preload: join(__dirname, '../preload/index.js'),
              sandbox: false
            },
            frame: false, // 关闭 chrome 外壳
            alwaysOnTop: false, // 关闭置顶
            transparent: true,
            skipTaskbar: false
          })

          instantiate = true

          if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            settingWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#/settings`)
          } else {
            settingWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'settings' })
          }

          settingWindow.setIgnoreMouseEvents(false)

          // 设置窗口背景材料、圆角
          if (IS_WINDOWS_11) {
            settingWindow.setMicaEffect()
            settingWindow.setRoundedCorner()
          } else if (WIN10) {
            settingWindow.setAcrylic()
          }

          // 基本设置
          settingWindow.setMaximizable(false)
          settingWindow.setResizable(false)
          /*           settingWindow.webContents.openDevTools() */
        } else {
          settingWindow.show()
        }
      }
    },
    {
      label: '退出',
      click: () => {
        app.quit()
      }
    }
  ])

  ipcMain.on('close-button', () => {
    settingWindow.close()
    instantiate = false
  })
  ipcMain.on('mini-size-button', () => {
    settingWindow.minimize()
  })

  myTray.setToolTip('Time Widget!')
  myTray.setContextMenu(menuContext)

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const gap = 20 // 设置顶部窗口之间的间隔
  const totalWidth =
    windowsMetadata.reduce((acc, meta) => acc + meta.width, 0) + gap * (windowsMetadata.length - 1) // 计算总共占用的屏幕宽度
  const { width } = screen.getPrimaryDisplay().workAreaSize // 获得显示屏幕宽度

  // 确保窗口总宽度不超过屏幕宽度，超过不显示顶部窗口
  if (!(totalWidth > width)) {
    const startX = Math.round((width - totalWidth) / 2) // 除去占用后的剩余宽度
    let currentX = startX

    if (!global.globalInstantiated) {
      windowsMetadata.forEach((meta) => {
        createWindow(currentX, 0, meta.width, 100, meta.route) // 使用 metadata 创建窗口
        currentX += meta.width + gap // 更新下一个窗口的 X 坐标
      })
      global.globalInstantiated = true
    }
  }

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow(0, 0, 200, 200)
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
