import { Button, Switch, Table, Modal } from 'antd'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined

} from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm'
const { confirm } = Modal
export default function UserLIst() {
  const [dataSource, setdataSource] = useState([])
  const [isModalOpen, setModalOpen] = useState(false)
  const [isUpdataModalOpen, setisUpdataModalOpen] = useState(false)
  const [roleList, setroleList] = useState([])
  const [regionList, setregionList] = useState([])
  const [isUpdataDisabled, setisUpdataDisabled] = useState(false)
  const [current, setcrrent] = useState(null)
  const addForm = useRef(null)
  const updataForm = useRef(null)

  const {roleId,username,region}=JSON.parse(localStorage.getItem('token'))
  useEffect(() => {       //地址数据
    axios.get('/regions').then(res =>
      setregionList(res.data)
    )
  }, [])
  useEffect(() => {     //角色数据
    axios.get('/roles').then(res =>
      setroleList(res.data)
    )
  }, [])

  useEffect(() => {     //表格渲染数据
    axios.get('/users?_embed=role').then(res => {
      const list=res.data
      setdataSource(roleId===1?list:[
        ...list.filter(item=>item.username===username),
        ...list.filter(item=>item.region===region && item.roleId===3)
      ])
    }
    )
  },[roleId,username,region])

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => {
        return <b>{region === '' ? '全球' : region}</b>
      },
      filters:[
          ...regionList.map(item=>(
            {
              text:item.title,
              value:item.value
            }
          )),
          {
            text:'全球',
            value:''
          }
      ],
      onFilter:(value,item)=>item.region===value
    },
    {
      title: '角色名称',
      dataIndex: 'roleId',
      render: (roleId) => {
        switch(roleId){
          case 1 :
            return '超级管理员'
          case 2 :
              return '区域管理员'
          default:
            return '区域编辑'
        }
      }
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch onChange={() => handleChange(item)} checked={roleState} disabled={item.default}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button danger shape='circle' icon={<DeleteOutlined />}
              onClick={() => confirmMethod(item)}
              disabled={item.default}
            />

            <Button type='primary' shape='circle' icon={<EditOutlined />}
              disabled={item.default}
              onClick={() => handleUpdata(item)}
            ></Button>
          </div>
        )
      }
    }
  ]
  const confirmMethod = (item) => {   //单击垃圾箱弹出确定框
    confirm({
      title: '你确定要删除?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        console.log('OK');
        dleteMethod(item)         //单击确定调用删除函数

      },
      onCancel() { },
    });
  }

  const dleteMethod = (item) => {     //删除函数
    console.log(item);
    //当前页面同步状态 + 后端同步
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/roles/${item.id}`)
  }
  // 添加用户功能
  const addUser = () => {
    setModalOpen(true)
  }
  // 获得子表单项中数据 添加用户
  const addFormOk = () => {
    addForm.current.validateFields().then(value => {
      addForm.current.resetFields()
      setModalOpen(false)
      //post到后端，生成ID，再设置datasource,方便后边的删除和更新
      axios.post('/users', {
        ...value,
        "roleState": true,
        "default": false,
      }).then(res => {
        console.log(res.data);
        setdataSource([...dataSource, {
          ...res.data
        }])

      }).catch(err => {
        console.log(err);
      })
    })
  }
  // 修改用户状态
  const handleChange = (item) => {
    console.log(item);
    item.roleState = !item.roleState
    setdataSource([...dataSource])
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState
    })
  }
  // 更新数据弹出框
  const handleUpdata = async (item) => {

    await setisUpdataModalOpen(true)

    if (item.roleId === 1) {
      // 禁用区域按钮
      setisUpdataDisabled(true)
    } else {
      // 启用区域按钮000
      setisUpdataDisabled(false)
    }
    updataForm.current.setFieldsValue(item)
    setcrrent(item)
  }
  // 更新数据按钮
  const updataFormOk = () => {
    
    updataForm.current.validateFields().then(res => {
      console.log(res);
      setisUpdataModalOpen(false)
      setdataSource(dataSource.map(value => {
        if (value.id === current.id) {
          return {
            ...value,
            ...res
          }
        }
        return value
      }))
      setisUpdataDisabled(!isUpdataDisabled)
      axios.patch(`/users/${current.id}`,res)
    })
  }
  return (
    <div>
      <Button type='primary' onClick={() => addUser()}>添加用户</Button>

      <Table dataSource={dataSource} columns={columns} rowKey={item => item.id}
        pagination={{ pageSize: 5 }}
      />
      <Modal title="添加用户信息" okText='确定' cancelText='取消' open={isModalOpen}
        onCancel={() => {
          setModalOpen(false)
        }}
        onOk={() => addFormOk()}
      >
        <UserForm ref={addForm} regionList={regionList} roleList={roleList} />
      </Modal>

      <Modal title="更新用户信息" okText='更新' cancelText='取消' open={isUpdataModalOpen}
        onCancel={() => {
          setisUpdataModalOpen(false)
          setisUpdataDisabled(!isUpdataDisabled)
        }}
        onOk={() => updataFormOk()}
      >
        <UserForm ref={updataForm} regionList={regionList} roleList={roleList} isUpdataDisabled={isUpdataDisabled} isUpdata={true}/>
      </Modal>
    </div>
  )
}
