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
      <div className='container' style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Table columns={columns} dataSource={dataSource} rowKey='field1' />
      </div>
    </div>
  )
})

export default App
