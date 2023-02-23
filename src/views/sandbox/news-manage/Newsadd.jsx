import { PageHeader,Steps } from 'antd'
import React from 'react'
const {Step}=Steps

export default function Newsadd() {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="撰写标题"
        subTitle="This is a subtitle"
      />
      <Steps current={0}>
        <Step title="基本信息" description="新闻标题，新闻分类"/>
        <Step title="新闻内容" description="新闻主体内容"  />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>
    </div>
  )
}
