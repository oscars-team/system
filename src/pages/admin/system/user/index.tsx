import React, { useState, useRef } from 'react'
import { Avatar, Divider, Popconfirm } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table'
import { Button, message } from 'antd'
import { AdminListItem, AdminDataType, } from './data.d'
import AdminModal from './components/AdminModal'

import { index, create, destory } from './service'
import { SorterResult } from 'antd/lib/table/interface'
const AdminList: React.FC<{}> = () => {

  //#region ========== Hook ================
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [modalValues, setModalValues] = useState<AdminDataType>({});
  const [sorter, setSorter] = useState<string>('');
  const actionRef = useRef<ActionType>();
  //#endregion

  //#region =========== 页面方法 ============

  const openModal = (vals?: AdminDataType) => {
    setModalValues(vals || {});
    setModalVisible(true);
  }

  /**
   * 响应表格发生变化
   * @param p pagination
   * @param f filter
   * @param s sorter
   */
  const onTableChange = (p: any, f: any, s: any) => {
    const sorterResult = s as SorterResult<AdminListItem>;
    if (sorterResult.field) {
      setSorter(`${sorterResult.field}.${sorterResult.order}`);
    }
  }

  /**
   * 创建用户
   */
  const createAdminUser = async (vals: AdminDataType) => {
    const hide = message.loading('正在添加管理员');
    let res = await create(vals);
    hide();

    if (res.err) {
      message.error(res.errmsg);
      return false;
    }

    message.success('创建成功');
    return true;
  }

  const destoryAdminUser = async (key: string) => {
    const hide = message.loading('正在删除...');
    let res = await destory(key);
    hide();
    if (res.err) {
      message.error(res.errmsg);
      return false;
    }

    message.success('删除成功');
    actionRef.current?.reload();
    return true;
  }

  /**
   * 页面工具栏
   */
  const renderToolBar = () => {
    return [
      <Button type="primary" onClick={() => { openModal() }}>添加管理员</Button>
    ]
  }
  //#endregion

  const columns: ProColumns<AdminListItem>[] = [
    { title: '编号', dataIndex: '_id', hideInSearch: true, hideInTable: true },
    {
      title: '头像', dataIndex: 'avatar_url', hideInSearch: true, width: 80, render(t, r, i, a) {
        return (<Avatar src={r.avatar_url} />)
      }
    },
    { title: '名称', dataIndex: 'name' },
    { title: '邮箱', dataIndex: 'email' },
    { title: '手机', dataIndex: 'phone' },
    { title: '国家', dataIndex: 'country' },
    { title: '省份', dataIndex: 'province' },
    { title: '城市', dataIndex: 'city' },
    { title: '创建日期', sorter: true, dataIndex: 'create_at', valueType: 'dateTime' },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (t, r) => (<>
        <a onClick={() => { openModal(r) }}>编辑</a>
        <Divider type="vertical"></Divider>
        <Popconfirm
          title={`确定要删除\"${r.name}\"吗？`}
          onConfirm={async () => { await destoryAdminUser(r._id) }}
          okText="是"
          cancelText="否">
          <a style={{ color: 'red' }} type="danger">删除</a>
        </Popconfirm>
      </>)
    }

  ]
  return (
    <PageHeaderWrapper
      content='通过这个页面对系统用户进行管理'
    >
      <ProTable<AdminListItem>
        // 数据主键
        rowKey="_id"
        // 表格头部标题
        headerTitle='管理员列表'
        // 表格列配置
        columns={columns}
        // 数据源接口
        request={params => index(params)}
        // 表格状态变化事件
        onChange={onTableChange}
        // 状态变化参数
        params={{ sorter }}
        // 工具栏
        toolBarRender={renderToolBar}
        // 表格动作引用
        actionRef={actionRef}
      />

      <AdminModal
        values={modalValues}
        onCancel={() => { setModalVisible(false) }}
        onSubmit={async vals => {
          let success = await createAdminUser(vals);
          if (success) {
            setModalVisible(false);
            actionRef.current?.reload();
          }
        }}
        visible={modalVisible}
      >
      </AdminModal>

    </PageHeaderWrapper >
  )
}

export default AdminList
