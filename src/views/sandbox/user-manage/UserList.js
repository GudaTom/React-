import React, { useState,useEffect, useRef } from 'react'
import {Button, Table, Modal, Switch} from 'antd'
import axios from 'axios'
import {DeleteOutlined,EditOutlined,ExclamationCircleOutlined} from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm'
const {confirm} = Modal
export default function UserList() {
  const [dataSource, setdataSource]=  useState([])
  const [isAddVisible, setIsAddVisible]=  useState(false)
  const [isUpdateVisible, setIsUpdateVisible]=  useState(false)
  const [roleList, setRoleList]=  useState([])
  const [regionList, setRegionList]=  useState([])
  const [current, setcurrent] = useState(null)

  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
  const addForm = useRef(null)
  const updateForm = useRef(null)

  const {roleId,region,username} = JSON.parse(localStorage.getItem("token"))
  
  useEffect(()=>{
    const roleObj = {
      "1":"superadmin",
      "2":"admin",
      "3":"editor"
  }
    axios.get("/users?_expand=role").then(res=>{
    const list = res.data;
    setdataSource(roleObj[roleId]==="superadmin"?list:[
      ...list.filter(item=>item.username===username),
      ...list.filter(item=>item.region===region&&roleObj[item.roleId]==="editor")  
    ]);
    })
  },[roleId,region,username])

  useEffect(()=>{
    axios.get("/regions").then(res=>{
    const list = res.data;
    setRegionList(list);
    })
  },[])

  useEffect(()=>{
    axios.get("/roles").then(res=>{
    const list = res.data;
    setRoleList(list);
    })
  },[])

  //改变用户状态
  const handleChange = (item)=>{
    item.roleState=!item.roleState
    setdataSource([...dataSource])
    axios.patch(`/users/${item.id}`,{
      roleState:item.roleState
    })
  }

  //更新信息
  const handleUpdate = (item)=>{
    setTimeout(()=>{
      setIsUpdateVisible(true)
      if(item.roleId===1){
        //禁用
        setIsUpdateDisabled(true)
      }else{
        //取消禁用
        setIsUpdateDisabled(false)
      }
      updateForm.current.setFieldsValue(item)
    },0)
    setcurrent(item)
  }

  //更新updateform方法
  const updateFormOK = ()=>{
    updateForm.current.validateFields().then(value=>{
      setIsUpdateVisible(false)
      setdataSource(dataSource.map(item=>{
        if(item.id===current.id)
        {
          return{
            ...item,
            ...value,
            role:roleList.filter(data=>data.id===value.roleId)[0]
          }
        }
        return item
      }))
      setIsUpdateDisabled(!isUpdateDisabled)
      axios.patch(`/users/${current.id}`,value)
    })
  }
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters:[
        ...regionList.map(item=>({
          text:item.title,
          value:item.value
        })),
        {
          text:"全球",
          value:"全球"
        }
      ],
      onFilter:(value,item)=>{
        if(value==="全球"){
          return item.region===""
        }
        return item.region===value
      },
      render:(region)=>{
        return <b>{region===""?'全球':region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render:(role)=>{
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render:(roleState,item)=>{
        return<Switch checked={roleState} disabled={item.default}
        onChange={()=>{handleChange(item)}}></Switch>
      }
    },
    {
      title: '操作',
      render:(item)=>{
        return <div>
            <Button danger shape="circle" 
            icon={<DeleteOutlined />} onClick={()=>confirmMethod(item)} 
            disabled={item.default}/>

            <Button type="primary" shape="circle" 
            icon={<EditOutlined />} disabled={item.default}
            onClick={()=>handleUpdate(item)}/>
            </div>
      }
    },
  ];

  const confirmMethod = (item)=>{
    confirm({
      title: '你确定要删除？',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        deleteMethod(item);
      },
      onCancel() {
      },
    });
  }

  //删除
  const deleteMethod = (item)=>{
    //当前页面同步状态 + 后端同步
    setdataSource(dataSource.filter(data=>data.id!==item.id))
    axios.delete(`/users/${item.id}`)
  }

  //校验表单
  const addFormOK = ()=>{
    addForm.current.validateFields().then(value=>{
      setIsAddVisible(false)
      //清空表单内容
      addForm.current.resetFields();
      //先post到后端生成ID，再设置dataSource，方便后面的删除和更新
      axios.post(`/users`,{
        ...value,
        "roleState": true,
        "default": false
      }).then(res=>{
        console.log(res.data)
        setdataSource([...dataSource,{
          ...res.data,
          role:roleList.filter(item=>item.id===value.roleId)[0]
        }])
      })
    }).catch(err=>{
      console.log(err)
    })
  }

  return (
    <div>
      <Button type="primary" onClick={()=>{
        setIsAddVisible(true)
      }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns}
      pagination={{
        pageSize:5
      }} 
      rowKey={item=>item.id}/>

      <Modal
      visible={isAddVisible}
      title="添加用户"
      okText="确定"
      cancelText="取消"
      onCancel={()=>{
        setIsAddVisible(false)
      }}
      onOk={() => addFormOK()}
    >
      <UserForm regionList={regionList} roleList={roleList} ref={addForm}/>
    </Modal>

    <Modal
      visible={isUpdateVisible}
      title="更新用户"
      okText="更新"
      cancelText="取消"
      onCancel={()=>{
        setIsUpdateVisible(false)
        setIsUpdateDisabled(!isUpdateDisabled)
      }}
      onOk={() => updateFormOK()}
    >
      <UserForm regionList={regionList} roleList={roleList} 
      ref={updateForm} isUpdateDisabled={isUpdateDisabled}/>
    </Modal>
    </div>
  )
}
