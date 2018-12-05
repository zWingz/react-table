import * as React from 'react'
import { shallow, mount, ShallowWrapper, ReactWrapper } from 'enzyme'
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
  it('body table should setPadding', () => {
    const ins = wrapper.instance() as Table
    const $left = ins.$left
    const $right = ins.$right
    const leftWidth = 101
    const rightWidth = 105
    ins.$left = {
      offsetWidth: leftWidth
    } as HTMLTableElement
    ins.$right = {
      offsetWidth: rightWidth
    } as HTMLTableElement
    ins.setPadding()
    const style = {
      paddingLeft: leftWidth + 'px',
      paddingRight: rightWidth + 'px'
    }
    expect(ins.tableContentStyle).toEqual(style)
    expect(wrapper.find(BaseTable).at(1).props().style).toEqual(style)
    ins.$left = $left
    ins.$right = $right
  })
  it('test hoverClass', () => {
    const mountWrapper = mount(<Table dataSource={dataSource} columns={columns} rowKey='id'/>)
    const tables = mountWrapper.find(BaseTable)
    const left = tables.at(0)
    const body = tables.at(1)
    const right = tables.at(2)
    const container = mountWrapper.find('.fixed-table-container')
    const trIndex = 2
    const target = left.find('tbody tr').at(trIndex).getDOMNode()
    container.simulate('mouseover', {
      target
    })
    // console.log(getClassList(body))
    function getClassList(wrap: ReactWrapper) {
      return wrap.find('tbody tr').at(trIndex).getDOMNode().classList
    }
    expect(getClassList(left).contains('hover')).toBeTruthy()
    expect(getClassList(body).contains('hover')).toBeTruthy()
    expect(getClassList(right).contains('hover')).toBeTruthy()
    container.simulate('mouseout', {
      target
    })
    expect(getClassList(left).contains('hover')).toBeFalsy()
    expect(getClassList(body).contains('hover')).toBeFalsy()
    expect(getClassList(right).contains('hover')).toBeFalsy()
    container.simulate('mouseout', {
      target: document.createElement('div')
    })
    expect(mountWrapper.find('hover')).toHaveLength(0)
  })
})

describe('test scroll top', () => {
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
  const wrapper = mount<TableProp, any>(<Table dataSource={dataSource} columns={columns} rowKey='id'/>)
  const ins = wrapper.instance() as Table
  let cacheData = null, cacheColumns = null
  it('window scroll should update state.top', () => {
    const $tbody = ins.$tbody
    const top = 105
    ins.$tbody = {
      getBoundingClientRect() {
        return {
          top: -top
        } as ClientRect
      }
    } as HTMLTableElement
    const event = new Event('scroll')
    window.dispatchEvent(event)
    cacheData = ins.cacheData
    cacheColumns = ins.cacheColumns
    expect(wrapper.state().top).toBe(top)
    ins.$tbody = $tbody
  })
  it('test cacheData after scroll', () => {
    expect(cacheData).toBe(ins.cacheData)
    expect(cacheColumns).toBe(ins.cacheColumns)
  })
  it('refresh cache after columns change', () => {
    const newColumns = [...columns]
    expect(newColumns).not.toBe(columns)
    wrapper.setProps({
      columns: [...columns]
    }, () => {
      expect(cacheData).not.toBe(ins.cacheData)
      expect(cacheColumns).not.toBe(ins.cacheColumns)
    })
  })
  it('should removeEffect after componentUnmount', () => {
    const spy = jest.spyOn(ins, 'scrollHandle')
    ins.addEffect()
    const event = new Event('scroll')
    window.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
    wrapper.unmount()
    window.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
  })
})
