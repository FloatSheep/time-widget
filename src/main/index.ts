import { app, shell, BrowserWindow, Tray, Menu, screen, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { MicaBrowserWindow, IS_WINDOWS_11, WIN10 } from 'mica-electron'
import icon from '../../resources/icon.png?asset'

global.globalInstantiated = false

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
  const movingDistance = -90
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

  // 设置窗口背景材料
  if (IS_WINDOWS_11) {
    mainWindow.setMicaEffect()
  } else if (WIN10) {
    mainWindow.setBlur()
  }

  // 圆角、基本设置
  mainWindow.setRoundedCorner()
  mainWindow.setMaximizable(false)
  mainWindow.setResizable(false)
  /*   mainWindow.webContents.openDevTools() */

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

  /*   mainWindow.focus()
  mainWindow.on('blur', () => mainWindow.focus())

  mainWindow.setIgnoreMouseEvents(true, { forward: true }) */

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

  // ipc 进程通信（鼠标移动时显示窗口）
  ipcMain.on('mouse-move', () => {
    clearTimeout(moveToTopTimeout) // 清除计时器
    animateWindowPosition(mainWindow, xOffset, yOffset + topOffset, animationDuration) // 移动到原来的位置
    moveToTopTimeout = setTimeout(() => {
      animateWindowPosition(mainWindow, xOffset, movingDistance, animationDuration) // 再次设置计时器
    }, 2000)
  })
}

// 缓动函数
// https://easings.net/zh-cn#easeInOutQuart
function easeInOutQuart(x: number): number {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2
}

// 窗口移动动画
function animateWindowPosition(window, targetX, targetY, duration) {
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

// ipc 进程通信（在浏览器中打开）
ipcMain.on('open-url', (_, url) => {
  shell.openExternal(url)
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

// HardAcceleration
app.commandLine.appendSwitch('enable-features', 'HardwareAcceleration')

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('app.floatsheep.timeWidget')

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

          // 设置窗口背景材料
          if (IS_WINDOWS_11) {
            settingWindow.setMicaEffect()
          } else if (WIN10) {
            settingWindow.setBlur()
          }

          // 圆角、基本设置
          settingWindow.setRoundedCorner()
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
  const windowWidths = [300, 300, 300] // 设置不同窗口的宽度，这样写是 Copilot 教的😭
  const totalWidth =
    windowWidths.reduce((acc, width) => acc + width, 0) + gap * (windowWidths.length - 1) // 计算总共占用的屏幕宽度
  const { width } = screen.getPrimaryDisplay().workAreaSize // 获得显示屏幕宽度

  // 确保窗口总宽度不超过屏幕宽度，超过不显示顶部窗口
  if (!(totalWidth > width)) {
    const startX = Math.round((width - totalWidth) / 2) // 除去占用后的剩余宽度
    let currentX = startX

    // 多窗口路由
    const routes = ['/', '/countdown', '/days-calculation']
    if (!global.globalInstantiated) {
      windowWidths.forEach((windowWidth, index) => {
        createWindow(currentX, 0, windowWidth, 100, routes[index]) // 循环创建窗口，并分配不同 hash
        currentX += windowWidth + gap
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
