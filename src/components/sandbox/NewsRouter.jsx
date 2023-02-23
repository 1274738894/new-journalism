import React, { useEffect,useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import axios from 'axios'
import Home from '../../views/sandbox/home/Home'
import UserList from '../../views/sandbox/user-manage/UserList'
import RightList from '../../views/sandbox/right-manage/RightList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import NoPermission from '../../views/sandbox/nopermission/Nopermission'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import Newsadd from '../../views/sandbox/news-manage/Newsadd'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpuclished from '../../views/sandbox/publish-manage/Unpuclished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'

const LocalRouterMap={
    "/home":Home,
    '/user-manage/list':UserList,
    '/right-manage/role/list':RoleList,
    '/right-manage/right/list':RightList,
    // 新闻模块
    "/news-manage/add":Newsadd,
    "/news-manage/draft":NewsDraft,
    "/news-manage/category":NewsCategory,
    // 审核模块
    "/audit-manage/audit":Audit,
    "/audit-manage/list":AuditList,
    // 发布模块
    "/publish-manage/unpublished":Unpuclished,
    "/publish-manage/published":Published,
    "/publish-manage/sunset":Sunset
}

export default function NewsRouter() {
    const [BackRouterList, setBackRouterList] = useState([])
    useEffect(()=>{
        Promise.all([
            axios.get('/rights'),
            axios.get('/children')
        ]).then(res=>{
            setBackRouterList([...res[0].data,...res[1].data])
        })
    },[BackRouterList])
    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))

    // 当前登录用户信息
    const checkRoute=(item)=>{
        return LocalRouterMap[item.key] && item.pagepermisson
    }
    const checkUserPermission=(item)=>{
        return rights.checked.includes(item.key)
    }
    return (
        <Switch>
            {
                BackRouterList.map(item=>{
                    if(checkRoute(item) && checkUserPermission(item)){
                     return  <Route path={item.key} component={LocalRouterMap[item.key]} key={item.key} exact/>
                    }
                    return null
                }
                )
            }
            <Redirect from='/' to='/home' exact />
            {
                BackRouterList.length>0?<Route path='*' component={NoPermission} />:null
            }
        </Switch>
    )
}
