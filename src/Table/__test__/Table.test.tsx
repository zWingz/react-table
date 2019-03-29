import * as React from 'react'
import { shallow, mount, ReactWrapper } from 'enzyme'
import { Table, BaseTable } from '..'
import Scrollbar from '../../HorizontalScrollBar'
// import { default as DataSource } from './fixtures/DataSource'
import { TestDataType, DataSource, Columns, ColumnsNoFixed } from './fixtures'
import { TableProp } from '../module'
describe('test table', () => {
  // const columns: TestDataType = [...Columns]
  it('base render', () => {
    const wrapper = shallow<TableProp, any>(
      <Table dataSource={DataSource} columns={ColumnsNoFixed} rowKey='id' />
    )
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find(BaseTable)).toHaveLength(1)
    expect(wrapper.find(Scrollbar)).toHaveLength(1)
    expect(wrapper.find('#fixed-table-magic')).toHaveLength(1)
    const ins = wrapper.instance() as Table
    expect(ins.fixedLeft).toBeFalsy()
    expect(ins.fixedRight).toBeFalsy()
    expect(ins.cacheColumns).toEqual(ColumnsNoFixed)
  })
})

describe('test fixed render', () => {
  const columns: TestDataType = [...Columns]
  const wrapper = shallow<TableProp, any>(
    <Table dataSource={DataSource} columns={columns} rowKey='id' />
  )
  it('it should have three BaseTable', () => {
    expect(wrapper.find(BaseTable)).toHaveLength(3)
  })
  it('fixed table should have right className', () => {
    const left = wrapper.find(BaseTable).at(1)
    const right = wrapper.find(BaseTable).at(2)
    expect(left.props().className).toEqual(
      'fixed-table_fixed fixed-table_fixed-left'
    )
    expect(right.props().className).toEqual(
      'fixed-table_fixed fixed-table_fixed-right'
    )
  })

  it('test hoverClass', () => {
    const mountWrapper = mount(
      <Table dataSource={DataSource} columns={columns} rowKey='id' />
    )
    const tables = mountWrapper.find(BaseTable)
    const body = tables.at(0)
    const left = tables.at(1)
    const right = tables.at(2)
    const container = mountWrapper.find('.fixed-table-container')
    const trIndex = 2
    const target = left
      .find('tbody tr')
      .at(trIndex)
      .getDOMNode()
    container.simulate('mouseover', {
      target
    })
    // console.log(getClassList(body))
    function getClassList(wrap: ReactWrapper) {
      return wrap
        .find('tbody tr')
        .at(trIndex)
        .getDOMNode().classList
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

describe('test cache', () => {
  const columns: TestDataType = [...ColumnsNoFixed]
  const wrapper = mount<TableProp, any>(
    <Table dataSource={DataSource} columns={columns} rowKey='id' />
  )
  const ins = wrapper.instance() as Table
  let cacheData = null,
    cacheColumns = null
  cacheData = ins.cacheData
  cacheColumns = ins.cacheColumns

  it('refresh cache after columns change', () => {
    const newColumns = [...columns]
    expect(newColumns).not.toBe(columns)
    wrapper.setProps(
      {
        columns: [...columns]
      },
      () => {
        expect(cacheData).not.toBe(ins.cacheData)
        expect(cacheColumns).not.toBe(ins.cacheColumns)
      }
    )
  })
})

describe('test multiline', () => {
  const columns: TestDataType = [...Columns]
  it('should not calc height when multiline=false', () => {
    const wrapper = mount<Table>(
      <Table dataSource={DataSource} columns={columns} rowKey='id' />
    )
    expect(wrapper.instance().$tbody.current).toBeTruthy()
    expect(wrapper.find('tbody tr')).toHaveLength(12)
    expect(wrapper.state().rowsHeight).toHaveLength(0)
  })
  it('calc height', () => {
    const wrapper = mount<Table>(
      <Table dataSource={DataSource} columns={columns} multiLine rowKey='id' />
    )
    expect(wrapper.state().rowsHeight).toHaveLength(4)
  })
  it('exec getHeight and set maxTop when props changed', () => {
    const spyGetHeight = jest.spyOn(Table.prototype, 'getHeight')
    const wrapper = mount<Table>(
      <Table dataSource={DataSource} columns={columns} multiLine rowKey='id' />
    )
    const height = 1000
    const theadHeight = 36
    expect(spyGetHeight).toBeCalledTimes(1)
    const ins = wrapper.instance()
    ins.$tbody = {
      current: {
        getBoundingClientRect() {
          return {
            height
          } as ClientRect
        },
        querySelectorAll(selectors) {
          return [] as any
        },
        querySelector(selectors) {
          if (selectors === 'thead tr') {
            return {
              clientHeight: theadHeight
            }
          }
        }
      } as HTMLTableElement
    }
    const max = height - theadHeight
    wrapper.setProps({
      columns: [...columns]
    })
    expect(ins.state.maxTop).toBe(max)
    expect(spyGetHeight).toBeCalledTimes(2)
  })
})
