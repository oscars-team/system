import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper, MenuDataItem } from '@ant-design/pro-layout'
import styles from '@/pages/default.less'
import NewItem from '@/components/NewItem';
import { ModuleDataType } from './data.d'
import { Menu, Row, Col, Skeleton, Spin, message } from 'antd'
import EditPermission from './components/EditPermission'
import { treeSet } from '@/utils/utils'
import { index, create, destory } from './service'

const PermissionManager: React.FC<{}> = () => {

    const [modules, setModules] = useState<ModuleDataType[]>([]);
    const [tree, setTree] = useState<ModuleDataType[]>([]);
    const [moduleCurrent, setModuleCurrent] = useState<ModuleDataType>();
    const [spinning, setSpinning] = useState<boolean>(false);
    useEffect(() => {
        // 初始化模块列表
        indexModules();
    }, [])

    //#region ========== API  =============
    const indexModules = async () => {
        setSpinning(true);
        const res = await index();
        setSpinning(false);
        if (res.err) {
            return;
        }
        if (res.length > 0) setModuleCurrent(res[0])
        setTree(treeSet<ModuleDataType>(res, '_id', 'parent'));
        setModules(res);
    }

    const createModule = async (text: string) => {
        let res = await create({ name: text } as ModuleDataType);
        if (res.err) {
            return false
        }
        await indexModules();
        return true;
    }

    const updateModule = async (vals: ModuleDataType) => {
        let res = await create(vals);
        if (res.err)
            return false;
        await indexModules();
        return true;
    }

    const deleteModule = async (key?: string) => {
        if (key) {
            const hide = message.loading('正在删除...');
            const res = await destory(key);
            hide();
            if (res.err) {
                message.error(res.errmsg)
                return;
            }
            message.success('删除成功');
            await indexModules();
        }

    }
    //#endregion

    const onMenuChanged = (e: any) => {
        // (e) => { setMenuCurret(e.key)
        let m = modules.find(p => p._id === e.key);
        setModuleCurrent(m);
    }

    const onSubMenuClick = (e: any) => {
        let m = modules.find(p => p._id === e.key);
        setModuleCurrent(m);
    }

    const renderModuleList = (tree: MenuDataItem[]) => {
        const renderItem = (node: MenuDataItem) => {
            if (node.children && node.children?.length > 0) {
                return (<Menu.SubMenu
                    key={node._id}
                    title={node.name}
                    onTitleClick={onSubMenuClick}>
                    {node.children.map(m => renderItem(m))}
                </Menu.SubMenu>)
            }
            return (<Menu.Item key={node._id}>{node.name}</Menu.Item>)
        }
        return (<Menu
            selectedKeys={moduleCurrent ? [moduleCurrent._id] : []}
            mode="inline"
            onClick={onMenuChanged}>
            {tree.map(m => renderItem(m))}
        </Menu>)
    }



    return (
        <PageHeaderWrapper
            title="权限管理"
        >
            <Spin
                delay={200}
                size="large"
                spinning={spinning}>
                <Row>
                    <Col span={24} className={styles.container}>
                        <Row gutter={[24, 24]}>
                            <Col style={{ maxWidth: 200 }} span={6}>
                                <Skeleton active={true}
                                    loading={modules.length === 0}
                                    paragraph={{ rows: 4 }}>
                                    {renderModuleList(tree)}
                                </Skeleton>
                                <NewItem
                                    text="添加模块"
                                    onSubmit={async (value) => { await createModule(value) }}
                                ></NewItem>
                            </Col>
                            <Col span={18} style={{ padding: 24, }}>
                                <EditPermission
                                    module={moduleCurrent}
                                    tree={tree}
                                    onDelete={async (key) => { await deleteModule(key) }}
                                    onSubmit={async (vals) => {
                                        await updateModule(vals);
                                    }}
                                ></EditPermission>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Spin>
        </PageHeaderWrapper >
    )
}

export default PermissionManager;