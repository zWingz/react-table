import * as React from 'react'
import { shallow, mount } from 'enzyme'
import BaseTable from '../BaseTable'
import BaseRow from '../BaseRow'
import {DataSource, TestDataType, Columns} from './fixtures'

const columns: TestDataType = [...Columns]

describe('test BaseTable render', () => {
  const wrapper = shallow(<BaseTable columns={columns} dataSource={DataSource} rowKey='id'/>)
  it('test snapshot render', () => {
    // expect(wrapper.find(BaseRow)).toHaveLength(dataSource.length)
    expect(wrapper).toMatchSnapshot('baseTable snapshot')
  })
  it('test thead render', () => {
    const thead = wrapper.find('thead')
    expect(thead).toMatchSnapshot('thead snapshot')
    const th = thead.find('th')
    expect(th).toHaveLength(4)
    const ar = [0, 1, 3]
    ar.forEach((each) => {
      expect(th.at(each).text()).toEqual(columns[each].title)
    })
    expect(th.at(2).html()).toEqual('<th><span>jsx title</span></th>')
  })
  it('test tbody render', () => {
    expect(wrapper.find(BaseRow)).toHaveLength(4)
  })
})

describe('test BaseTable props', () => {
  let top = 0
  const className = 'custom-table', style = {
    marginTop: '10px',
    fontSize: '26px',
    padding: '10px 10px'
  }
  const wrapper = shallow(<BaseTable top={top} className={className} style={style} columns={columns} dataSource={DataSource} rowKey='id'/>)
  it('test classname', () => {
    expect(wrapper.hasClass('custom-table')).toBeTruthy()
    expect(wrapper.hasClass('fixed-table')).toBeTruthy()
  })
  it('test style', () => {
    expect(wrapper.find('table').props().style).toEqual(style)
  })
  it('test top', () => {
    let thead = wrapper.find('thead')
    expect(thead.hasClass('fixed')).toBeFalsy()
    top = 100
    wrapper.setProps({top: 100})
    thead = wrapper.find('thead')
    expect(thead.hasClass('fixed')).toBeTruthy()
    expect(thead.props().style.transform).toEqual(`translate3d(0px, ${top}px, 1px)`)
  })
})

// test later
// because enzyme not support React.memo

describe('test ref', () => {
  it('test ref', () => {
    const ref = jest.fn(val => val)
    const wrapper = mount(<BaseTable getRef={ref} columns={columns} dataSource={DataSource} rowKey='id'/>)
    expect(ref).toBeCalledTimes(1)
    const table = wrapper.getDOMNode()
    expect(ref.mock.calls[0][0]).toBe(table)
  })
})

describe('test chain key', () => {
  it('should get key from chainObject', () => {
    const data = DataSource.map(each => ({
      ...each,
      chain: {
        id: each.createTime
      }
    }))
    const wrapper = mount(<BaseTable columns={columns} dataSource={data} rowKey='chain.id'/>)
    expect(wrapper.find(BaseRow).at(0).key()).toEqual(DataSource[0].createTime)
  })
})

describe('test multiLine', () => {
  it('should add className table-multiLine', () => {
    const wrapper = mount(<BaseTable multiLine columns={columns} dataSource={DataSource} rowKey='id'/>)
    expect(wrapper.find('table').props().className.includes('table-multiLine')).toBeTruthy()
  })
})
