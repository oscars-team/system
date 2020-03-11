import React, { useEffect, useState } from 'react'
import { Form, Input, Switch, Button, TreeSelect, Popconfirm } from 'antd'
// import NewItem from '@/components/NewItem';
// import CheckboxGroup from 'antd/lib/checkbox/Group';
import { ModuleDataType } from '../data.d'
import PermissionItemList from './PermissionItemList';
export interface EditPermissionProps {
    module?: ModuleDataType,
    tree?: ModuleDataType[],
    permission?: number,
    onSubmit?: (vals: ModuleDataType) => void
    onDelete?: (key?: string) => void
}

const EditPermission: React.FC<EditPermissionProps> = props => {

    const {
        module,
        tree,
        onDelete,
        onSubmit
    } = props;

    const [permModule, setPermModule] = useState<ModuleDataType>();
    useEffect(() => {
        const loadForm = (module?: ModuleDataType) => {
            form.setFieldsValue({
                _id: module?._id,
                authority: module?.authority,
                parent: module?.parent,
                children: module?.parent,
                hideChildrenInMenu: module?.hideChildrenInMenu,
                hideInMenu: module?.hideInMenu,
                icon: module?.icon,
                locale: module?.locale,
                name: module?.name,
                path: module?.path,
                permissions: []
            })
        }
        if (module != null) {
            loadForm(module);
            setPermModule(module);
        };
    }, [module])

    const [form] = Form.useForm();
    //#region ========== Check All ===========


    //#endregion


    //#region ========== Actions ===========
    const handleSubmit = async (vals: any) => {
        if (onSubmit) onSubmit({ ...module, ...vals } as ModuleDataType);
    }
    //#endregion


    const renderTreeList = (tree?: ModuleDataType[]) => {
        const renderItem = (node: ModuleDataType) => {
            if (node.children && node.children?.length > 0) {
                return (<TreeSelect.TreeNode
                    key={node._id}
                    value={node._id}
                    title={node.name}
                >
                    {node.children.map(m => renderItem(m))}
                </TreeSelect.TreeNode>)
            }
            return (<TreeSelect.TreeNode value={node._id} key={node._id} title={node.name}></TreeSelect.TreeNode>)
        }
        return (<TreeSelect
            allowClear
            treeDefaultExpandAll>
            {tree?.map(m => renderItem(m))}
        </TreeSelect>)
    }

    return (
        <>
            <h1 style={{ fontWeight: 500, fontSize: 20, marginBottom: 24 }}>{module?.name}</h1>
            <Form layout="vertical" style={{ maxWidth: 400 }} form={form}
                onFinish={handleSubmit} >
                <Form.Item label="父级模块" name="parent" >
                    {renderTreeList(tree)}
                    {/* {renderModuleTreeSelect()} */}
                </Form.Item>
                <Form.Item label="图标" name="icon">
                    <Input ></Input>
                </Form.Item>
                <Form.Item label="路径" name="path" required={true} rules={[{
                    required: true
                }]}>
                    <Input ></Input>
                </Form.Item>
                <Form.Item label="国际化" name="locale">
                    <Input ></Input>
                </Form.Item>
                <PermissionItemList
                    name="permission"
                    module={permModule}
                    onSelectAll={(e, n) => {
                        e.target.checked ? form.setFieldsValue({ permission: n }) : form.setFieldsValue({ permission: [] })
                    }}
                ></PermissionItemList>
                <Form.Item label="在菜单中隐藏" name="hideInMenu" valuePropName="checked">
                    <Switch></Switch>
                </Form.Item>
                <Form.Item label="在子菜单中隐藏" name="hideChildrenInMenu" valuePropName="checked">
                    <Switch ></Switch>
                </Form.Item>
                <Form.Item>
                    <Popconfirm
                        style={{ float: 'right' }}
                        title={`确定要删除\"${module?.name}\"模块吗？`}
                        onConfirm={() => { if (onDelete) onDelete(module?._id) }}
                        okText="是"
                        cancelText="否">
                        <Button type="danger" style={{ float: 'right' }}
                            disabled={module == null || module?._id.length === 0}
                        >删除模块</Button>
                    </Popconfirm>
                    <Button htmlType="submit" type="primary">保存模块与权限</Button>
                </Form.Item>
            </Form></>
    )

}

export default EditPermission;