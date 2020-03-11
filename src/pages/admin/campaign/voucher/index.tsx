import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect, useRef } from 'react';
import { Button, Tag, Divider, Popconfirm, message } from 'antd';
import { VoucherListItem, MerchantVoucherQuery } from "./data.d";
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { destory, index } from "./service";

import styles from './index.less';
import moment from 'moment';
import { ConnectProps } from '@/models/connect';
import { connect } from 'dva';

import { Link } from "react-router-dom";
moment.locale('zh-cn')

interface VoucherIndexProps extends ConnectProps { }

const VoucherIndex: React.FC<VoucherIndexProps> = props => {
  //#region 
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    // setTimeout(() => {
    //   setLoading(false);
    // }, 3000);
  }, []);


  //#region ============= API ==============

  //#endregion

  const handleDelete = async (key: string) => {
    let hide = message.loading('正在删除...');
    let res = await destory(key);
    hide();
    if (res.err) {
      message.error(res.errmsg);
      return false
    }
    message.success('删除成功');
    actionRef.current?.reload();
    return true;
  }

  const columns: ProColumns<MerchantVoucherQuery>[] = [
    { title: '编号', dataIndex: 'id', hideInSearch: true, hideInTable: true, hideInForm: true },
    { title: '券标题', dataIndex: 'title' },
    { title: '剩余数量', dataIndex: 'amount' },
    { title: '描述', dataIndex: 'desc' },
    // { title: '券标题', dataIndex: 'type' },
    { title: '抵扣值', dataIndex: 'value' },
    { title: '创建时间', dataIndex: 'create_at', render: (t, r) => (<span>{moment(r.create_at).format('l')}</span>) },
    { title: '过期时间', dataIndex: 'expire_at', render: (t, r) => (<span>{moment(r.expire_at).fromNow()}</span>) },
    {
      title: '状态', dataIndex: 'state', render: (t, r) => {
        if (r.state === -1) return (<Tag color="red">已删除</Tag>)
        if (r.state === 0) return (<Tag color="red">不可用</Tag>)
        if (r.expire_at && new Date() > r.expire_at) return (<Tag color="red">已过期</Tag>)
        if (r.expire_at && moment().add(7, 'day') > moment(r.expire_at)) return (<Tag color="vocano">一周内过期</Tag>)
        return (<Tag color="green">正常</Tag>)
      }
    }, {
      title: '操作',
      render: (t, r) => (<>
        <Link to={`voucher/edit?id=${r.id}`}>编辑</Link>
        <Divider type="vertical"></Divider>
        <Popconfirm title="确定要删除吗?"
          okText="是"
          cancelText="否"
          onConfirm={async () => {
            if (r.id) await handleDelete(r.id)
          }}>
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>
      </>)
    }
  ]


  const renderToolBar = () => {
    return ([<Button type="primary"><Link to="voucher/edit">创建新票券</Link></Button>])
  }

  //#endregion


  const [pageActiveKey, setPageActiveKey] = useState<string>('published');

  return (
    <PageHeaderWrapper content="推广优惠券管理" className={styles.main}
      onTabChange={(key) => { setPageActiveKey(key); }}
      tabActiveKey={pageActiveKey}
      tabList={[
        { key: 'published', tab: '我发布的优惠券' },
        { key: 'activated', tab: '使用的中优惠券' }
      ]}>
      <div style={{ display: pageActiveKey === 'published' ? 'block' : 'none' }}>
        <ProTable<MerchantVoucherQuery>

          // 数据主键
          rowKey="id"
          // 表格头部标题
          headerTitle='推广中的优惠券'
          // 表格列配置
          columns={columns}
          // 数据源接口
          request={async params => index(params)}
          // 表格状态变化事件
          // onChange={onTableChange}
          // // 状态变化参数
          // params={{ sorter }}

          // // 工具栏
          toolBarRender={renderToolBar}
          // // 表格动作引用
          actionRef={actionRef}
        />
        {/* <VoucherModal
          title="创建票券"
          visible={modalVisible}
          onCancel={() => { setModalVisible(false) }}
          onSubmit={handleCreate}
          values={modalValues}
        ></VoucherModal> */}
      </div>
    </PageHeaderWrapper >
  );
};

export default connect()(VoucherIndex);