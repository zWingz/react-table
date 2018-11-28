import * as React from 'react'
import { shallow } from 'enzyme'
import BaseTable from '../BaseTable'
import BaseRow from '../BaseRow'
import { ColumnProps } from '../module'
import {default as dataSource} from './DataSource'

// const dataSource = [
//   {
//     'id': '440000200106140115',
//     'createTime': '1976-04-02',
//     'name': '尹娟',
//     'title': '目派与响清'
//   },
//   {
//     'id': '130000199202167395',
//     'createTime': '1978-12-17',
//     'name': '程丽',
//     'title': '无北共外'
//   },
//   {
//     'id': '640000197411167747',
//     'createTime': '2012-12-06',
//     'name': '何桂英',
//     'title': '周切程'
//   },
//   {
//     'id': '440000197608270476',
//     'createTime': '1990-07-18',
//     'name': '黄杰',
//     'title': '一和下'
//   }
// ]
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

describe('test BaseTable render', () => {
  const wrapper = shallow(<BaseTable columns={columns} dataSource={dataSource} rowKey='id'/>)
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
  const wrapper = shallow(<BaseTable top={top} className={className} style={style} columns={columns} dataSource={dataSource} rowKey='id'/>)
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

// describe('test ref', () => {
//   it('test ref', () => {
//     const ref = jest.fn()
//     const wrapper = mount(<BaseTable getRef={ref} columns={columns} dataSource={dataSource} rowKey='id'/>)
//     expect(ref).toBeCalledTimes(1)
//   })
// })
