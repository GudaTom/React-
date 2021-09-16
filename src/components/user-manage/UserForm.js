import React, { forwardRef, useState, useEffect } from 'react'
import {Form, Input, Select} from 'antd'
const {Option} = Select
const UserForm = forwardRef((props,ref) => {
  const [isDisabled,setIsDisabled] = useState(false)

  useEffect(() => {
      setIsDisabled(props.isUpdateDisabled)
  }, [props.isUpdateDisabled])

  const {roleId,region} = JSON.parse(localStorage.getItem("token"))
  const roleObj = {
    "1":"superadmin",
    "2":"admin",
    "3":"editor"
}
  const chekRegionDisabled = (item)=>{
    if(props.isUpdate){
        if(roleObj[roleId]==="superadmin"){
          return false
        }else{
          return true
        }
    }else{
      if(roleObj[roleId]==="superadmin"){
        return false
      }else{
        return item.value!==region
      }
    }
  }
  const chekRoleDisabled = (item)=>{
    if(props.isUpdate){
      if(roleObj[roleId]==="superadmin"){
        return false
      }else{
        return true
      }
  }else{
    if(roleObj[roleId]==="superadmin"){
      return false
    }else{
      return roleObj[item.id]!=="editor" 
    }
  }
  }
  return (
    <Form
      ref={ref}
    >
        <Form.Item
          name="username"
          label="用户名 "
          rules={[{ required: true, 
            message: 'Please input the title of collection!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码 "
          rules={[{ required: true, 
            message: 'Please input the title of collection!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="region"
          label="地区 "
          rules={isDisabled?[]:[{ required: true, 
            message: 'Please input the title of collection!' }]}
        >
          <Select disabled={isDisabled}>
            {
              props.regionList.map(item=>
                <Option value={item.value} key={item.id}
                disabled={chekRegionDisabled(item)}>{item.title}</Option>
              )
            }
          </Select>
        </Form.Item>

        <Form.Item
          name="roleId"
          label="角色 "
          rules={[{ required: true, 
            message: 'Please input the title of collection!' }]}
        >
          <Select onChange={(value)=>{
            if(value===1){
              setIsDisabled(true)
              ref.current.setFieldsValue({
                region:""
              })
            }else{
              setIsDisabled(false)
            }
              
          }}>
            {
              props.roleList.map(item=>
                <Option value={item.id} key={item.id}
                disabled={chekRoleDisabled(item)}>{item.roleName}</Option>
              )
            }
          </Select>
        </Form.Item>
      </Form>
  )
})
export default UserForm