import React, { useEffect } from 'react'

import { Layout } from 'antd'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import NewsRouter from '../../components/sandbox/NewsRouter'
import './NewsSandBox.css'


const { Content } = Layout
export default function NewsSandBox() {
    NProgress.start();
    useEffect(()=>{
        NProgress.done();
    })
    return (
        <Layout>
            {/* 侧边栏 */}
            <SideMenu></SideMenu>
            <Layout className="site-layout">
                {/* 导航栏 */}
                <TopHeader></TopHeader>
                {/* 右侧显示区域 */}
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow:'auto'
                    }}
                >
                    <NewsRouter></NewsRouter>
                </Content>

            </Layout>
        </Layout>
    )
}
