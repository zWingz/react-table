# React Fixed Table
[![CircleCI](https://circleci.com/gh/zWingz/react-table/tree/master.svg?style=svg)](https://circleci.com/gh/zWingz/react-table/tree/master)

[DEMO](http://zwing.site/react-table/#/)


## Install

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

```typescript
interface TableProp<T> {
  columns?: ColumnProps<T>[]
  dataSource?: T[]
  rowKey?: string
  className?: string
  style?: React.CSSProperties
  offsetTop?: number
}
```

### ColumnsProps

| Props | Type | Default  | Desc |
| ----- | ---- | ---- | ------- |
| title | any | `none` | column title |
| key | string | `none` | column key |
| dataIndex | string | '' | datasources key |
| render | (text, record, index) => any | () => {} | column render function |
| align | `left` &#124; `right` &#124; `center` &#124; `center` | column align |
| className | string | '' | column className |

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
