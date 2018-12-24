import * as React from 'react'
import { HTMLAttributes } from 'react'
import { PlainObject, ColumnProps } from './module'
import { getChainObject } from './utils'
import classnames from 'classnames'
import Context from './TableContext'

type RowProp = Partial<HTMLAttributes<HTMLTableRowElement>>

interface TableRowProp<T> {
  record: T
  columns: ColumnProps<T>[]
  rowIndex: number
  onRow?: (record: T) => RowProp
}

// TODO: use React.memo instead of PureComponent when enzyme support

export default class TableRow<
  T extends PlainObject = any
> extends React.PureComponent<TableRowProp<T>> {
  static contextType = Context
  render() {
    const { record, onRow, columns, rowIndex } = this.props
    const height = this.context[rowIndex]
    const trProp: RowProp = {
      style: {}
    }
    if (onRow) {
      const onRowProp = onRow(record) || {}
      Object.assign(trProp, onRowProp)
    }
    trProp.style = {
      height,
      ...trProp.style
    }
    return (
      <tr {...trProp}>
        {columns.map((column, columnIdx) => {
          let value = null
          const { dataIndex, render, key } = column
          if (dataIndex) {
            if ((dataIndex as string).includes('.')) {
              value = getChainObject(record, dataIndex as string)
            } else {
              value = record[dataIndex as string]
            }
          }
          if (render) {
            value = render(value, record, rowIndex)
          }
          return (
            <td
              style={{ textAlign: column.align }}
              className={classnames(column.className, { fixed: column.fixed })}
              key={key || (dataIndex as string) || columnIdx.toString()}
            >
              {value}
            </td>
          )
        })}
      </tr>
    )
  }
}

// export default React.memo(function TableRow<T extends PlainObject = any>(props: TableRowProp<T>) {
// }
// )
