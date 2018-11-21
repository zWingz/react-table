import React, { RefObject } from 'react'
import PropTypes from 'prop-types'
import { TableProp } from './module'
import BaseTable from './BaseTable'
import ScrollBar from '../HorizontalScrollBar'
import './style.scss'
import classnames from 'classnames'

function querySelectorAll(selector, context) {
  const ctx = context || document
  const dom = ctx.querySelectorAll(selector)
  return Array.prototype.slice.call(dom, 0)
}

class Table<T> extends React.PureComponent<TableProp<T>> {

  static propTypes = {
    dataSource: PropTypes.array,
    columns: PropTypes.array,
    rowKey: PropTypes.string,
    offsetTop: PropTypes.number
  }

  state = {
    top: 0,
    paddingRight: 0,
    paddingLeft: 0
  }
  $tbody: HTMLTableElement = null
  $right: HTMLTableElement = null
  $left: HTMLTableElement = null
  content: RefObject<HTMLDivElement> = null
  fixedLeft = false
  fixedRight = false

  constructor(props) {
    super(props)
    this.content = React.createRef()
  }

  get formatData() {
    const { columns } = this.props
    const left = []
    const body = []
    const right = []
    columns.forEach(each => {
      const { fixed } = each
      if (!fixed) {
        body.push(each)
        return
      }
      if (fixed === 'right') {
        right.push(each)
        return
      }
      left.push(each)
    })
    this.fixedLeft = !!left.length
    this.fixedRight = !!right.length
    return {
      left,
      body,
      right
    }
  }

  get tableContentStyle() {
    const { paddingLeft, paddingRight } = this.state
    return {
      paddingLeft: paddingLeft + 'px',
      paddingRight: paddingRight + 'px'
    }
  }

  hoverClass(e, type) {
    const tr = e.target.closest('tr')
    if (!tr) {
      return
    }
    const idx = tr.rowIndex
    const trs = querySelectorAll(
      `tbody tr:nth-child(${idx})`,
      this.content.current
    )
    if (trs.length === 0) {
      return
    }
    trs.forEach(each => {
      each.classList[type]('hover')
    })
  }

  onMouseOver = e => {
    this.hoverClass(e, 'add')
  }

  onMouseOut = e => {
    this.hoverClass(e, 'remove')
  }

  scrollHandle = () => {
    const { $tbody } = this
    if (!$tbody) {
      return
    }
    // this.setScrollIng()
    const { top } = $tbody.getBoundingClientRect()
    this.setState({
      top: top < 0 ? -top : 0
    })
  }

  addEffect() {
    window.addEventListener('scroll', this.scrollHandle, {
      passive: true
    })
    window.addEventListener('resize', this.scrollHandle, {
      passive: true
    })
  }
  removeEffect() {
    window.removeEventListener('scroll', this.scrollHandle)
    window.removeEventListener('resize', this.scrollHandle)
  }

  setRightPadding() {
    if (!this.$right) {
      return
    }
    const { offsetWidth } = this.$right
    if (offsetWidth !== this.state.paddingRight) {
      this.setState({
        paddingRight: offsetWidth
      })
    }
  }
  setLeftPadding() {
    if (!this.$left) {
      return
    }
    const { offsetWidth } = this.$left
    if (offsetWidth !== this.state.paddingLeft) {
      this.setState({
        paddingLeft: offsetWidth
      })
    }
  }

  setPadding() {
    this.setLeftPadding()
    this.setRightPadding()
  }

  componentDidMount() {
    this.addEffect()
    this.setPadding()
  }

  componentDidUpdate(prevProp, prevState, snap) {
    this.setPadding()
  }

  componentWillUnmount() {
    this.removeEffect()
  }
  render() {
    const { dataSource, rowKey, className, scrollBarOffset, onRow } = this.props
    const { left, body, right } = this.formatData
    const commonProp = {
      dataSource,
      top: this.state.top,
      rowKey,
      onRow
    }
    return (
      <>
        <div
          className={classnames('fixed-table-container', className)}
          ref={this.content}
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut}
        >
          {this.fixedLeft && (
            <BaseTable
              getRef={el => {
                this.$left = el
              }}
              className='fixed-table_fixed fixed-table_fixed-left'
              columns={left}
              {...commonProp}
            />
          )}
          <ScrollBar className='flex-grow' offsetBottom={scrollBarOffset}>
            <BaseTable
              style={this.tableContentStyle}
              getRef={el => {
                this.$tbody = el
              }}
              columns={body}
              {...commonProp}
            />
          </ScrollBar>
          {this.fixedRight && (
            <BaseTable
              getRef={el => {
                this.$right = el
              }}
              className='fixed-table_fixed fixed-table_fixed-right'
              columns={right}
              {...commonProp}
            />
          )}
        </div>
        {
          // it is a magic code
          // i don't know why
          // just use a lower zIndex dom, but it must be outside of table dom
          // fixed thead shake in Chrome when scroll outside table
        }
        <div style={{ zIndex: 1, position: 'fixed' }} />
      </>
    )
  }
}

export { BaseTable, Table }
