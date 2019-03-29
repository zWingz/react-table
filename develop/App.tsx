import React from 'react'
import { hot } from 'react-hot-loader'
import './style'
import { Table } from '../src'
import { mock } from 'mockjs'

declare const module: any

const App = hot(module)(() => {
  const fieldKey = []
  const fieldCount = 10
  let i = 0
  for (; i < fieldCount; i++) {
    fieldKey.push('field' + i)
  }
  const columns: any[] = fieldKey.map((each, idx) => ({
    title: each,
    dataIndex: each,
    render: idx === 2 ? (t) => {
      return <>
        <div>multiLine:</div>
        <div>{t}</div>
      </>
    }: undefined,
    fixed: idx === 0 ? 'left' : idx === fieldCount - 1 ? 'right' : false
  }))
  const mockJson = fieldKey.reduce((json, each) => {
    json[each] = '@sentence(2,3)'
    return json
  }, {})

  const mockData = mock({
    'list|50': [mockJson]
  })
  const dataSource = mock(mockData).list
  return (
    <div>
      <div className='container'>
        <Table columns={columns} offsetTop={10} dataSource={dataSource} rowKey='field1' multiLine/>
      </div>
    </div>
  )
})

export default App
