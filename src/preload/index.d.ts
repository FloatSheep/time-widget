export {}

declare global {
  interface Window {
    /** 用于切换背景材料，仅在特定页面存在 */
    changeMaterial: null | ((material: string) => void)
    message: {
      /** 用于关闭 Electron 窗口 */
      closeButton: () => void
      /** 用于最小化 Electron 窗口 */
      miniSizeButton: () => void
      /** 用于触发 Electron 窗口移动 */
      sendMouseMove: () => void
      /** 用于打开外部链接 */
      openUrl: (url: string) => void
      /** 发送任意 IPC 信息到通道（invoke） */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invoke: (channel: string, data?: any) => Promise<unknown>
      /** 发送任意 IPC 信息到通道（send） */
      send: (channel: string, data?: unknown) => void
    }
  }
}
