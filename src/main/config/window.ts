/**
 * 窗口元数据
 */
interface WindowsMetadata {
  /* 控制窗口宽度 */
  width: number
  /* 窗口路由地址 */
  route: string
}

export const windowsMetadata: WindowsMetadata[] = [
  {
    width: 300,
    route: '/'
  },
  {
    width: 300,
    route: '/countdown'
  },
  {
    width: 300,
    route: '/days-calculation'
  }
]
