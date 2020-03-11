import React, { useState, useEffect } from 'react'
import moment from 'moment';
import { Modal, Button, Form, Input, Select, DatePicker, InputNumber, message } from 'antd'
import { VoucherListItem, MerchantVoucherQuery } from "../data.d";
import TextArea from 'antd/lib/input/TextArea';
export interface VoucherModalProps {
    title: string | undefined
    // 提交事件接口
    onSubmit: (vals: Partial<MerchantVoucherQuery>) => Promise<boolean>
    // 取消事件接口
    onCancel: () => void
    // onShown: (sender: any) => void
    // 是否显示Modal
    visible: boolean
    // Modal 的输出值
    values?: Partial<VoucherListItem>
}

const VoucherModal: React.FC<VoucherModalProps> = props => {
    const {
        title: modalTitle,
        visible: modalVisible,
        onSubmit: handleSubmit,
        onCancel: handleCancel,
        //   onShown: handleShown,
        values
    } = props;
    const [form] = Form.useForm();
    //#region ========== Hooks ============
    const [submitting, setSubmitting] = useState<boolean>(false);
    useEffect(() => {
        if (values) {
            const { expire_at, ...rest } = values
            form.setFieldsValue({
                expire_at: values.expire_at ? moment(values.expire_at) : moment().add(3, 'month'),
                amount: 0,
                type: 2,
                ...rest
            });
        }
    }, [values])

    //#endregion

    const onSubmitClick = async () => {
        const vals = await form.validateFields();
        setSubmitting(true);
        if (await handleSubmit(vals))
            message.success('添加成功');
        else
            message.success('添加成功');

        setSubmitting(false);
    }
    const renderFooter = () => {

        return (<>
            <Button onClick={handleCancel}>取消</Button>
            <Button type="primary" onClick={() => { onSubmitClick(); }} loading={submitting} >确定</Button>
        </>)

    }

    return (
        <Modal
            width={760}
            title={modalTitle ? modalTitle : '无标题'}
            visible={modalVisible}
            footer={renderFooter()}
            onCancel={handleCancel}
            afterClose={() => {  /** 这里可能需要重置一些值 */ }}
        >
            <Form
                form={form}
                layout="vertical"
            >

                <Form.Item style={{ display: 'none' }}
                    label="编号"
                    name="id">
                    <Input></Input>
                </Form.Item>
                <Form.Item
                    label="数量"
                    name="amount"
                    rules={[
                        { required: true, message: '请输入数量, 可创建1~9,999张, 输入0表示不限数量' },
                    ]}>
                    <InputNumber max={9999} min={0}></InputNumber>
                </Form.Item>
                <Form.Item
                    label="标题"
                    name="title"
                    rules={[
                        { required: true, message: '请输入票券标题' }
                    ]}>
                    <Input placeholder="如: 5元代金券"></Input>
                </Form.Item>
                <Form.Item
                    label="简要描述"
                    name="desc">
                    <Input placeholder="如: 消费满100元使用"></Input>
                </Form.Item>
                <Form.Item
                    label="券类型"
                    name="type"
                    rules={[
                        { required: true, message: '请选择票券类型' }
                    ]}>
                    <Select >
                        <Select.Option value={1}>折扣券</Select.Option>
                        <Select.Option value={2}>代金券</Select.Option>
                        <Select.Option value={3}>满减券</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="截止日期"
                    name="expire_at"
                    rules={[
                        { required: true, message: '请选择截止日期' }
                    ]}>
                    <DatePicker></DatePicker>
                </Form.Item>
                <Form.Item
                    label="使用说明"
                    name="instruction" >
                    <TextArea placeholder="详细的使用规则与使用说明" rows={3} ></TextArea>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default VoucherModal;