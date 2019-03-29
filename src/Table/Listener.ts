let lock = false
let cbs = []
const passive = {
  passive: true
}
const exec = () => {
  cbs.forEach(each => each())
}

export function addListeners(cb) {
  cbs.push(cb)
  if (!lock) {
    window.addEventListener('scroll', exec, passive)
    window.addEventListener('resize', exec, passive)
    lock = true
  }
}

export function removeListeners(cb) {
  /* istanbul ignore next */
  if (!lock) return
  cbs = cbs.filter(each => each !== cb)
}
