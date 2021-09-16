import React,{useEffect, useState} from 'react'
import {Layout,Menu} from 'antd'
import './index.css'
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import {
  UserOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux'

const { Sider } = Layout;
const {SubMenu} = Menu

//模拟数组结构
// const menuList = [
//   {
//     key:"/home",
//     title:"首页",
//     icon:<UserOutlined/>
//   },
//   {
//     key:"/user-manage",
//     title:"用户管理",
//     icon:<UserOutlined/>,
//     children:[
//       {
//         key:"/user-manage/list",
//         title:"用户列表",
//         icon:<UserOutlined/>
//       }
//     ]
//   },
//   {
//     key:"/right-manage",
//     title:"权限管理",
//     icon:<UserOutlined/>,
//     children:[
//       {
//         key:"/right-manage/role/list",
//         title:"角色列表",
//         icon:<UserOutlined/>
//       },
//       {
//         key:"/right-manage/right/list",
//         title:"权限列表",
//         icon:<UserOutlined/>
//       }
//     ]
//   }
// ]
const iconList = {
  "/home":<UserOutlined/>,
  "/user-manage/list":<UserAddOutlined/>,
  "/right-manage/role/list":<UserOutlined/>,
  "/right-manage/right/list":<UserOutlined/>
}

function SideMenu(props) {

  const [menu,setMenu] = useState([])

  useEffect(() => {
    axios.get("/rights?_embed=children").then(res=>{
      setMenu(res.data);
    })
  },[])

  const {role:{rights,id}} = JSON.parse(localStorage.getItem("token"))
  const checkPermisson = (item)=>{
    return item.pagepermisson && (id===1?rights.checked.includes(item.key)
    :rights.includes(item.key))
  }

  const renderMenu = (menuList) =>{
    return menuList.map(item=>{
      if(item.children?.length>0 && checkPermisson(item)){
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
          {renderMenu(item.children)}
        </SubMenu>
      }
      return checkPermisson(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={()=>{
        props.history.push(item.key)
      }}>{item.title}</Menu.Item>
    })
  }
  const selectKeys = props.location.pathname;
  const openKeys = ["/"+props.location.pathname.split("/")[1]];

  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed} >
      <div style={{display:"flex",height:"100%","flexDirection":"column"}}>
        <div className="logo" >全球新闻发布管理系统</div>
        <div style={{flex:1,"overflow":"auto"}}>
          <Menu theme="dark" mode="inline" selectedKeys={selectKeys} className="aaaaa" defaultOpenKeys={openKeys}>
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}
const mapStateToProps = ({CollApsedReducer:{isCollapsed}})=>{
  return {
    isCollapsed
  }
  
}
export default connect(mapStateToProps)(withRouter(SideMenu))