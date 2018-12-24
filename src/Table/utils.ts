import { PlainObject } from './module'

export function getChainObject(obj: PlainObject, path: string) {
  const keys = path.split('.')
  if(keys.length === 1) {
    return obj[path]
  }
  const len = keys.length
  let tra = obj
  for (let i = 0; i < len; i++) {
    const key = keys[i]
    const tmp = tra[key]
    if (i === len - 1) {
      return tmp
    }
    if (tmp === undefined) {
      return undefined
    }
    tra = tmp
  }
}
