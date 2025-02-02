/**
 * @description 将 Request 对象中除 URL 以外的属性移动到 RequestInit 对象中
 * @param {Request} req - Request 对象
 * @returns {RequestInit} RequestInit 对象
 */

interface _RequestMove extends RequestInit {
  duplex?: 'half'
}

const requestMove = async (req: Request) => {
  const newReq: _RequestMove = {
    body: null,
    cache: undefined,
    credentials: undefined,
    headers: new Headers(),
    method: 'GET',
    mode: undefined,
    redirect: undefined,
    referrer: undefined,
    referrerPolicy: undefined,
    signal: undefined,
    keepalive: undefined,
    integrity: undefined,
    duplex: undefined
  }

  if (req.bodyUsed) {
    throw new Error('Request body has already been read.')
  }

  if (req.body) {
    newReq.body = req.body
    if (process) {
      newReq.body = req.body
      newReq.duplex = 'half'
    } else {
      delete newReq.duplex
    }
  } else {
    delete newReq.body
  }
  if (req.headers) {
    req.headers.forEach((value, key) => {
      ;(newReq.headers as Headers).append(key, value)
    })
  }
  // 重复上述过程，将 newReq 所有内容补全，而不是 return
  if (req.method) {
    newReq.method = req.method
  }
  if (req.mode) {
    newReq.mode = req.mode
  } else {
    delete newReq.mode
  }
  if (req.redirect) {
    newReq.redirect = req.redirect
  } else {
    delete newReq.redirect
  }
  if (req.referrer) {
    newReq.referrer = req.referrer
  } else {
    delete newReq.referrer
  }
  if (req.referrerPolicy) {
    newReq.referrerPolicy = req.referrerPolicy
  } else {
    delete newReq.referrerPolicy
  }
  if (req.signal) {
    newReq.signal = req.signal
  } else {
    delete newReq.signal
  }
  if (req.credentials) {
    newReq.credentials = req.credentials
  } else {
    delete newReq.credentials
  }
  if (req.cache) {
    newReq.cache = req.cache
  } else {
    delete newReq.cache
  }
  if (req.integrity) {
    newReq.integrity = req.integrity
  } else {
    delete newReq.integrity
  }
  if (req.keepalive) {
    newReq.keepalive = req.keepalive
  } else {
    delete newReq.keepalive
  }
  if (req.signal) {
    newReq.signal = req.signal
  } else {
    delete newReq.signal
  }
  return newReq
}

export default requestMove
