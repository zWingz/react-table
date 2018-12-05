import * as React from 'react'
import { Table, BaseTable } from '../Table'
import ScrollBar from '../HorizontalScrollBar'
import { mount } from 'enzyme'
import {
  Table as IndexTable,
  BaseTable as IndexBaseTable,
  HorizontalScrollBar as IndexHorizontalScrollBar
} from '..'
import { timerFnc, addResizeEventListener } from '../utils'
describe('test export', () => {
  it('test Table export', () => {
    expect(Table).toBe(IndexTable)
  })
  it('test BaseTable export', () => {
    expect(BaseTable).toBe(IndexBaseTable)
  })
  it('test ScrollBar export', () => {
    expect(ScrollBar).toBe(IndexHorizontalScrollBar)
  })
})

describe('test utils', () => {
  it('test fnc delay', done => {
    const mockFnc = jest.fn()
    const timer = timerFnc(mockFnc, 500)
    expect(timer).toBeInstanceOf(Function)
    timer()
    timer()
    timer()
    timer()
    expect(mockFnc).toBeCalledTimes(0)
    setTimeout(() => {
      expect(mockFnc).toBeCalledTimes(1)
      done()
    }, 560)
  })
})

describe('test addResizeEventListener', () => {
  const wrapper = mount(<div style={{width: '100px', height: '100px', position: 'relative'}}>
    test
  </div>)
  const fn = jest.fn()
  let obj: HTMLObjectElement
  const div = wrapper.find('div').getDOMNode() as HTMLDivElement
  it('append an object as children', () => {
    obj = addResizeEventListener(div, fn)
    expect(div.lastChild).toBe(obj)
  })
})
