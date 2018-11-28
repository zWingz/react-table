import * as React from 'react'
import * as Enzyme from 'enzyme'
import { shallow } from 'enzyme'
import BaseRow, { getChainObject } from '../BaseRow'
import { ColumnProps } from '../module'

const unwrapMemo = (
  node: React.ReactElement<any>,
  options?: Enzyme.ShallowRendererProps
) => {
  const Tag = (node.type as any).type
  return shallow(<Tag {...node.props} />, options)
}
describe('test getChainObject', () => {
  it('test chain path', () => {
    const obj = {
      a: {
        b: {
          c: 1
        }
      },
      d: 1
    }
    expect(getChainObject(obj, 'd')).toEqual(1)
    expect(getChainObject(obj, 'a.b')).toEqual({c: 1})
    expect(getChainObject(obj, 'a.b.c')).toEqual(1)
    expect(getChainObject(obj, 'a.c.c')).toEqual(undefined)
  })
})

describe('test BaseRow', () => {
  describe('test render', () => {
    const record = {
      id: 'id1',
      user: {
        name: 'zwing'
      },
      customRender: 'render zwing'
    }
    type TestDataType = ColumnProps<typeof record>[]
    const baseColumns: TestDataType = [{
      title: 'id',
      dataIndex: 'id'
    }]
    it('test dataIndex', () => {
      const wrapper = unwrapMemo(<BaseRow columns={baseColumns} record={record} rowIndex={0}/>)
      expect(wrapper.find('td')).toHaveLength(1)
      expect(wrapper.find('td').text()).toEqual(record.id)
    })
    it('test chain dataIndex', () => {
      const columns: TestDataType = [...baseColumns, {
        title: 'name',
        dataIndex: 'user.name'
      }]
      const indx = 0
      const wrapper = unwrapMemo(<BaseRow columns={columns} record={record} rowIndex={indx}/>)
      expect(wrapper.find('td')).toHaveLength(2)
      expect(wrapper.find('td').at(1).text()).toEqual(record.user.name)
    })
    it('test custom render', () => {
      const render = jest.fn()
      const click = jest.fn()
      render.mockReturnValue(<div className='custom-render' onClick={click}>custom-render-text</div>)
      // console.log(render())
      const columns: TestDataType = [...baseColumns, {
        title: 'customRender',
        render,
        key: 'row-key'
      }]
      const indx = 1
      const wrapper = unwrapMemo(<BaseRow columns={columns} record={record} rowIndex={indx}/>)
      expect(wrapper.find('td')).toHaveLength(2)
      expect(render).toBeCalledTimes(1)
      expect(render).toBeCalledWith(null, record, indx)
      expect(wrapper.find('td').at(1).text()).toEqual('custom-render-text')
      wrapper.find('.custom-render').simulate('click')
      expect(click).toBeCalledTimes(1)
    })
    it('test row key', () => {
      const columns: TestDataType = [...baseColumns, {
        title: 'customRender',
        render: () => 'customRender',
        key: 'row-key'
      }, {
        title: 'filed',
        render: () => 'test'
      }]
      const indx = 1
      const wrapper = unwrapMemo(<BaseRow columns={columns} record={record} rowIndex={indx}/>)
      expect(wrapper.find('td')).toHaveLength(3)
      expect(wrapper.find('td').at(0).key()).toEqual('id')
      expect(wrapper.find('td').at(1).key()).toEqual('row-key')
      expect(wrapper.find('td').at(2).key()).toEqual('2')
    })
    it('test align', () => {
      const columns: TestDataType = [{
        title: '',
        dataIndex: 'id',
        align: 'right'
      }]
      const wrapper = unwrapMemo(<BaseRow columns={columns} record={record} rowIndex={0}/>)
      expect(wrapper.find('td').props().style.textAlign).toEqual('right')
    })
    it('test onRow return object', () => {
      const onRow = jest.fn()
      const click = jest.fn()
      const onRowReturn = {
        className: 'onRow-className',
        onClick: click
      }
      onRow.mockReturnValue(onRowReturn)
      const wrapper = unwrapMemo(<BaseRow onRow={onRow} columns={baseColumns} record={record} rowIndex={0}/>)
      expect(onRow).toBeCalledTimes(1)
      const tr = wrapper.find('tr')
      expect(tr.props()).toMatchObject(onRowReturn)
      tr.simulate('click')
      expect(click).toBeCalledTimes(1)
    })
    it('test onRow return Falsy', () => {
      const onRow = jest.fn()
      onRow.mockReturnValue(undefined)
      const wrapper = unwrapMemo(<BaseRow onRow={onRow} columns={baseColumns} record={record} rowIndex={0}/>)
      expect(onRow).toBeCalledTimes(1)
      const tr = wrapper.find('tr')
      expect(tr.props()).toMatchObject({
        children: {}
      })
    })
  })
})
