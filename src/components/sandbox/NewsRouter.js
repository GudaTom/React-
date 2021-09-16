import React, { useEffect,useState } from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import { Spin } from 'antd'
import axios from 'axios'
import { connect } from 'react-redux'
import Home from '../../views/sandbox/home/Home'
import NoPermission from '../../views/sandbox/nopermission/NoPermission'
import RightList from '../../views/sandbox/right-manage/RightList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import UserList from '../../views/sandbox/user-manage/UserList'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'

const LocalRouterMap = {
  "/home":Home,
  "/user-manage/list":UserList,
  "/right-manage/role/list":RoleList,
  "/right-manage/right/list":RightList,
  "/news-manage/add":NewsAdd,
  "/news-manage/draft":NewsDraft,
  "/news-manage/category":NewsCategory,
  "/news-manage/preview/:id":NewsPreview,
  "/news-manage/update/:id":NewsUpdate,
  "/audit-manage/audit":Audit,
  "/audit-manage/list":AuditList,
  "/publish-manage/unpublished":Unpublished,
  "/publish-manage/published":Published,
  "/publish-manage/sunset":Sunset
}

function NewsRouter(props) {
  const [backRouteList, setBackRouteList] = useState([])
  //取得路由列表
  useEffect(()=>{
    Promise.all([
      axios.get("/rights"),
      axios.get("/children"),
    ]).then(res=>{
      // console.log([...res[0].data,...res[1].data])
      setBackRouteList([...res[0].data,...res[1].data])
    })
  },[])
  
  const {role:{rights,id}} = JSON.parse(localStorage.getItem("token"))

  const checkRoute = (item)=>{
    return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
  }
  const checkUserPermission = (item)=>{
    return id===1?rights.checked.includes(item.key)
    :rights.includes(item.key)
  }

  return (
    <Spin size="large" spinning={props.isLoading}>
      <Switch>
        {
          backRouteList.map(item=>
            {
              if(checkRoute(item) && checkUserPermission(item)){
                return <Route path={item.key} key={item.key} 
                component={LocalRouterMap[item.key]} exact/>
              }
              return null
            }
          )
        }
        <Redirect from="/" to="/home" exact/>
        {
          backRouteList.length>0 &&<Route path="*" component={NoPermission} />
        }
      </Switch>
    </Spin>
  )
}

const mapStateToProps = ({LoadingReducer:{isLoading}})=>({
    isLoading
})

export default connect(mapStateToProps)(NewsRouter)