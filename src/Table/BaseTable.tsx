import * as React from 'react'
import classnames from 'classnames'
import { ColumnProps, TableRowProp, PlainObject } from './module'
import BaseRow from './BaseRow'
import { getChainObject } from '../utils'
import { addListeners, removeListeners } from './Listener'
interface BaseTableProp<T extends PlainObject = PlainObject> {
  columns?: ColumnProps<T>[]
  dataSource?: T[]
  rowKey?: string
  maxTop?: number
  getRef?: React.RefObject<HTMLTableElement>
  className?: string
  multiLine?: boolean
  style?: React.CSSProperties
  offsetTop?: number
  onRow?: (record: T) => TableRowProp
}

class BaseTable<T extends PlainObject = PlainObject> extends React.PureComponent<
  BaseTableProp<T>
> {
  static defaultProps = {
    style: {},
    dataSource: [],
    columns: [],
    maxTop: 0,
    offsetTop: 0
  }
  $content: React.RefObject<HTMLTableElement> = null
  $thead: React.RefObject<HTMLTableSectionElement> = null
  constructor(p) {
    super(p)
    this.$content = React.createRef()
    this.$thead = React.createRef()
  }

  renderThead() {
    const { columns } = this.props
    return (
      <thead ref={this.$thead}>
        <tr>
          {columns.map((each, idx) => (
            <th className={each.className} key={idx}>
              {each.title}
            </th>
          ))}
        </tr>
      </thead>
    )
  }

  renderTbody() {
    const { columns, dataSource, rowKey, onRow } = this.props
    return (
      <tbody>
        {dataSource.map((record, idx) => {
          let key = ''
          if ((rowKey as string).includes('.')) {
            key = getChainObject(record, rowKey as string)
          } else {
            key = record[rowKey] + ''
          }
          return (
            <BaseRow
              key={key}
              record={record}
              rowIndex={idx}
              onRow={onRow}
              columns={columns}
            />
          )
        })}
      </tbody>
    )
  }
  setTheadStyle(top) {
    const { current } = this.$thead
    if (top) {
      const style = `transform: translate3d(0px, ${top}px, 1px); will-change: transform;`
      current.classList.add('fixed')
      ;(current.style as any) = style
    } else {
      (current.style as any) = ''
      current.classList.remove('fixed')
    }
  }
  scrollHandle = () => {
    const { current } = this.$content
    if (!current) {
      return
    }
    const top = current.getBoundingClientRect().top - this.props.offsetTop
    const tt = top < 0 ? Math.min(-top, this.props.maxTop) : 0
    this.setTheadStyle(tt)
  }
  getRef = ref => {
    (this.$content.current as any) = ref
    if (this.props.getRef) {
      (this.props.getRef.current as any) = ref
    }
  }
  addEffect() {
    addListeners(this.scrollHandle)
  }
  removeEffect() {
    removeListeners(this.scrollHandle)
  }
  componentDidMount() {
    this.addEffect()
  }
  componentWillUnmount() {
    this.removeEffect()
  }
  render() {
    const { className, multiLine, style } = this.props
    return (
      <table
        ref={this.getRef}
        className={classnames('fixed-table', className, {
          'table-multiLine': multiLine
        })}
        style={style}>
        {this.renderThead()}
        {this.renderTbody()}
      </table>
    )
  }
}

export default BaseTable
