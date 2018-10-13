export interface ColumnProps<T> {
  title?: React.ReactNode
  key?: React.Key
  dataIndex?: keyof T
  render?: (text: any, record: T, index: number) => React.ReactNode
  align?: 'left' | 'right' | 'center'
  colSpan?: number
  width?: string | number
  className?: string
  fixed?: boolean | ('left' | 'right')
}

export interface TableProp<T> {
  columns?: ColumnProps<T>[]
  dataSource?: T[]
  rowKey?: string
  className?: string
  style?: React.CSSProperties
  offsetTop?: number
}
