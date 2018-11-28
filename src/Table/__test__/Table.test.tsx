import * as React from 'react'
import { shallow } from 'enzyme'
import {Table, BaseTable} from '..'
import { default as dataSource } from './DataSource'
import { ColumnProps, TableProp } from '../module'

describe('test table', () => {
  type TestDataType = ColumnProps<typeof dataSource[0]>[]
  const columns: TestDataType = [{
    title: 'id',
    dataIndex: 'id'
  }, {
    title: 'createTime',
    dataIndex: 'createTime'
  }, {
    title: <span>jsx title</span>,
    dataIndex: 'name'
  }, {
    title: 'title',
    dataIndex: 'title',
    className: 'th-custom-class'
  }]
  it('base render', () => {
    const wrapper = shallow<TableProp, any>(<Table dataSource={dataSource} columns={columns} rowKey='id'/>)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find(BaseTable)).toHaveLength(1)
    expect(wrapper.find('#fixed-table-magic')).toHaveLength(1)
    expect(wrapper.state().top).toEqual(0)
    expect(wrapper.state().paddingRight).toEqual(0)
    expect(wrapper.state().paddingLeft).toEqual(0)
    const ins = wrapper.instance() as any
    expect(ins.fixedLeft).toBeFalsy()
    expect(ins.fixedRight).toBeFalsy()
    expect(ins.cacheColumns).toEqual(columns)
  })
})
