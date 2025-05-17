import { contextBridge, ipcRenderer } from 'electron'

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('message', {
      sendMouseMove: (hash: string) => ipcRenderer.send('win-move', hash), // 鼠标移动
      closeButton: () => ipcRenderer.send('close-button'), // 关闭按钮
      miniSizeButton: () => ipcRenderer.send('mini-size-button'), // 最小化按钮
      openUrl: (url: string) => ipcRenderer.send('open-url', url), // 打开链接
      invoke: async (channel, data) => await ipcRenderer.invoke(channel, data), // 通信
      send: (channel, data) => ipcRenderer.send(channel, data) // 发送消息
    })
  } catch (error) {
    console.error(error)
  }
}
