import { Button, Table, Tag,Modal, Popover,Switch } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
const {confirm}=Modal
export default function RightList() {
  const [dataSource,setdataSource]=useState([])
  useEffect(()=>{
    axios.get('/rights?_embed=children')
    .then(res=>{
      const list = res.data
      list.forEach(element => {
        if(element.children.length===0){
          element.children = ''
        }
      });
      setdataSource(list)
    })
  },[])
  
  const columns=[
    {
      title:'ID',
      dataIndex:'id',
      render:(id)=>
        <b>{id}</b>
      
    },
    {
      title:'权限名称',
      dataIndex:'title',
      
    },
    {
      title:'权限路径',
      dataIndex:'key',
      render:(key)=>
        <Tag color='blue'>{key}</Tag>
    },
    {
      title:'操作',
      render:(item)=>
        <div>
          <Button danger shape='circle' icon={<DeleteOutlined />}
            onClick={()=>confirmMethod(item)}
          />
          <Popover            //编辑按钮
            content={<div><Switch checked={item.pagepermisson===1?true:false} onChange={()=>switchMethod(item)} ></Switch></div>} 
            title='页面配置项' 
            trigger={item.pagepermisson===undefined?'':'click'}
            
          >
            <Button type='primary'  disabled={item.pagepermisson===undefined} shape='circle' icon={<EditOutlined />}></Button>
          </Popover>
        </div>
    }
  ]
  //控制权限中按钮开关编辑
  const switchMethod=(item)=>{  
    console.log(item);
    item.pagepermisson=item.pagepermisson===1?0:1
    setdataSource([...dataSource])
    if(item.grade===1){
      axios.patch(`/rights/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }else{
      axios.patch(`/children/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }
  }

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
    if(item.grade===1){       //当点击的是第一级直接删除
      setdataSource(dataSource.filter(data=>data.id!==item.id))
      axios.delete(`/rights/${item.id}`)
    }else{                    //当点击的是子级
      console.log(item.rightId);
      let list=dataSource.filter(data=>data.id===item.rightId)  //找到子级对应的父级
      console.log(list);
      list[0].children=list[0].children.filter(data=>data.id!==item.id)
      setdataSource([...dataSource])
      axios.delete(`/children/${item.id}`)
    }
    
  }

  return (
    <div>
      <Table 
        dataSource={dataSource}   //渲染数据
        columns={columns}         //表头
        pagination={{             //分页
          pageSize:5
        }}
      ></Table>
    </div>
  )
}
