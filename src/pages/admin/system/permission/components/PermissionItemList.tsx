import React, { useState, useEffect } from 'react'
import { Form, Checkbox, Popconfirm, Spin } from 'antd'
import NewItem from '@/components/NewItem';
import { ModuleDataType } from '../data.d'
import { PermissionDataType } from './data.d'

import { index, create, destory } from './service'


export interface PermissionItemListProps {
    // Form.Item 绑定的字段
    name: string,
    module?: ModuleDataType,
    onSelectAll?: (e: any, n: number[]) => void
}

interface Option {
    _id: string
    label: string;
    value: number;
    disabled?: boolean;
}

const PermissionItemList: React.FC<PermissionItemListProps> = props => {

    const {
        name,
        module,
        onSelectAll
    } = props

    const [spinning, setSpinning] = useState<boolean>(false);
    const [checkList, setCheckList] = useState<number[]>([]);
    const [perms, setPerms] = useState<Option[]>([]);
    const [indent, setIndent] = useState<boolean>(false);
    const [checkAll, setCheckAll] = useState<boolean>(false);
    useEffect(() => {
        const loadPermissions = async (module?: ModuleDataType) => {
            if (module != null) {
                let res = await index({ moduleId: module._id });
                if (res.err) return;
                let options: any = (res as PermissionDataType[]).map(o => {
                    return {
                        _id: o._id,
                        label: o.name,
                        value: o.value,
                        disabled: false
                    }
                })
                setPerms(options);
            }
        }
        loadPermissions(module);
    }, [module])

    const handleCreate = async (text: string) => {
        await create({ name: text, moduleId: module?._id });
        const loadPermissions = async (module?: ModuleDataType) => {
            if (module != null) {
                let res = await index({ moduleId: module._id });
                if (res.err) return;
                let options: any = (res as PermissionDataType[]).map(o => {
                    return {
                        _id: o._id,
                        label: o.name,
                        value: o.value,
                        disabled: false
                    }
                })
                setPerms(options);
            }
        }
        loadPermissions(module);
    }

    const handleDelete = async () => {
        const filtered = perms.filter(p => checkList.includes(p.value));
        setSpinning(true);
        filtered.map(f => f._id).forEach(async (e) => {
            await destory(e);
        });
        const loadPermissions = async (module?: ModuleDataType) => {
            if (module != null) {
                let res = await index({ moduleId: module._id });
                if (res.err) return;
                let options: any = (res as PermissionDataType[]).map(o => {
                    return {
                        _id: o._id,
                        label: o.name,
                        value: o.value,
                        disabled: false
                    }
                })
                setPerms(options);
            }
        }
        loadPermissions(module);
        setSpinning(false);
    }

    const onCheckAllChanged = (e: any) => {
        setCheckList(e.target.checked ? perms.map(e => e.value) : []);
        setIndent(false);
        setCheckAll(e.target.checked);

        if (onSelectAll) {
            onSelectAll(e, perms.map(e => e.value))
        }
    }

    const onChanged = (vals: any) => {
        setCheckList(vals);
        setIndent(!!vals.length && vals.length < perms.length)
        setCheckAll(vals.length === perms.length);
    }

    return (
        <Spin size="default" spinning={spinning}>
            <Form.Item label={(<>
                <Checkbox checked={checkAll}
                    indeterminate={indent}
                    onChange={onCheckAllChanged}
                >权限(全选)</Checkbox>
                <NewItem text="添加权限"
                    onSubmit={async (text) => { await handleCreate(text) }}
                ></NewItem>

                <Popconfirm
                    title="注意! 删除权限将改变已有权限的值. 如果你知道怎么操作, 点击'确定'继续操作"
                    onConfirm={async () => { await handleDelete() }}>
                    <a style={{ color: 'red' }} hidden={checkList.length === 0}>删除</a>
                </Popconfirm>
            </>)}
                name={name}>
                <Checkbox.Group
                    value={checkList}
                    onChange={onChanged}
                    options={perms}
                >

                </Checkbox.Group>
            </Form.Item>
        </Spin>

    )
}

export default PermissionItemList;