export const selfConsole = {
  /**
   *
   * @param annotation 提示注释
   * @param content 内容部分
   * @param args 其余参数，同 `console.log(...args)`
   */
  log: (annotation: string, content: string, ...args) => {
    console.log(
      `%c ${annotation} %c ${content} `,
      'background:#0F6CBD;color:white;padding:2px 4px;border-radius:2px 0 0 2px;',
      'background:white;color:#0F6CBD;padding:2px 4px;border-radius:0 2px 2px 0;',
      ...args
    )
  },

  /**
   *
   * @param annotation 提示注释
   * @param content 内容部分
   * @param args 其余参数，同 `console.warn(...args)`
   */
  warn: (annotation: string, content: string, ...args) => {
    console.log(
      `%c ${annotation} %c ${content} `,
      'background:#F5A623;color:white;padding:2px 4px;border-radius:2px 0 0 2px;',
      'background:white;color:#F5A623;padding:2px 4px;border-radius:0 2px 2px 0;',
      ...args
    )
  }
}
