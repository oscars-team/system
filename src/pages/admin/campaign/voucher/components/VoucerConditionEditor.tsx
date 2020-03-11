import React from 'react'
import { Modal, Button, Form } from 'antd'
export interface VoucerConditionEditorProps {
    title: string | undefined
    // 提交事件接口
    onSubmit: () => void
    // 取消事件接口
    onCancel: () => void
    // 是否显示Modal
    visible: boolean
    // Modal 的输出值
    values: Partial<VoucerConditionEditorProps>
}

const VoucerConditionEditor: React.FC<VoucerConditionEditorProps> = props => {
    const {
        title: modalTitle,
        visible: modalVisible,
        onSubmit: handleSubmit,
        onCancel: handleCancel,
    } = props;

    const [form] = Form.useForm();

    const renderFooter = () => {

        return (<>
            <Button onClick={handleCancel}>取消</Button>
            <Button type="primary" htmlType="submit" >确定</Button>
        </>)

    }

    return (
        <Modal
            title={modalTitle ? modalTitle : '无标题'}
            visible={modalVisible}
            footer={renderFooter()}
            onCancel={handleCancel}
            afterClose={() => { /** 这里可能需要重置一些值 */ }}
        >
            <Form
                form={form}
                onFinish={handleSubmit}>

            </Form>
        </Modal>
    )
}

export default VoucerConditionEditor;