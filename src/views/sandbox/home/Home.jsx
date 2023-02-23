import React, { useEffect, useState,useRef } from 'react'
import { Button,Form,Modal,Table,Input } from 'antd'
export default function Home() {
  const [isOpenmodal,setisOpenmodal]=useState(false)
  const [dataSource,setdataSource]=useState([])
  const formRef=useRef(null)
  useEffect(()=>{
    setdataSource(data)
  },[])
  const addData=()=>{
    setisOpenmodal(true)
  }
  // 添加用户成功回调
  const handleOk=()=>{
    console.log(formRef.current.getFieldValue());
    const data=formRef.current.getFieldValue()
    data.key=data.name
    setdataSource([...dataSource,data])
    setisOpenmodal(false)
  }
  const handleCancel=()=>{
    setisOpenmodal(false)
  }
  const data = [
          {
            key: '1',
          name: '胡彦斌',
          age: 32,
          address: '西湖区湖底公园1号',
      },
          {
            key: '2',
          name: '胡彦祖',
          age: 42,
          address: '西湖区湖底公园1号',
      },
    ];

    const columns = [
            {
              title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
            {
              title: '年龄',
            dataIndex: 'age',
            key: 'age',
        },
            {
              title: '住址',
            dataIndex: 'address',
            key: 'address',
        },
    ];

  return (
    <div>
      <Button type='primary' onClick={()=>addData()}>123</Button>
      
      <Table dataSource={dataSource} columns={columns} />;
      <Modal title="添加数据" open={isOpenmodal} onOk={handleOk} onCancel={handleCancel}>
      <Form
        layout="vertical"
        ref={formRef}
      >
          <Form.Item name="name" rules={[]} label='姓名'>
            <Input />
          </Form.Item>
          <Form.Item name="age" rules={[]} label='年龄'>
            <Input />
          </Form.Item>
          <Form.Item name="address" rules={[]} label='地址'>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
