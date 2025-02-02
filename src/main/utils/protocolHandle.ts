import { Hono } from 'hono'
import { app as electronApp } from 'electron'
import { promises } from 'fs'
import { join } from 'path'

const app = new Hono()

app.get('/versions/', (c) => {
  const chromium = process.versions.chrome
  const electron = process.versions.electron
  const node = process.versions.node
  return c.json({ chromium, node, electron })
})

app
  .post('/api/upload', async (c) => {
    try {
      const body = await c.req.formData()
      const file = body.get('file') as File

      // 确定MIME类型
      const mimeType = file.type // 这里假设File对象有type属性，实际使用时可能需要根据实际情况调整

      // 创建或检查目录存在
      const uploadDir = join(electronApp.getPath('userData'), '/countdown/')
      try {
        await promises.opendir(uploadDir)
      } catch {
        await promises.mkdir(uploadDir)
      }

      // 保存音频文件
      await promises.writeFile(join(uploadDir, 'audio_file'), Buffer.from(await file.arrayBuffer()))

      // 保存MIME类型到元数据文件
      await promises.writeFile(
        join(uploadDir, 'metadata.json'),
        JSON.stringify({ mimeType: mimeType })
      )

      return c.json({ message: 'File uploaded successfully' }, 200)
    } catch (err) {
      console.error('Error during file upload:', err)
      return c.json({ error: 'Error uploading file' }, 500)
    }
  })
  .get((c) => {
    return c.json(
      {
        message: "Method 'GET' is not allowed. Please use 'POST' method to upload file."
      },
      405
    )
  })

app.get('/api/countdownAudio', async (c) => {
  try {
    const audioFile = join(electronApp.getPath('userData'), '/countdown/audio_file')
    const metaDataFile = join(electronApp.getPath('userData'), '/countdown/metadata.json')

    // 读取MIME类型
    const metaData = JSON.parse(await promises.readFile(metaDataFile, 'utf-8'))
    const mimeType = metaData.mimeType

    const audio = await promises.readFile(audioFile)
    console.log(`Audio file size: ${audio.length} bytes`)
    return c.body(audio, 200, { 'Content-Type': mimeType, 'Content-Length': String(audio.length) })
  } catch (err) {
    console.error('Error reading file:', err)
    return c.json({ error: 'Error reading file' }, 500)
  }
})

app.notFound((c) => {
  return c.text(`You're trying to get response from: ${c.req.path}, But it's undefined.`, 404)
})

export const protocolApp = app
