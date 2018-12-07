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

| Props | Type | Default  | Desc |
| ----- | ---- | ---- | ------- |
| dataSource | Array | [] | data object |
| colums | [columnsProps](#columnsprops)[] | [] | table columns |
| rowKey | string | `none` | table row key, must be unique |
| className | string | '' | table classname |
| style | object | `{}` | table style |
| offsetTop | number | `0` | thead offsetTop |
| scrollBarOffset | number | 5 | scrollbar offset bottom |

```typescript
interface TableProp<T> {
  columns?: ColumnProps<T>[]
  dataSource?: T[]
  rowKey?: string
  className?: string
  style?: React.CSSProperties
  offsetTop?: number
  scrollBarOffset?: number
}
```

#### ColumnsProps

| Props | Type | Default  | Desc |
| ----- | ---- | ---- | ------- |
| title | any | `none` | column title |
| key | string | `none` | column key |
| dataIndex | string | '' | datasources key |
| render | (text, record, index) => any | () => {} | column render function |
| align | `left` &#124; `right` &#124; `center` | `center` | column align |
| className | string | '' | column className |
| fixed | `left` &#124; `right` &#124; `right` | `false` | column fixed flag |

```typescript
interface ColumnProps<T> {
  title?: React.ReactNode
  key?: React.Key
  dataIndex?: keyof T
  render?: (text: any, record: T, index: number) => React.ReactNode
  align?: 'left' | 'right' | 'center'
  className?: string
  fixed?: boolean | ('left' | 'right')
}
```


### ScrollBar

| Props | Type | Default  | Desc |
| ----- | ---- | ---- | ------- |
| className | string | '' | scrollbar className |
| scrollTarget | string &#124; HTMLElement | window | native scroll container |
| offsetBottom | number | 5 | scrollbar bottom offset |

```typescript
interface HorizontalScrollBarProp {
  className?: string
  scrollTarget?: string | HTMLElement
  offsetBottom?: number
}
```
