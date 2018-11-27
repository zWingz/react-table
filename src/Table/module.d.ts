import { HTMLAttributes } from "react";
export type PlainObject = {
  [key: string]: any
}

export interface ColumnProps<T extends PlainObject = any> {
  title?: React.ReactNode
  key?: React.Key
  dataIndex?: keyof T
  render?: (text: any, record: T, index: number) => React.ReactNode
  align?: 'left' | 'right' | 'center'
  className?: string
  fixed?: boolean | ('left' | 'right')
}

export type TableRowProp = Partial<HTMLAttributes<HTMLTableRowElement>>


export interface TableProp<T extends PlainObject = any> {
  columns?: ColumnProps<T>[]
  dataSource?: T[]
  rowKey?: string
  className?: string
  style?: React.CSSProperties
  offsetTop?: number
  scrollBarOffset?: number
  onRow?: (record: T) => TableRowProp
}
