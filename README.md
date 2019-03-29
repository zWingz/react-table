# React Fixed Table

[![CircleCI](https://circleci.com/gh/zWingz/react-table/tree/master.svg?style=svg)](https://circleci.com/gh/zWingz/react-table/tree/master) [![codecov](https://codecov.io/gh/zWingz/react-table/branch/master/graph/badge.svg)](https://codecov.io/gh/zWingz/react-table)

[![Edit n3ml9m0zz4](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/n3ml9m0zz4)

## Document

[Document](http://zwing.site/react-table/#/)

## Install

`$ npm install @zzwing/react-table`

`import { Table, HorizontalScrollBar } from '@zzwing/react-table'`

## Usage

### Table

| Props           | Type                            | Default | Desc                                  |
| --------------- | ------------------------------- | ------- | ------------------------------------- |
| dataSource      | Array                           | []      | dataSource                            |
| colums          | [columnsProps](#columnsprops)[] | []      | columns props                         |
| rowKey          | string                          | `none`  | row key, unique, eg: `id`/`a.b.c`     |
| className       | string                          | ''      | table classname                       |
| style           | object                          | `{}`    | table style                           |
| multiLine       | boolean                         | false   | if row is multiline, need to set true |
| offsetTop       | number                          | `0`     | thead fixed-top offset                |
| scrollBarOffset | number                          | 5       | scrollbar fixed-bottom offset         |
| onRow           | (record: T) => TableRowProp     | --      | a function return table row props     |

```typescript
type PlainObject = {
  [key: string]: any
}

interface TableProp<T extends PlainObject = PlainObject> {
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
```

#### ColumnsProps

| Props     | Type                                  | Default  | Desc                                                   |
| --------- | ------------------------------------- | -------- | ------------------------------------------------------ |
| title     | any                                   | `none`   | column title                                           |
| key       | string                                | `none`   | column key, default is `dataIndex`                     |
| dataIndex | string                                | ''       | data field in each record, support chain eg: `a.b.c.d` |
| render    | (text, record, index) => any          | () => {} | column render function                                 |
| align     | `left` &#124; `right` &#124; `center` | `center` | text align                                             |
| className | string                                | ''       | --                                                     |
| fixed     | `left` &#124; `right` &#124; `right`  | `false`  | fixed flag                                             |

```typescript
interface ColumnProps<T> {
  title?: React.ReactNode
  key?: React.Key
  dataIndex?: keyof T | string
  render?: (text: any, record: T, index: number) => React.ReactNode
  align?: 'left' | 'right' | 'center'
  className?: string
  fixed?: boolean | ('left' | 'right')
}
```

#### BaseTable

like `Table`, but not fixed `left` and `right

```typescript
export interface BaseTableProp<T extends PlainObject = PlainObject> {
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
```

### ScrollBar

| Props        | Type                      | Default | Desc                    |
| ------------ | ------------------------- | ------- | ----------------------- |
| className    | string                    | ''      | scrollbar className     |
| scrollTarget | string &#124; HTMLElement | window  | native scroll container |
| offsetBottom | number                    | 5       | scrollbar bottom offset |

```typescript
interface HorizontalScrollBarProp {
  className?: string
  scrollTarget?: string | HTMLElement
  offsetBottom?: number
}
```
