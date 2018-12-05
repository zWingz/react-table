import * as React from 'react'
import { HTMLAttributes } from 'react'
import { PlainObject, ColumnProps } from './module'

type RowProp = Partial<HTMLAttributes<HTMLTableRowElement>>

export function getChainObject(obj: PlainObject, path: string) {
  const keys = path.split('.')
  if(keys.length === 1) {
    return obj[path]
  }
  const len = keys.length
  let tra = obj
  for (let i = 0; i < len; i++) {
    const key = keys[i]
    const tmp = tra[key]
    if (i === len - 1) {
      return tmp
    }
    if (tmp === undefined) {
      return undefined
    }
    tra = tmp
  }
}

interface TableRowProp<T> {
  record: T
  columns: ColumnProps<T>[]
  rowIndex: number
  onRow?: (record: T) => RowProp
}

// TODO: use React.memo instead of PureComponent when enzyme support

export default class TableRow<T extends PlainObject = any> extends React.PureComponent<TableRowProp<T>> {
  render() {
    const { record, onRow, columns, rowIndex } = this.props
      const trProp: RowProp = {}
      if (onRow) {
        const onRowProp = onRow(record) || {}
        Object.assign(trProp, onRowProp)
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
                className={column.className}
                key={
                  key || (dataIndex as string) || columnIdx.toString()
                }
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
