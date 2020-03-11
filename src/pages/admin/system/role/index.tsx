import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Menu, Row, Col, Skeleton, Table, Checkbox, Form, Button, message } from 'antd'
import NewItem from '@/components/NewItem';
import styles from '@/pages/default.less'
import { RoleDataType } from './data.d'
import { index, create, update } from './service'
import * as permissionService from '../permission/components/service'
import * as moduleService from '../permission/service'
import { SelectParam } from 'antd/lib/menu';
import { PermissionDataType } from '../permission/components/data.d';
import { ModuleDataType } from '../permission/data';
import { treeSet, deconstructInt } from '@/utils/utils'
import { ColumnsType } from 'antd/lib/table';
import { CheckboxOptionType } from 'antd/lib/checkbox';
interface PermissionGrouppedValueDataType {
    _id?: string,
    name?: string,
    value?: number
}

interface PermissionGroupDataType {
    moduleId: string | undefined,
    permissions: PermissionGrouppedValueDataType[]
}

const RoleManager: React.FC<{}> = () => {

    //#region ============ Hooks =============
    // 按模块分过组的集合
    const [grouppedPerms, setGrouppedPerms] = useState<PermissionGroupDataType[]>([]);
    // 模块数据列表
    const [modules, setModules] = useState<ModuleDataType[]>([]);
    // 当前所选的角色
    const [currentRole, setCurrentRole] = useState<RoleDataType>();
    // 所有角色
    const [roles, setRoles] = useState<RoleDataType[]>([]);

    useEffect(() => {
        indexRoles();
        indexPermissions();
        indexModules();
    }, [])

    useEffect(() => {
        if (currentRole) {
            let emptyVals = {}, perVals = {};
            modules.forEach(m => {
                emptyVals[m._id] = [];
            });
            currentRole.permissions.forEach(p => {
                perVals[p.moduleId] = deconstructInt(p.value);
            });
            form.setFieldsValue({ ...emptyVals, ...perVals });
        }
    }, [currentRole])
    //#endregion

    const [form] = Form.useForm();
    //#region ========== API  =============
    const indexRoles = async () => {
        const res = await index();
        if (res.err) {
            return;
        }
        setRoles(res);
        if (res.length > 0) {
            setCurrentRole(res[0]);
        }

    }

    const createRole = async (text: string) => {
        let res = await create({ name: text } as RoleDataType);
        if (res.err) {
            return false
        }
        await indexRoles();
        return true;
    }

    const indexPermissions = async () => {
        const res = await permissionService.index();
        if (res.err) {
            return;
        }

        let groupped = (res as Array<PermissionDataType>).reduce((arr, record) => {
            const index = arr.findIndex(a => a.moduleId === record.moduleId);
            if (index === -1) {
                // 不存在
                arr.push({
                    moduleId: record.moduleId,
                    permissions: [{
                        _id: record.moduleId,
                        name: record.name,
                        value: record.value
                    }]
                })
            } else {
                // 存在的话
                arr[index].permissions.push({
                    _id: record.moduleId,
                    name: record.name,
                    value: record.value
                })
            }
            return arr;
        }, [] as PermissionGroupDataType[]);
        setGrouppedPerms(groupped);
    }

    const indexModules = async () => {
        let res = await moduleService.index();
        if (res.err) {
            return
        }
        setModules(treeSet(res, '_id', 'parent'));
    }

    //#endregion

    const onMenuSelect = (p: SelectParam) => {
        setCurrentRole(roles.find(r => r._id === p.key))
    }

    const renderRoleList = () => {
        return (<Menu
            selectedKeys={currentRole ? [currentRole._id] : []}
            mode="inline"
            onSelect={onMenuSelect}
        >
            {roles.map(r => (
                <Menu.Item key={r._id}>{r.name}</Menu.Item>
            ))}

        </Menu>)
    }


    const columns: ColumnsType<ModuleDataType> = [
        {
            title: '模块名称',
            dataIndex: 'name'
        },
        {
            title: '权限',
            render(text, record, index) {
                return (
                    <Form.Item name={record._id} >
                        <Checkbox.Group
                            options={grouppedPerms.find(g => g.moduleId === record._id)?.permissions.map(p => {
                                let cbo = {
                                    label: p.name,
                                    value: p.value,
                                    disabled: false
                                } as CheckboxOptionType;
                                return cbo;
                            })}
                        >

                        </Checkbox.Group>
                    </Form.Item>
                )
            }

        },
        {
            title: '全选'
        }
    ]


    const handleSubmit = async (vals: any) => {
        if (currentRole == null) return;
        currentRole.permissions = [];
        for (var key in vals) {
            let v: number[] = vals[key];
            if (!v || v.length === 0) continue;
            currentRole.permissions.push({ moduleId: key, value: v.reduce((a, b) => { return a + b; }, 0) })
        }
        let hide = message.loading('正在保存角色...');
        await update(currentRole);
        await indexRoles();
        hide();
        message.success('保存成功');
        setCurrentRole(currentRole);
    }

    return (
        <PageHeaderWrapper title="角色管理"
        >
            <Row>
                <Col span={24} className={styles.container}>
                    <Row gutter={[24, 24]}>
                        <Col style={{ maxWidth: 200 }} span={6}>
                            <Skeleton active={true}
                                loading={roles.length === 0}
                                paragraph={{ rows: 4 }}>
                                {renderRoleList()}
                            </Skeleton>
                            <NewItem
                                text="添加角色"
                                onSubmit={async (value) => { await createRole(value) }}
                            ></NewItem>
                        </Col>
                        <Col span={18}>
                            <Form
                                form={form}
                                onFinish={async (vals) => { await handleSubmit(vals); }}
                            >
                                <Table
                                    expandedRowKeys={modules.map(m => m._id)}
                                    columns={columns}
                                    dataSource={modules}
                                    rowKey="_id">
                                </Table>
                                <br></br>
                                <Button type="primary" htmlType="submit" >保存角色</Button>
                                <Button type="danger" style={{ float: 'right' }}>删除角色</Button>
                            </Form>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/**/}
        </PageHeaderWrapper>
    )
}

export default RoleManager;