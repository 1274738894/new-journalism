import { Table,Button,Modal,Tree } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function RoleList() {
  const {confirm}=Modal
  let [dataSource,setdataSource]=useState([])  
  let [modalOpen,setmodalOpen]=useState(false)
  let [treeData,settreeData]=useState([])
  let [currentRights,setcurrentRights]=useState([])
  let [currentId,setcurrentId]=useState([])

  useEffect(()=>{
    axios.get('/roles').then(res=>{
      setdataSource(res.data)
    })
  },[])
  useEffect(()=>{
    axios.get('/rights?_embed=children').then(res=>{
      settreeData(res.data)
    })
  },[])
  const columns = [
  {
    title:'ID',
    dataIndex:'id'
  },
  {
    title:'角色名称',
    dataIndex:'roleName'
  },
  {
    title:'操作',
    render:(item)=>
      <div>
        <Button danger shape='circle' icon={<DeleteOutlined />}
          onClick={()=>confirmMethod(item)}
        />
    
        <Button type='primary' shape='circle' icon={<EditOutlined />}
          onClick={()=>
           {
            setcurrentId(item.id)
            setmodalOpen(true)
            setcurrentRights(item.rights)
           }
          }
        ></Button>
      </div>
  }
  ];

  const confirmMethod=(item)=>{   //单击垃圾箱弹出确定框
    confirm({
      title: '你确定要删除?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        console.log('OK');
        dleteMethod(item)         //单击确定调用删除函数
        
      },
      onCancel() {},
    });
  }

  const dleteMethod=(item)=>{     //删除函数
    console.log(item);
    //当前页面同步状态 + 后端同步
      setdataSource(dataSource.filter(data=>data.id!==item.id))
      axios.delete(`/roles/${item.id}`)
  }
  const handleOk=()=>{
    console.log(currentRights);
    
    setdataSource(dataSource.map(item=>{
      if(item.id===currentId){
        return{
          ...item,
          rights:currentRights
        }
      }
      return item
    }))
    setmodalOpen(false)
    axios.patch(`/roles/${currentId}`,{
      rights:currentRights
    })
  }
  const onCheck = (checkedKeys, info) => {  //树形控件选择功能
    setcurrentRights(checkedKeys)
  };
  return (
    <>
      <Table dataSource={dataSource} columns={columns} rowKey={item=>item.id}/>
      <Modal title="Basic Modal" open={modalOpen} onOk={() => handleOk()} onCancel={() => setmodalOpen(false)}>
        <Tree
          checkStrictly
          checkable
          checkedKeys={currentRights}
          onCheck={onCheck}
          treeData={treeData}
        />
      </Modal>
    </>
  )
}
