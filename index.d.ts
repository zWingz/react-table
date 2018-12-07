import React, { HTMLAttributes } from "react";
type PlainObject = {
  [key: string]: any
}
export interface ColumnProps<T extends PlainObject = any> {
  title?: React.ReactNode
  key?: React.Key
  dataIndex?: keyof T | string
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

export interface HorizontalScrollBarProp {
  className?: string;
  scrollTarget?: string | HTMLElement;
  offsetBottom?: number;
}
interface HorizontalScrollBarStat {
  width: number,
  percent: number, // 滚动按钮宽度占比
  x: number, // 鼠标按键x坐标
  bottom: number, // 底部
  scrollLeft: number,
  // opacity: number // 是否需要设置透明
}

export interface BaseTableProp<T extends PlainObject = any> {
  columns?: ColumnProps<T>[];
  dataSource?: T[];
  rowKey?: string;
  top?: string | number;
  getRef?: (ref: any) => void;
  className?: string;
  style?: React.CSSProperties;
  onRow?: (record: T) => TableRowProp;
}

declare module "@zzwing/react-table" {
  // type definitions goes here
  class BaseTable<T extends PlainObject = any> extends React.PureComponent<BaseTableProp<T>> {}
  class Table<T extends PlainObject = any> extends React.PureComponent<TableProp<T>> {}
  class HorizontalScrollBar extends React.Component<HorizontalScrollBarProp, HorizontalScrollBarStat> {}
}
