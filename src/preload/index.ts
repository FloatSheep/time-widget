import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('message', {
      sendMouseMove: () => ipcRenderer.send('mouse-move'), // 鼠标移动
      closeButton: () => ipcRenderer.send('close-button'), // 关闭按钮
      miniSizeButton: () => ipcRenderer.send('mini-size-button'), // 最小化按钮
      openUrl: (url: string) => ipcRenderer.send('open-url', url) // 打开链接
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI // 暴露 electron API 进去
}
