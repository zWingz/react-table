/**
 * 节流函数
 * 规定时间内如果触发多次,则取消上一次请求,重新setTimeout
 *
 * @export
 * @param {Function} fnc 需要执行的函数
 * @param {Number} t 触发事件
 * @param {Function} beforeHook 每次执行之前的钩子
 * @returns
 */
export function timerFnc(fnc: Function, t: number): (arg?: any) => void {
  let timer = null
  const time: number = t || 200
  return function call(arg: any) {
    if (timer) {
      window.clearTimeout(timer)
    }
    timer = window.setTimeout(async () => {
      await fnc.call(this, arg)
      timer = null
    }, time)
  }
}

export function addResizeEventListener(
  ele: HTMLElement,
  resizeHandle: () => void
) {
  const obj = document.createElement('object')
  obj.setAttribute(
    'style',
    'position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden;opacity: 0; pointer-events: none; z-index: -1;'
  )
  obj.onload = () => {
    obj.contentDocument.defaultView.addEventListener(
      'resize',
      resizeHandle,
      false
    )
  }
  obj.type = 'text/html'
  ele.append(obj)
  obj.data = 'about:blank'
  return obj
}
