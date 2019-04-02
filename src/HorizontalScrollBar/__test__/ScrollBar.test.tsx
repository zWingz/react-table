import * as React from 'react'
import { shallow, mount, ReactWrapper } from 'enzyme'
import Scrollbar from '..'

const BaseWidth = {
  scrollWidth: 2554,
  offsetWidth: 754,
  clientWidth: 754
}

function getCom(offsetBottom = 10, scrollTarget) {
  return (
    <Scrollbar scrollTarget={scrollTarget} offsetBottom={offsetBottom}>
      <div>children</div>
    </Scrollbar>
  )
}

function getMount(arg: { offsetBottom?; scrollTarget? } = {}) {
  return mount<Scrollbar>(getCom(arg.offsetBottom, arg.scrollTarget))
}

describe('test scrollbar', () => {
  const wrapper = getMount()
  it('test snapshots', () => {
    expect(wrapper).toMatchSnapshot('scroll bar snapshot')
  })
  it('wrapper should have overflow: hidden & position: relative', () => {
    expect(
      wrapper
        .find('div')
        .at(0)
        .props().style
    ).toEqual({
      overflow: 'hidden',
      position: 'relative'
    })
  })
})

describe('test scrollTarget', () => {
  it('target should be window', () => {
    const wrapper = getMount()
    const ins = wrapper.instance()
    expect(ins.scroller).toBe(window)
  })
  it('target should be dom', () => {
    const div = document.createElement('div')
    const wrapper = getMount({ scrollTarget: div })
    const ins = wrapper.instance()
    expect(ins.scroller).toBe(div)
  })
  it('target should be window', () => {
    const div = document.createElement('div')
    div.id = 'target'
    document.body.append(div)
    const wrapper = getMount({ scrollTarget: 'target' })
    const ins = wrapper.instance()
    expect(ins.scroller).toBe(div)
  })
})

describe('test innerBar', () => {
  const wrapper = getMount()
  const ins = wrapper.instance()

  it('should hidden when bottom < 5', () => {
    expect(wrapper.find('.virtual-scroll')).toHaveLength(0)
    expect(wrapper.find('.virtual-scroll-bar')).toHaveLength(0)
  })
  it('should show when bottom > 5 && test bar width', done => {
    wrapper.setState({
      // ...ins.state,
      bottom: 10
    })
    wrapper.update()
    ins.$target = {
      current: {
        ...BaseWidth
      } as HTMLDivElement
    }
    ins.refreshScroll()
    setTimeout(() => {
      expect(ins.state.scrollWidth).toEqual(
        BaseWidth.scrollWidth - BaseWidth.offsetWidth
      )
      const percent = BaseWidth.offsetWidth / BaseWidth.scrollWidth
      expect(ins.state.percent).toEqual(percent)
      const style = {
        transform: `translate3d(0px, 0px, 0px)`,
        width: percent * 100 + '%'
      }
      expect(ins.innerScrollLeft).toEqual(style)
      expect(wrapper.find('.virtual-scroll')).toHaveLength(1)
      expect(wrapper.find('.virtual-scroll-bar')).toHaveLength(1)
      const innerStyle = (wrapper
        .find('.virtual-scroll-bar')
        .getDOMNode() as HTMLDivElement).style
      expect(innerStyle.transform).toEqual(style.transform)
      expect(innerStyle.width).toEqual(style.width)
      done()
    }, 275)
  })
})

describe('test outerBar position', () => {
  const bottom = 100
  const offsetBottom = 20
  const wrapper = getMount({ offsetBottom })
  it('test offsetBottom', () => {
    const ins = wrapper.instance()
    wrapper.setState({
      bottom
    })
    const style = {
      transform: `translate3d(0px, ${-bottom}px, 0px)`,
      bottom: offsetBottom + 'px'
      // opacity: (bottom > 5 && percent < 1) ? 1 : 0
    }
    expect(ins.outerStyle).toMatchObject(style)
    expect(wrapper.find('.virtual-scroll').props().style).toMatchObject(style)
  })
})

describe('test window.onscroll', () => {
  describe('scrollTarget is window', () => {
    const wrapper = getMount()
    const ins = wrapper.instance()
    const bottom = 300
    const innerHeight = 200
    Object.defineProperty(window, 'innerHeight', {
      value: innerHeight
    })
    ins.$target = {
      current: {
        getBoundingClientRect() {
          return {
            bottom
          } as ClientRect
        }
      } as HTMLDivElement
    }
    const e = new Event('scroll')
    window.dispatchEvent(e)
    expect(ins.state.bottom).toEqual(bottom - innerHeight)
  })
  describe('scrollTarget is a dom', () => {
    const div = document.createElement('div')
    const wrapper = mount(
      <Scrollbar scrollTarget={div}>
        <div>123</div>
      </Scrollbar>
    )
    const ins = wrapper.instance() as Scrollbar
    const bottom = 500
    const top = 110
    const clientHeight = 130
    ins.$target = {
      current: {
        getBoundingClientRect() {
          return {
            bottom
          } as ClientRect
        }
      } as HTMLDivElement
    }
    div.getBoundingClientRect = jest.fn().mockReturnValue({
      top
    })
    Object.defineProperty(div, 'clientHeight', {
      value: clientHeight
    })
    const e = new Event('scroll')
    div.dispatchEvent(e)
    expect(ins.state.bottom).toEqual(bottom - top - clientHeight)
  })
})

describe('test sync target.scrollLeft', () => {
  const wrapper = getMount()
  const ins = wrapper.instance()
  it('should sync target.scrollLeft', () => {
    const scrollLeft = 200
    ins.$target.current.scrollLeft = 200
    const e = new Event('scroll')
    ins.$target.current.dispatchEvent(e)
    expect(ins.state.scrollLeft).toEqual(scrollLeft)
  })
})

describe('test barWrapper mousedown', () => {
  it('should set $target.scrollLeft', () => {
    const wrapper = getMount()
    const ins = wrapper.instance()
    const barOffsetWidth = 200
    const percent = 0.23
    const startLeft = 100
    const barLeft = startLeft * percent
    wrapper.setState({
      scrollLeft: startLeft,
      percent,
      bottom: 10
    })
    ins.$bar = {
      current: {
        offsetWidth: barOffsetWidth
      } as HTMLDivElement
    }
    const outer = wrapper.find('.virtual-scroll')
    let mousedownOffsetX = 500
    outer.simulate('mousedown', {
      nativeEvent: {
        offsetX: mousedownOffsetX
      }
    })
    // scroll to right
    let offsetX = mousedownOffsetX - barOffsetWidth - barLeft
    let newScrollLeft = startLeft + offsetX / percent
    expect(ins.state.scrollLeft).toEqual(newScrollLeft)
    expect(ins.$target.current.scrollLeft).toEqual(newScrollLeft)
    mousedownOffsetX = 250
    outer.simulate('mousedown', {
      nativeEvent: {
        offsetX: mousedownOffsetX
      }
    })
    // scroll to left
    offsetX = mousedownOffsetX - barLeft
    newScrollLeft = startLeft + offsetX / percent
    expect(ins.state.scrollLeft).toEqual(newScrollLeft)
    expect(ins.$target.current.scrollLeft).toEqual(newScrollLeft)
  })
})

describe('test bar inner mousemove', () => {
  const wrapper = getMount()
  const scrollWidth = 500
  const percent = 0.23
  let startX = 0
  let scrollLeft = 23
  beforeEach(() => {
    wrapper.setState({
      bottom: 10,
      percent,
      scrollWidth,
      scrollLeft
      // x: startX
    })
    wrapper.instance().x = startX
  })
  it('mousedown should only work for event.button === 0', () => {
    const inner = wrapper.find('.virtual-scroll-bar')
    const ins = wrapper.instance()
    startX = 100
    inner.simulate('mousedown', {
      button: 1,
      clientX: startX
    })
    expect(ins.x).toEqual(0)
    inner.simulate('mousedown', {
      button: 0,
      clientX: startX
    })
    expect(ins.x).toEqual(startX)
  })
  it('body should add no-select class', () => {
    expect(document.body.classList.contains('no-select')).toBeTruthy()
  })
  it('mousemove, scroll to right', () => {
    const newClientX = 200
    const ins = wrapper.instance()
    const e = new MouseEvent('mousemove', {
      clientX: newClientX
    } as MouseEventInit)
    document.body.dispatchEvent(e)
    expect(ins.x).toBe(newClientX)
    const speed = (newClientX - startX) / percent
    scrollLeft = scrollLeft + speed
    expect(wrapper.state().scrollLeft).toEqual(scrollLeft)
  })
  it('mousemove, scroll to rleft', () => {
    const newClientX = 78
    const ins = wrapper.instance()
    const e = new MouseEvent('mousemove', {
      clientX: newClientX
    } as MouseEventInit)
    document.body.dispatchEvent(e)
    expect(ins.x).toBe(newClientX)
    const speed = (newClientX - startX) / percent
    scrollLeft = scrollLeft + speed
    expect(wrapper.state().scrollLeft).toEqual(scrollLeft)
  })
  it('scrollLeft max is scrollWidth', () => {
    const newClientX = 9999
    const e = new MouseEvent('mousemove', {
      clientX: newClientX
    } as MouseEventInit)
    document.body.dispatchEvent(e)
    expect(wrapper.state().scrollLeft).toEqual(scrollWidth)
  })
  it('scrollLeft min is 0', () => {
    const newClientX = -9999
    const e = new MouseEvent('mousemove', {
      clientX: newClientX
    } as MouseEventInit)
    document.body.dispatchEvent(e)
    expect(wrapper.state().scrollLeft).toEqual(0)
  })
  it('body mouseUp should remove body mousemove', () => {
    const mouseUpEvent = new MouseEvent('mouseup')
    const ins = wrapper.instance()
    document.body.dispatchEvent(mouseUpEvent)
    expect(document.body.classList.contains('no-select')).toBeFalsy()
    const x = ins.x
    const newClientX = -9999
    const moveE = new MouseEvent('mousemove', {
      clientX: newClientX
    } as MouseEventInit)
    document.body.dispatchEvent(moveE)
    expect(ins.x).not.toEqual(newClientX)
    expect(ins.x).toEqual(x)
  })
})

describe('test shouldComponentUpdate', () => {
  it('should not update when state.bottom < 5 || state.percent >= 1', () => {
    const wrapper = getMount()
    const ins = wrapper.instance()
    const didUpdate = jest.spyOn(ins, 'componentDidUpdate')
    wrapper.setState({
      bottom: 3,
      percent: 0.1
    })
    expect(didUpdate).toBeCalledTimes(0)
    wrapper.setState({
      percent: 0.23
    })
    expect(didUpdate).toBeCalledTimes(0)
    wrapper.setState({
      bottom: 6
    })
    expect(didUpdate).toBeCalledTimes(1)
    wrapper.setState({
      percent: 1
    })
    expect(didUpdate).toBeCalledTimes(2)
    wrapper.setState({
      bottom: 20
    })
    expect(didUpdate).toBeCalledTimes(2)
    wrapper.setState({
      percent: 0.5
    })
    expect(didUpdate).toBeCalledTimes(3)
    wrapper.setState({
      bottom: 0
    })
    expect(didUpdate).toBeCalledTimes(4)
  })
})

describe('test refresh', () => {

  it('refresh when target.scrollWidth change, and set opacity=0', (done) => {
    const wrapper = getMount()
    const ins = wrapper.instance()
    wrapper.setState({
      bottom: 10
    })
    const spyRefresh = jest.spyOn(ins, 'refreshScroll')
    const spyUpdate = jest.spyOn(ins, 'componentDidUpdate')
    const spySetOpacity = jest.spyOn(ins, 'setOpacity')
    wrapper.setProps({
      offsetBottom: 20
    })
    expect(spyUpdate).toBeCalledTimes(1)
    expect(spyRefresh).toBeCalledTimes(0)
    expect(spySetOpacity).toBeCalledTimes(0)
    ins.$target = {
      current: {
        scrollWidth: 100
      }
    } as any
    wrapper.setProps({
      children: 10
    })
    // exec update three times, one by refreshScroll, second by setOpacity(0) after refreshScroll
    expect(spyUpdate).toBeCalledTimes(3)
    expect(spyRefresh).toBeCalledTimes(1)
    expect(ins.state.opacity).toBe(0)
    expect(spySetOpacity).toBeCalledTimes(1)
    setTimeout(() => {
      expect(ins.state.opacity).toBe(1)
      expect(spySetOpacity).toBeCalledTimes(2)
      done()
    }, 550)
  })
})

describe('test unmount', () => {
  it('set _isMounted false after unmount', () => {
    const wrapper = getMount()
    const ins = wrapper.instance()
    expect(ins._isMounted).toBeTruthy()
    wrapper.unmount()
    expect(ins._isMounted).toBeFalsy()
  })
  it('handle should not be called wehen _isMounted=false', (done) => {
    const wrapper = getMount()
    const ins = wrapper.instance()
    ins._isMounted = false
    const spyTargetScrollHandle = jest.spyOn(ins, 'targetScrollHandle')
    const spyOnScrollHandle = jest.spyOn(ins, 'onScrollHandle')
    ins.refreshScroll()
    setTimeout(() => {
      expect(spyTargetScrollHandle).toBeCalledTimes(0)
      const e = new Event('scroll')
      window.dispatchEvent(e)
      expect(spyOnScrollHandle).toBeCalledTimes(0)
      ins.$target.current.dispatchEvent(e)
      expect(spyTargetScrollHandle).toBeCalledTimes(0)
      done()
    }, 275)
  })
})

describe('test scrolling', () => {
  it('should set scrolling true when onScrolling, and set false onScrollEnd', (done) => {
    const wrapper = getMount()
    const ins = wrapper.instance()
    // ins.refreshScroll()
    setTimeout(() => {
      expect(ins.scrolling).toBeFalsy()
      ins.onScrollHandle()
      expect(ins.scrolling).toBeTruthy()
      setTimeout(() => {
        expect(ins.scrolling).toBeFalsy()
        done()
      }, 275)
    }, 500)
  })
})

describe('test debounce', () => {
  it('refresh should debounce', (done) => {
    const wrapper = getMount()
    const ins = wrapper.instance()
    const spy = jest.spyOn(ins, 'onScrollHandle')
    ins.refreshScroll()
    ins.refreshScroll()
    ins.refreshScroll()
    setTimeout(() => {
      expect(spy).toBeCalledTimes(1)
      done()
    }, 275)
  })
  it('onScrollEnd should debounce', (done) => {
    const wrapper = getMount()
    const ins = wrapper.instance()
    setTimeout(() => {
      ins.scrolling = true
      ins.onScrollEnd()
      expect(ins.scrolling).toBeTruthy()
      ins.onScrollEnd()
      expect(ins.scrolling).toBeTruthy()
      ins.onScrollEnd()
      expect(ins.scrolling).toBeTruthy()
      setTimeout(() => {
        expect(ins.scrolling).toBeFalsy()
        done()
      }, 250)
    }, 275)
  })
  it('setOpacityShow should debounce', (done) => {
    const wrapper = getMount()
    const ins = wrapper.instance()
    const spy = jest.spyOn(ins, 'setOpacity')
    ins.setOpacityShow()
    ins.setOpacityShow()
    ins.setOpacityShow()
    expect(spy).toBeCalledTimes(0)
    setTimeout(() => {
      expect(spy).toBeCalledTimes(1)
      done()
    }, 250)
  })
})
