import { Table,Button,Modal,Tree } from 'antd'
import React, { useState,useEffect } from 'react'
import axios from 'axios'
import {DeleteOutlined,EditOutlined,ExclamationCircleOutlined} from '@ant-design/icons'
const {confirm} = Modal
export default function RoleList() {
  const [dataSource,setdataSource] = useState([])
  const [rightList,setRightList] = useState([])
  const [currentRights,setCurrentRights] = useState([])
  const [currentId,setCurrentId] = useState([])
  const [isModalVisible, setisModalVisible] = useState(false)
  const column = [
    {
      title: 'ID',
      dataIndex: 'id',
      render:(id)=>{
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: '操作',
      render:(item)=>{
        return <div>
            <Button danger shape="circle" 
            icon={<DeleteOutlined />} onClick={()=>confirmMethod(item)} />
            <Button type="primary" shape="circle" 
            icon={<EditOutlined />} onClick={()=>{
              setisModalVisible(true)
              setCurrentRights(item.rights)
              setCurrentId(item.id)
            }}/>
        </div>
      }
    }
  ]
  //获取表格内容
  useEffect(()=>{
    axios.get("/roles").then(res=>{
      setdataSource(res.data)
    })
  },[])
  //获取弹窗内容
  useEffect(()=>{
    axios.get("/rights?_embed=children").then(res=>{
      setRightList(res.data)
    })
  },[])

  const confirmMethod = (item)=>{
    confirm({
      title: '你确定要删除？',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        // console.log('OK');
        deleteMethod(item);
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }

  const deleteMethod = (item)=>{
    //当前页面同步状态 + 后端同步
      setdataSource(dataSource.filter(data=>data.id !==item.id))
      axios.delete(`/roles/${item.id}`)
  }

  const handleOk = ()=>{
    setisModalVisible(false)
    setdataSource(dataSource.map(item=>{
      if(item.id===currentId){
        return {
          ...item,
          rights:currentRights
        }
      }
      return item
    }))
    //patch
    axios.patch(`/roles/${currentId}`,{
      rights:currentRights
    })
  }

  const handleCancel = ()=>{
    setisModalVisible(false);
  }
  const onCheck = (checkKeys)=>{
    setCurrentRights(checkKeys)
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={column}
      rowKey={(item)=>item.id}></Table>

      <Modal title="权限分配" visible={isModalVisible} 
      onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkedKeys={currentRights}
          defaultSelectedKeys={dataSource[2]?.rights}
          onCheck={onCheck}
          checkStrictly = {true}
          treeData={rightList}
        />
      </Modal>
    </div>
  )
}
