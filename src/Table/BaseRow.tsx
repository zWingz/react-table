import React, { HTMLAttributes } from 'react'
import { PlainObject, ColumnProps } from './module'

type RowProp = Partial<HTMLAttributes<HTMLTableRowElement>>

function getChainObject(obj: PlainObject, path: string) {
  const keys = path.split('.')
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

export default React.memo(function TableRow<T>(props: TableRowProp<T>) {
  const { record, onRow, columns, rowIndex } = props
    const trProp: RowProp = {}
    if (onRow) {
      const { className } = onRow(record)
      trProp.className = className
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
              key={
                key || (dataIndex as string) || dataIndex + columnIdx.toString()
              }
            >
              {value}
            </td>
          )
        })}
      </tr>
    )
}
)
