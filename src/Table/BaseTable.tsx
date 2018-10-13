import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { ColumnProps } from './module'

interface BaseTableProp<T> {
  columns?: ColumnProps<T>[]
  dataSource?: T[]
  rowKey?: string
  top?: string | number,
  getRef?: (ref: any) => void,
  className?: string
  style?: React.CSSProperties
}

class BaseTable<T = any> extends React.PureComponent<BaseTableProp<T>> {
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
            <th key={idx}>{each.title}</th>
          ))}
        </tr>
      </thead>
    )
  }

  renderTbody() {
    const { columns, dataSource, rowKey } = this.props
    return (
      <tbody>
        {dataSource.map((record, idx) => {
          const keyValue = record[rowKey] + ''
          return (
            <tr key={keyValue}>
              {columns.map((column, columnIdx) => {
                let value = null
                const { dataIndex, render, key } = column
                if (dataIndex) {
                  value = record[dataIndex]
                }
                if (render) {
                  value = render(value, record, idx)
                }
                return (
                  <td
                    style={{textAlign: column.align}}
                    key={key || (dataIndex as string) || keyValue + columnIdx}
                  >
                    {value}
                  </td>
                )
              })}
            </tr>
          )
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
