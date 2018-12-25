import { ColumnProps } from '../../module'
const DataSource = [
  {
    'id': '440000200106140115',
    'createTime': '1976-04-02',
    'name': '尹娟',
    'title': '目派与响清'
  },
  {
    'id': '130000199202167395',
    'createTime': '1978-12-17',
    'name': '程丽',
    'title': '无北共外'
  },
  {
    'id': '640000197411167747',
    'createTime': '2012-12-06',
    'name': '何桂英',
    'title': '周切程'
  },
  {
    'id': '440000197608270476',
    'createTime': '1990-07-18',
    'name': '黄杰',
    'title': '一和下'
  }
]
export type TestDataType = ColumnProps<typeof DataSource[0]>[]
export {DataSource}
