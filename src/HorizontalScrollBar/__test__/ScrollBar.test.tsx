import * as React from 'react'
import { shallow, mount, ReactWrapper } from 'enzyme'
import Scrollbar from '..'

const BaseWidth = {
  scrollWidth: 2554,
  offsetWidth: 754,
  clientWidth: 754
}

function getCom(offsetBottom = 10, scrollTarget) {
  return <Scrollbar scrollTarget={scrollTarget} offsetBottom={offsetBottom}><div>children</div></Scrollbar>
}

function getMount(arg: {offsetBottom?, scrollTarget?} = {}) {
  return mount<Scrollbar>(getCom(arg.offsetBottom, arg.scrollTarget))
}

describe('test scrollbar', () => {
const wrapper = getMount()
  it('test snapshots', () => {
    expect(wrapper).toMatchSnapshot('scroll bar snapshot')
  })
  it('wrapper should have overflow: hidden & position: relative', () => {
    expect(wrapper.find('div').at(0).props().style).toEqual({
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
    const wrapper = getMount({scrollTarget: div})
    const ins = wrapper.instance()
    expect(ins.scroller).toBe(div)
  })
  it('target should be window', () => {
    const div = document.createElement('div')
    div.id = 'target'
    document.body.append(div)
    const wrapper = getMount({scrollTarget: 'target'})
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
  it('should show when bottom > 5 && test bar width', (done) => {
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
      expect(ins.state.scrollWidth).toEqual(BaseWidth.scrollWidth - BaseWidth.offsetWidth)
      const percent = BaseWidth.offsetWidth / BaseWidth.scrollWidth
      expect(ins.state.percent).toEqual(percent)
      const style = {
        transform: `translate3d(0px, 0px, 0px)`,
        width: percent * 100 + '%'
      }
      expect(ins.innerScrollLeft).toEqual(style)
      expect(wrapper.find('.virtual-scroll')).toHaveLength(1)
      expect(wrapper.find('.virtual-scroll-bar')).toHaveLength(1)
      const innerStyle = (wrapper.find('.virtual-scroll-bar').getDOMNode() as HTMLDivElement).style
      expect(innerStyle.transform).toEqual(style.transform)
      expect(innerStyle.width).toEqual(style.width)
      done()
    }, 500)
  })
})

describe('test outerBar position', () => {
  const bottom = 100
  const offsetBottom = 20
  const wrapper = getMount({offsetBottom})
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
    expect(ins.outerStyle).toEqual(style)
    expect(wrapper.find('.virtual-scroll').props().style).toEqual(style)
  })
})

describe('test window.onscroll', () => {
  describe('scroller is window', () => {
    const wrapper = getMount()
    const ins = wrapper.instance()
    const bottom = 300
    const clientHeight = 200
    Object.defineProperty(window.document.documentElement, 'clientHeight', {
      value: clientHeight
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
    expect(ins.state.bottom).toEqual(bottom - clientHeight)
  })
  describe('scroller is div', () => {
    const div = document.createElement('div')
    const wrapper = mount(<Scrollbar scrollTarget={div}><div>123</div></Scrollbar>)
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
