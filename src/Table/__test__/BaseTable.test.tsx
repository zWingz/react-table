import * as React from 'react'
import { shallow, mount } from 'enzyme'
import BaseTable from '../BaseTable'
import BaseRow from '../BaseRow'
import { DataSource, TestDataType, Columns } from './fixtures'

const columns: TestDataType = [...Columns]

describe('test BaseTable render', () => {
  const wrapper = shallow(
    <BaseTable columns={columns} dataSource={DataSource} rowKey='id' />
  )
  it('test snapshot render', () => {
    expect(wrapper).toMatchSnapshot('baseTable snapshot')
  })
  it('test thead render', () => {
    const thead = wrapper.find('thead')
    expect(thead).toMatchSnapshot('thead snapshot')
    const th = thead.find('th')
    expect(th).toHaveLength(4)
    const ar = [0, 1, 3]
    ar.forEach(each => {
      expect(th.at(each).text()).toEqual(columns[each].title)
    })
    expect(th.at(2).html()).toEqual('<th><span>jsx title</span></th>')
  })
  it('test tbody render', () => {
    expect(wrapper.find(BaseRow)).toHaveLength(4)
  })
})

describe('test BaseTable props', () => {
  const className = 'custom-table',
    style = {
      marginTop: '10px',
      fontSize: '26px',
      padding: '10px 10px'
    }
  const wrapper = mount(
    <BaseTable
      className={className}
      style={style}
      columns={columns}
      dataSource={DataSource}
      rowKey='id'
    />
  )
  it('test classname', () => {
    expect(wrapper.find('table').hasClass('fixed-table')).toBeTruthy()
    expect(wrapper.hasClass('custom-table')).toBeTruthy()
  })
  it('test style', () => {
    expect(wrapper.find('table').props().style).toEqual(style)
  })
})

describe('test scroll', () => {
  it('test scroll top', () => {
    const wrapper = mount(
      <BaseTable
        maxTop={9999}
        columns={columns}
        dataSource={DataSource}
        rowKey='id'
      />
    )
    const ins = wrapper.instance() as BaseTable
    wrapper.update()
    ins.forceUpdate()
    ins.$content = {
      current: {
        getBoundingClientRect() {
          return {
            top: -top
          } as ClientRect
        }
      } as HTMLTableElement
    }
    let thead = wrapper.find('thead').getDOMNode() as any
    expect(thead.classList.contains('fixed')).toBeFalsy()
    const top = 105
    const event = new Event('scroll')
    window.dispatchEvent(event)
    expect(thead.classList.contains('fixed')).toBeTruthy()
    expect(thead.style._values).toMatchObject({
      transform: `translate3d(0px, ${top}px, 1px)`,
      'will-change': 'transform'
    })
  })
})

describe('test ref', () => {
  it('test ref', () => {
    const ref = {
      current: null
    }
    const wrapper = mount(
      <BaseTable
        getRef={ref as any}
        columns={columns}
        dataSource={DataSource}
        rowKey='id'
      />
    )
    const table = wrapper.getDOMNode()
    expect(ref.current).toBe(table)
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
    const wrapper = mount(
      <BaseTable columns={columns} dataSource={data} rowKey='chain.id' />
    )
    expect(
      wrapper
        .find(BaseRow)
        .at(0)
        .key()
    ).toEqual(DataSource[0].createTime)
  })
})

describe('test multiLine', () => {
  it('should add className table-multiLine', () => {
    const wrapper = mount(
      <BaseTable
        multiLine
        columns={columns}
        dataSource={DataSource}
        rowKey='id'
      />
    )
    expect(
      wrapper
        .find('table')
        .props()
        .className.includes('table-multiLine')
    ).toBeTruthy()
  })
})

describe('test effect', () => {
  it('add effect when mount', () => {
    const spyOn = jest.spyOn(BaseTable.prototype, 'addEffect')
    const wrapper = mount(
      <BaseTable
        multiLine
        columns={columns}
        dataSource={DataSource}
        rowKey='id'
      />
    )
    expect(spyOn).toBeCalledTimes(1)
  })
  it('remove effect when unmount', () => {
    const spyOn = jest.spyOn(BaseTable.prototype, 'removeEffect')
    const wrapper = mount(
      <BaseTable
        multiLine
        columns={columns}
        dataSource={DataSource}
        rowKey='id'
      />
    )
    wrapper.unmount()
    expect(spyOn).toBeCalledTimes(1)
  })
})
