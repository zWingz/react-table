import * as React from 'react'
import { shallow, mount } from 'enzyme'
import {Table, BaseTable } from '..'
import { default as dataSource } from './fixtures/DataSource'
import { ColumnProps, TableProp } from '../module'
type TestDataType = ColumnProps<typeof dataSource[0]>[]

;describe('test table', () => {
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

describe('test fixed render', () => {
  const columns: TestDataType = [{
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
  const wrapper = shallow<TableProp, any>(<Table dataSource={dataSource} columns={columns} rowKey='id'/>)
  it('it should have three BaseTable', () => {
    expect(wrapper.find(BaseTable)).toHaveLength(3)
  })
  it('fixed table should have right className', () => {
    const left = wrapper.find(BaseTable).at(0)
    const right = wrapper.find(BaseTable).at(2)
    expect(left.props().className).toEqual('fixed-table_fixed fixed-table_fixed-left')
    expect(right.props().className).toEqual('fixed-table_fixed fixed-table_fixed-right')
  })
  it('test hoverClass', () => {
    const wrapper2 = mount(<Table dataSource={dataSource} columns={columns} rowKey='id'/>)
    // const tables = wrapper2.find(BaseTable)
    // const left = tables.at(0)
    // const body = tables.at(1)
    // const right = tables.at(2)
    // const container = wrapper2.find('.fixed-table-container')
    // const trIndex = 2
    // const target = left.find('tbody tr').at(trIndex).getDOMNode()
    // console.log(target)
    // container.simulate('mouseover', {
    //   target
    // })
  })
})
