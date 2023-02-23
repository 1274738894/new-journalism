import React, { useState } from 'react'
import { Layout, Dropdown, Avatar } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
const { Header } = Layout

export default function TopHeader() {
  const [collapsed, setCollapsed] = useState(false)
  const history=useHistory()
  const {role:{roleName},username}=JSON.parse(localStorage.getItem('token'))
const items = [
  {
    key: '1',
    label:roleName
    ,
  },
  {
    key: '2',
    label: (
     '退出'
    ),
    danger: true,
    onClick:()=>{
      localStorage.removeItem('token')
      history.replace('/login')
    }
  }
];
  const changeCollapsed = () => {
    setCollapsed(!collapsed)
  }
  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {
        collapsed ? <MenuFoldOutlined onClick={changeCollapsed} /> :
          <MenuUnfoldOutlined onClick={changeCollapsed} />
      }
      <div style={{ float: 'right' }}>
        <span>欢迎<span style={{color:"#1890ff"}}>{username}</span>回来</span>
        <Dropdown menu={{ items }}> 
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

