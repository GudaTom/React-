import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePulish from '../../../components/publish-manage/usePublish'
import {Button} from 'antd'
export default function Unpublished() {

  //1为待发布
  const {dataSource,handlePublish} = usePulish(1)
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id)=><Button
      type="primary" onClick={()=>handlePublish(id)}>
        发布
      </Button>}></NewsPublish>
    </div>
  )
}
