import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    message: {
      closeButton: () => void
      miniSizeButton: () => void
      sendMouseMove: () => void
      openUrl: () => void
    }
  }
}
