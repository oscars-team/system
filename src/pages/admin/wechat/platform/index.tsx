import React, { useState, useRef } from "react";
import { connect, routerRedux } from "dva";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { ConnectProps } from "@/models/connect";
import ProTable, { ProColumns, ActionType } from "@ant-design/pro-table";
import { IWechatPlatformEntity } from "./data";
import { index, destory } from "./service";
import { Divider, Popconfirm, Button } from "antd";
import { SorterResult } from "antd/lib/table/interface";
import { Link } from "umi";
interface PlatformProps extends ConnectProps {

}
const Platform: React.FC<PlatformProps> = props => {

    const [sorter, setSorter] = useState<string>('');
    const actionRef = useRef<ActionType>();
    const columns: ProColumns<IWechatPlatformEntity>[] = [
        { title: '编号', dataIndex: 'id', hideInSearch: true, hideInTable: true },
        { title: '标题', dataIndex: 'title' },
        { title: 'App Id', dataIndex: 'appId' },
        {
            title: '类型', dataIndex: 'type', render: (t, r) => (
                <span>{r.type === 0 ? '订阅号' : r.type === 1 ? '公众号' : '未知'}</span>
            )
        },
        {
            title: '操作',
            dataIndex: 'option',
            render: (t, r) => (<>
                <Link to={`platform/edit?id=${r.id}`}>编辑</Link>
                <Divider type='vertical'></Divider>
                <Popconfirm
                    title={`确定要删除'${r.title}'吗?`}
                    okText="是"
                    cancelText="否"
                    onConfirm={async () => { await destory(r.id); actionRef.current?.reload() }}
                >
                    <a style={{ color: 'red' }} type="danger" >删除</a>
                </Popconfirm>
            </>)
        }

    ]


    const onTableChange = (p: any, f: any, s: any) => {
        const sorterResult = s as SorterResult<IWechatPlatformEntity>;
        if (sorterResult.field)
            setSorter(`${sorterResult.field}.${sorterResult.order}`)
    }

    /**
     * 页面工具栏
     */
    const renderToolBar = () => {
        return [
            <Link to="platform/create">
                <Button type="primary">添加公众平台</Button>
            </Link>
        ]
    }

    return (<>
        <PageHeaderWrapper>
            <ProTable<IWechatPlatformEntity>
                // 数据主键
                rowKey="id"
                // 表格头部标题
                headerTitle='微信平台列表'
                // 表格列配置
                columns={columns}
                // 数据源接口
                request={params => index(params as IWechatPlatformEntity)}
                // 表格状态变化事件
                onChange={onTableChange}
                // 状态变化参数
                params={{ sorter }}
                // 工具栏
                toolBarRender={renderToolBar}
                // 表格动作引用
                actionRef={actionRef}
            >

            </ProTable>
        </PageHeaderWrapper >

    </>)
}

export default connect()(Platform);