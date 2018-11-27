import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { ColumnProps, TableRowProp, PlainObject } from './module'
import BaseRow from './BaseRow'
interface BaseTableProp<T extends PlainObject = any> {
  columns?: ColumnProps<T>[]
  dataSource?: T[]
  rowKey?: string
  top?: string | number,
  getRef?: (ref: any) => void,
  className?: string
  style?: React.CSSProperties,
  onRow?: (record: T) => TableRowProp
}

class BaseTable<T extends PlainObject = any> extends React.PureComponent<BaseTableProp<T>> {
  static propTypes = {
    dataSource: PropTypes.array,
    columns: PropTypes.array,
    rowKey: PropTypes.string,
    top: PropTypes.number
  }
  static defaultProps = {
    getRef: () => {},
    style: {},
    dataSource: [],
    columns: []
  }
  get theadStyle(): React.CSSProperties {
    const { top } = this.props
    if(top) {
      return {
        transform: `translate3d(0px, ${top}px, 1px)`
      }
    }
    return {}
  }

  renderThead() {
    const { columns, top } = this.props
    return (
      <thead className={top ? 'fixed' : ''} style={this.theadStyle}>
        <tr>
          {columns.map((each, idx) => (
            <th className={each.className} key={idx}>{each.title}</th>
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
          const key = record[rowKey] + ''
          return <BaseRow
            key={key}
            record={record}
            rowIndex={idx}
            onRow={onRow}
            columns={columns}
          />
        })}
      </tbody>
    )
  }

  render() {
    return (
        <table ref={el => this.props.getRef(el)} className={classnames('fixed-table', this.props.className)} style={this.props.style}>
          {this.renderThead()}
          {this.renderTbody()}
        </table>
    )
  }
}

export default BaseTable
