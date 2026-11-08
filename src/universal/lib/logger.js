const isDebug =
  typeof process !== 'undefined'
    ? Boolean(process.env?.DEBUG || process.env?.NODE_ENV === 'development')
    : typeof window !== 'undefined'
      ? Boolean(window.DEBUG)
      : false

export const logger = {
  log: (...args) => {
    if (isDebug) {
      console.log(...args)
    }
  },
  warn: (...args) => {
    console.warn(...args)
  },
  error: (...args) => {
    console.error(...args)
  },
}

export default logger
