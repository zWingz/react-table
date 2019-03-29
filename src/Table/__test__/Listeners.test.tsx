import { addListeners, removeListeners } from '../Listener'

describe('test listener', () => {
  it('test', () => {
    const fn = jest.fn()
    addListeners(fn)
    let event = new Event('scroll')
    window.dispatchEvent(event)
    expect(fn).toBeCalledTimes(1)
    event = new Event('resize')
    window.dispatchEvent(event)
    expect(fn).toBeCalledTimes(2)
    removeListeners(fn)
    window.dispatchEvent(event)
    expect(fn).toBeCalledTimes(2)
    event = new Event('scroll')
    window.dispatchEvent(event)
    expect(fn).toBeCalledTimes(2)
  })
})
