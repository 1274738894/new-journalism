import {
  HomeOutlined,
  SolutionOutlined,
  UserOutlined,
  UnlockOutlined,
  TeamOutlined,
  KeyOutlined,
  MailOutlined,
  FormOutlined,
  AlignLeftOutlined,
  RadarChartOutlined,
  AuditOutlined,
  HighlightOutlined,
  OrderedListOutlined,
  ExclamationCircleOutlined,
  SnippetsOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import './index.css'

const { Sider } = Layout

// const items = [
//   {
//     key: '/home',
//     label: '首页',
//     icon: <MailOutlined />,
//   },
//   {
//     key: '/user-manage',
//     label: '用户管理',
//     icon: <AppstoreOutlined />,
//     children: [
//       {
//         key: '/user-manage/list',
//         label: '用户列表',
//         icon: null
//       },
//     ]
//   },
//   {
//     key: '/',
//     label: '权限管理',
//     icon: <SettingOutlined />,
//     children: [
//       {
//         key: '/right-manage/role/list',
//         label: '角色列表',
//         icon: null
//       },
//       {
//         key: '/right-manage/right/list',
//         label: '权限列表',
//         icon: null
//       },
//     ]
//   }
// ]
const iconList = {
  "/home": <HomeOutlined />,
  "/user-manage": <SolutionOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage": <UnlockOutlined />,
  "/right-manage/role/list": <TeamOutlined />,
  "/right-manage/right/list": <KeyOutlined />,
  "/news-manage": <MailOutlined />,
  "/news-manage/add": <FormOutlined />,
  "/news-manage/draft": <AlignLeftOutlined />,
  "/news-manage/category": <RadarChartOutlined />,
  "/audit-manage": <AuditOutlined />,
  "/audit-manage/audit": <HighlightOutlined />,
  "/audit-manage/list": <OrderedListOutlined />,
  "/publish-manage": <SnippetsOutlined />,
  "/publish-manage/unpublished": <ExclamationCircleOutlined />,
  "/publish-manage/published": <CheckCircleOutlined />,
  "/publish-manage/sunset": <StopOutlined />
}
function SideMenu(props) {
  const [items, setItems] = useState([])
  useEffect(() => {
    axios.get('/rights?_embed=children')
      .then(res => {
        setItems(res.data)
      })
  }, [])
  const {role:{rights}}=JSON.parse(localStorage.getItem('token'))
  // 
  const checkPagePermission = (item) => {
    return item.pagepermisson && rights.checked.includes(item.key)
  }

  // 侧边栏导航渲染
  const renderMenu = (items) => {
    return items.map(item => {
      if (item.children?.length > 0 && checkPagePermission(item)) {
        return <Menu.SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
          {
            renderMenu(item.children)
          }
        </Menu.SubMenu>
      }
      return checkPagePermission(item) && <Menu.Item key={item.key} icon={item.icon} onClick={() => {
        props.history.push(item.key)
      }}>{item.title}</Menu.Item>
    })
  }
  const selectKeys=[props.location.pathname]  //路由地址保存
  const openKeys=['/'+props.location.pathname.split('/')[1]]

  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div style={{ display: 'flex', height: '100%', "flexDirection": 'column' }}>
        <div className="logo">全球新闻发布管理系统</div>
        <div style={{flex:1,"overflow":'auto'}}>
          <Menu 
          mode="inline" 
          theme="dark" 
          selectedKeys={selectKeys}
          // defaultSelectedKeys={selectKeys} //默认哪个key值高亮
          defaultOpenKeys={openKeys}>
            {renderMenu(items)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}
export default withRouter(SideMenu)
