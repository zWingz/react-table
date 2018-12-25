import * as React from 'react'
import {TestDataType} from './DataSource'
const Columns: TestDataType = [{
  title: 'id',
  dataIndex: 'id',
  fixed: 'left'
}, {
  title: 'createTime',
  dataIndex: 'createTime',
  fixed: 'left'
}, {
  title: <span>jsx title</span>,
  dataIndex: 'name'
}, {
  title: 'title',
  dataIndex: 'title',
  className: 'th-custom-class',
  fixed: 'right'
}]

const ColumnsNoFixed = Columns.map(each => ({
  ...each,
  fixed: false
}))

export {Columns, ColumnsNoFixed}
