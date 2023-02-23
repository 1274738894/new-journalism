import React, { forwardRef, useEffect, useState } from 'react'
import { Input, Form, Select } from 'antd'
import Password from 'antd/lib/input/Password'
const UserForm=forwardRef((props,ref)=>{
  const [isdisabled,setisdisabled]=useState(false)
  useEffect(()=>{
    setisdisabled(props.isUpdataDisabled)
  },[props.isUpdataDisabled])

  const {roleId,region}=JSON.parse(localStorage.getItem('token'))
  return (
    <Form layout='vertical' ref={ref} initialValues={{roldId:'区域管理员'}}>
          <Form.Item name='username' label='姓名'   rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input/>
          </Form.Item>
          <Form.Item name='password' label='密码'   rules={[{ required: true, message: 'Please input your username!' }]}>
            <Password/>
          </Form.Item>
          <Form.Item  name='region' label='区域'   rules={isdisabled?[]:[{ required: true, message: 'Please input your username!' }]}>
          <Select
                options={
                  props.regionList.map(item=>{
                    return{
                      value:item.value,
                      disabled:roleId!==1 && region!==item.value
                    }
                  })
                }
                disabled={isdisabled}
              />
          </Form.Item>
          <Form.Item name='roleId' label='角色'   rules={[{ required: true, message: 'Please input your username!' }]}>
          <Select
                  onChange={(value)=>{
                    if(value===1){
                      setisdisabled(true)
                      ref.current.setFieldsValue({  //此方法用来设置区域为空
                        region:''
                      })
                    }else{
                      setisdisabled(false)
                    }
                  }}
                options={props.roleList.map(item=>{
                  return {
                      value: item.id,
                      label: item.roleName,
                      disabled:roleId===1?false:item.roleType!==3

                  }
                })}
              />
          </Form.Item>
    </Form>
  )
})
export default UserForm
