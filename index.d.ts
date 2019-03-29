import React, { HTMLAttributes } from "react";
type PlainObject = {
  [key: string]: any
}
export interface ColumnProps<T extends PlainObject = PlainObject> {
  title?: React.ReactNode
  key?: React.Key
  dataIndex?: keyof T | string
  render?: (text: any, record: T, index: number) => React.ReactNode
  align?: 'left' | 'right' | 'center'
  className?: string
  fixed?: boolean | ('left' | 'right')
}

export type TableRowProp = Partial<HTMLAttributes<HTMLTableRowElement>>


export interface TableProp<T extends PlainObject = PlainObject> {
  columns?: ColumnProps<T>[]
  dataSource?: T[]
  rowKey?: string
  className?: string
  style?: React.CSSProperties
  offsetTop?: number
  multiLine?: boolean
  scrollBarOffset?: number
  onRow?: (record: T) => TableRowProp
}

export interface HorizontalScrollBarProp {
  className?: string;
  scrollTarget?: string | HTMLElement;
  offsetBottom?: number;
}

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

declare module "@zzwing/react-table" {
  // type definitions goes here
  class BaseTable<T extends PlainObject = any> extends React.PureComponent<BaseTableProp<T>> {}
  class Table<T extends PlainObject = any> extends React.PureComponent<TableProp<T>> {}
  class HorizontalScrollBar extends React.Component<HorizontalScrollBarProp> {}
}
