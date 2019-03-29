import * as React from 'react'
import { RefObject } from 'react'
import { TableProp, PlainObject, ColumnProps } from './module'
import BaseTable from './BaseTable'
import ScrollBar from '../HorizontalScrollBar'
import RowContext from './TableContext'
import './style.scss'
import classnames from 'classnames'

function querySelectorAll(selector, context) {
  /* istanbul ignore next */
  const ctx = context || document
  const dom = ctx.querySelectorAll(selector)
  return Array.prototype.slice.call(dom, 0)
}

class Table<T extends PlainObject = PlainObject> extends React.PureComponent<
  TableProp<T>
> {
  state = {
    // top: 0,
    rowsHeight: [],
    maxTop: 0
  }
  $tbody: RefObject<HTMLTableElement> = null
  // $right: RefObject<HTMLTableElement> = null
  // $left: RefObject<HTMLTableElement> = null
  content: RefObject<HTMLDivElement> = null
  fixedLeft = false
  fixedRight = false
  cacheColumns = []
  cacheData = null

  constructor(props) {
    super(props)
    this.content = React.createRef()
    this.$tbody = React.createRef()
  }

  get formatData(): { [k in 'left' | 'right' | 'body']: ColumnProps<T>[] } {
    const { columns } = this.props
    if (columns === this.cacheColumns && this.cacheData) {
      return this.cacheData
    }
    this.cacheColumns = columns
    const left = []
    const right = []
    columns.forEach(each => {
      const { fixed } = each
      if (!fixed) {
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
    this.cacheData = {
      left,
      body: columns,
      right
    }
    return this.cacheData
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

  getHeight() {
    const { current } = this.$tbody
    if (!current) return
    const thead = current.querySelector('thead tr')
    const { height } = current.getBoundingClientRect()
    const maxTop = thead ? height - thead.clientHeight : 0
    let rowsHeight = []
    if (this.props.multiLine) {
      rowsHeight = Array.prototype.slice
        .call(current.querySelectorAll('tbody tr'))
        .map(each => (each as HTMLElement).offsetHeight)
    }
    this.setState({
      maxTop,
      rowsHeight
    })
  }
  componentDidMount() {
    this.getHeight()
  }

  componentDidUpdate(prevProp) {
    if (prevProp !== this.props) {
      this.getHeight()
    }
  }

  render() {
    const {
      dataSource,
      rowKey,
      className,
      scrollBarOffset,
      onRow,
      multiLine,
      offsetTop
    } = this.props
    const { left, body, right } = this.formatData
    const commonProp = {
      dataSource,
      // top: this.state.top,
      rowKey,
      onRow,
      multiLine,
      offsetTop,
      maxTop: this.state.maxTop
    }
    return (
      <>
        <div
          className={classnames('fixed-table-container', className)}
          ref={this.content}
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut}>
          <ScrollBar className='flex-grow' offsetBottom={scrollBarOffset}>
            <BaseTable<T> getRef={this.$tbody} columns={body} {...commonProp} />
          </ScrollBar>
          <RowContext.Provider value={this.state.rowsHeight}>
            {this.fixedLeft && (
              <BaseTable<T>
                className='fixed-table_fixed fixed-table_fixed-left'
                columns={left}
                {...commonProp}
              />
            )}
            {this.fixedRight && (
              <BaseTable<T>
                className='fixed-table_fixed fixed-table_fixed-right'
                columns={right}
                {...commonProp}
              />
            )}
          </RowContext.Provider>
        </div>
        {
          // it is a magic code
          // i don't know why
          // just use a lower zIndex dom, but it must be outside of table dom
          // fixed thead shake in Chrome when scroll outside table
        }
        <div id='fixed-table-magic' style={{ zIndex: 1, position: 'fixed' }} />
      </>
    )
  }
}

export { BaseTable, Table }
