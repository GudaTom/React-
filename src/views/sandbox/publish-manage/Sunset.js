import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePulish from '../../../components/publish-manage/usePublish'
import {Button} from 'antd'
export default function Sunset() {
  
  //3为已下线
  const {dataSource,handleDelete} = usePulish(3)
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id)=><Button danger
      onClick={()=>handleDelete(id)}>
        删除
      </Button>}></NewsPublish>
    </div>
  )
}
