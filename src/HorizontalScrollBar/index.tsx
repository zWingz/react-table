import * as React from 'react'
import { timerFnc, addResizeEventListener } from '../utils'
import classnames from 'classnames'
import './style.scss'
export interface HorizontalScrollBarProp {
  // scrollTarget: React.ReactNode
  className?: string
  scrollTarget?: string | HTMLElement
  offsetBottom?: number
}

interface HorizontalScrollBarStat {
  scrollWidth: number
  percent: number // 滚动按钮宽度占比
  x: number // 鼠标按键x坐标
  bottom: number // 底部
  scrollLeft: number
  // opacity: number // 是否需要设置透明
}
function checkShow({ bottom, percent }) {
  return bottom > 5 && percent < 1
}
class HorizontalScrollBar extends React.Component<
  HorizontalScrollBarProp,
  HorizontalScrollBarStat
> {
  static defaultProps = {
    offsetBottom: 5
  }
  /**
   * @function
   * 计算往左滚动距离
   */
  get innerScrollLeft() {
    const { percent, scrollLeft } = this.state
    let barScroll = scrollLeft * percent
    if (Number.isNaN(barScroll)) {
      barScroll = 0
    }
    return {
      transform: `translate3d(${barScroll}px, 0px, 0px)`,
      width: percent * 100 + '%'
    }
  }
  /**
   * @function
   * 滚动条位置
   */
  get outerStyle() {
    const { offsetBottom } = this.props
    const { bottom } = this.state
    return {
      transform: `translate3d(0px, ${-bottom}px, 0px)`,
      bottom: offsetBottom + 'px'
      // opacity: (bottom > 5 && percent < 1) ? 1 : 0
    }
  }

  state: HorizontalScrollBarStat = {
    scrollWidth: 0,
    percent: 0, // 滚动按钮宽度占比
    x: 0, // 鼠标按键x坐标
    bottom: 0, // 底部
    scrollLeft: 0
    // opacity: 1 // 是否需要设置透明
  }
  _isMounted = false
  iframe: HTMLObjectElement = null // iframe,用来监听resize
  // observer = {}
  scroller: HTMLElement | Window = null
  $bar: React.RefObject<HTMLDivElement> = null
  $target: React.RefObject<HTMLDivElement> = null

  /**
   * @function
   * 监听target的大小变化,重新计算虚拟滚动条的宽度.以及滚动占比
   */
  refreshScroll = timerFnc(() => {
    if (!this._isMounted) {
      return
    }
    const { current } = this.$target
    const { scrollWidth, scrollLeft } = this.state
    const {
      scrollWidth: currentScrollWidth,
      offsetWidth,
      clientWidth
    } = current
    const nextWidth = currentScrollWidth - (offsetWidth || clientWidth)
    if (scrollLeft > scrollWidth || scrollWidth === 0) {
      this.setScrollLeft(0)
    }
    const nextPercent = offsetWidth / currentScrollWidth
    this.setState({
      scrollWidth: nextWidth,
      percent: isNaN(nextPercent) ? 0 : nextPercent
    })
    this.onScrollHandle()
    this.targetScrollHandle()
  }, 250)
  constructor(props: HorizontalScrollBarProp) {
    super(props)
    this.$bar = React.createRef()
    this.$target = React.createRef()
  }
  get showBar() {
    return checkShow(this.state)
  }
  /**
   * @function
   * 监听全局滚动, 用来将虚拟滚动条固定在底部
   */
  onScrollHandle = () => {
    if(!this._isMounted) {
      return
    }
    const { bottom } = this.$target.current.getBoundingClientRect()
    let offset = 0
    const { scroller } = this
    if (scroller === window) {
      offset = document.documentElement.clientHeight
    } else {
      const { top } = (scroller as HTMLElement).getBoundingClientRect()
      const { clientHeight } = scroller as HTMLElement
      offset = top + clientHeight
    }
    const result = Math.max(bottom - offset, 0)
    this.setState({
      bottom: result
    })
  }
  /**
   * @function
   * 目标滚动时候同步到虚拟滚动条位置
   */
  targetScrollHandle = () => {
    if (!this._isMounted) {
      return
    }
    this.setScrollLeft(this.$target.current.scrollLeft)
  }
  /**
   * @event
   * 点解滚动条自动滚动到特定位置
   */
  barOuterMouseDownHandle: React.MouseEventHandler = event => {
    const { nativeEvent } = event
    const { scrollLeft, percent } = this.state
    const barLeft = scrollLeft * percent
    let offsetX = nativeEvent.offsetX - this.$bar.current.offsetWidth - barLeft
    if (offsetX < 0) {
      offsetX = -barLeft + nativeEvent.offsetX
    }
    this.setScrollLeft(scrollLeft + offsetX / percent)
    this.barInnerMouseDownHandle(event)
  }
  /**
   * @event
   * 点解滚动条给body监听mousemove事件以及mouseup事件.
   * 执行拖动
   */
  barInnerMouseDownHandle: React.MouseEventHandler = event => {
    event.stopPropagation()
    if (event.button !== 0) {
      return
    }
    this.setX(event.clientX)
    document.body.addEventListener(
      'mousemove',
      this.bodyMouseMoveHandle,
      false
    )
    document.body.classList.add('no-select')
    document.body.addEventListener('mouseup', this.bodyMouseUpHandle, false)
  }
  /**
   * @event
   * 拖动事件
   */
  bodyMouseMoveHandle = event => {
    const offsetX = event.clientX - this.state.x,
      speed = offsetX / this.state.percent
    if (offsetX > 0) {
      this.up(speed)
    } else {
      this.down(-speed)
    }
    this.setX(event.clientX)
  }
  /**
   * @event
   * body的mouseUp事件,用来移除mousemove事件以及mouseup事件
   */
  bodyMouseUpHandle = () => {
    document.body.removeEventListener(
      'mousemove',
      this.bodyMouseMoveHandle,
      false
    )
    document.body.removeEventListener('mouseup', this.bodyMouseUpHandle, false)
    document.body.classList.remove('no-select')
  }
  // setOpacity(val) {
  //   this.setState({
  //     opacity: val
  //   })
  // }
  setX(x) {
    this.setState({
      x
    })
  }
  setScrollLeft(val) {
    this.setState({
      scrollLeft: val
    })
    this.$target.current.scrollLeft = val
  }
  /**
   * @function
   * 往左拉
   */
  down(speed) {
    const { scrollLeft } = this.state
    this.setScrollLeft(scrollLeft - speed > 0 ? scrollLeft - speed : 0)
  }
  /**
   * @function
   * 往右拉
   */
  up(speed) {
    const { scrollLeft, scrollWidth } = this.state
    const left = scrollLeft + speed
    this.setScrollLeft(left > scrollWidth ? scrollWidth : left)
  }
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.showBar || checkShow(nextState) || this.props !== nextProps
  }
  componentDidMount() {
    this._isMounted = true
    const { scrollTarget } = this.props
    if (!scrollTarget) {
      this.scroller = window
    } else {
      if (typeof scrollTarget === 'string') {
        (this.scroller as HTMLElement) = document.getElementById(scrollTarget)
      } else {
        this.scroller = scrollTarget
      }
    }
    this.scroller.addEventListener('scroll', this.onScrollHandle, {
      passive: true
    })
    this.scroller.addEventListener('resize', this.onScrollHandle, false)
    this.$target.current.addEventListener(
      'scroll',
      this.targetScrollHandle,
      false
    )
    this.iframe = addResizeEventListener(
      this.$target.current,
      this.refreshScroll
    )
    this.refreshScroll()
  }
  componentDidUpdate(prevProps) {
    // console.log('did updat');
    if (prevProps.children !== this.props.children) {
      this.refreshScroll()
    }
  }
  componentWillUnmount() {
    this._isMounted = false
    this.scroller.removeEventListener('scroll', this.onScrollHandle)
    this.scroller.removeEventListener('resize', this.onScrollHandle)
    this.iframe.removeEventListener('resize', this.refreshScroll)
    this.iframe.remove()
  }
  render() {
    const { bottom, percent } = this.state
    return (
      <div
        className={this.props.className}
        style={{ overflow: 'hidden', position: 'relative' }}
      >
        <div ref={this.$target} className='scroll-container'>
          {this.props.children}
          {bottom > 5 && percent < 1 && (
            <div
              className='virtual-scroll overhidden'
              style={this.outerStyle}
              onMouseDown={this.barOuterMouseDownHandle}
            >
              <div
                ref={this.$bar}
                className='virtual-scroll-bar'
                style={this.innerScrollLeft}
                onMouseDown={this.barInnerMouseDownHandle}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default HorizontalScrollBar
