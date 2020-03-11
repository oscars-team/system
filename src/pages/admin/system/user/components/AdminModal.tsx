
import React, { useState } from 'react'
import { Modal, Steps, Form, Input, Alert, Button } from 'antd'
import { AdminDataType } from '../data.d'

export interface AdminModalProps {
    onCancel: (flag?: boolean) => void | unknown
    onSubmit: (vals: AdminDataType) => void | unknown
    values: Partial<AdminDataType>,
    visible?: boolean
}

const AdminModal: React.FC<AdminModalProps> = props => {
    //#region ============= Hooks ==============
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [formVals, setFormVals] = useState<AdminDataType>({
        phone: props.values.phone,
    });
    //#endregion
    const {
        onCancel: setModalVisible,
        onSubmit: createAdminUser,
        visible: modalVisible,
    } = props;
    const [form] = Form.useForm();
    const formContent = () => {
        if (currentStep === 1)
            return (<>
                <Form.Item name="displayname" label="显示名称">
                    <Input></Input>
                </Form.Item>
                <Form.Item name="avatar" label="头像">
                    <Input></Input>
                </Form.Item>
                <Form.Item name="country" label="国家">
                    <Input></Input>
                </Form.Item>
                <Form.Item name="province" label="省份">
                    <Input></Input>
                </Form.Item>
                <Form.Item name="city" label="城市">
                    <Input></Input>
                </Form.Item>
            </>)
        if (currentStep === 2) {
            return (<></>)
        }

        return (<>
            <Form.Item name="loginname" label="登录名"
                rules={[{ required: true, message: '请输入登录名称' }]}>
                <Input ></Input>
            </Form.Item>
            <Form.Item name="email" label="电子邮箱"
                rules={[{ required: true, message: '请输入电子邮箱' }]}>
                <Input ></Input>
            </Form.Item>
            <Form.Item name="password" label="登录密码"
                rules={[{ required: true, message: '请输入登录密码' }]}>
                <Input.Password ></Input.Password>
            </Form.Item>
            <Form.Item name="phone" label="手机号码"
                rules={[{ required: true, message: '请输入手机号码' }]}>
                <Input ></Input>
            </Form.Item>
            <Alert showIcon={true} type="info" message="登录名、电子邮箱、手机号码都可以作为账号在登录时使用"></Alert>
        </>)
    }

    const footerContent = () => {

        if (currentStep === 1)
            return (<>
                <Button onClick={() => { handleNext() }} >下一步</Button>
                <Button type="primary" onClick={() => { handleSubmit() }}>保存</Button>
                <Button style={{ float: 'left' }} onClick={() => setCurrentStep(currentStep - 1)}>上一步</Button>
            </>)

        if (currentStep === 2)
            return (<>
                <Button type="primary" onClick={() => { handleSubmit() }}>确定</Button>
                <Button style={{ float: 'left' }} onClick={() => setCurrentStep(currentStep - 1)}>上一步</Button>
            </>)

        return (<>
            <Button onClick={() => { handleNext() }} >下一步</Button>
            <Button type="primary" onClick={() => { handleSubmit() }}>保存</Button>
            <Button style={{ float: 'left' }} onClick={() => setModalVisible(false)}>取消</Button>
        </>)
    }

    const handleNext = async () => {
        try {
            const vals = await form.validateFields();
            setFormVals(prev => { return Object.assign(prev, vals) });
            setCurrentStep(currentStep + 1);
        } catch (err) {

        }
    }

    const handleSubmit = async () => {
        const vals = await form.validateFields();
        setFormVals(prev => { return Object.assign(prev, vals) });
        createAdminUser(formVals);
    }

    return (
        <Modal
            title="添加管理员"
            width={760}
            visible={modalVisible}
            onCancel={() => { setModalVisible(false) }}
            afterClose={() => { form.resetFields(); setFormVals({}); }}
            footer={footerContent()}
        >
            <Steps size="small" current={currentStep}>
                <Steps.Step title="账号信息"></Steps.Step>
                <Steps.Step title="详细信息"></Steps.Step>
                <Steps.Step title="权限配置"></Steps.Step>
                <Steps.Step title="创建完成"></Steps.Step>
            </Steps>
            <Form
                style={{ marginTop: 48 }}
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 13 }}
                form={form}
                initialValues={{
                    phone: formVals.phone
                }}
            >
                {formContent()}
            </Form>
        </Modal>
    )
}

export default AdminModal;

// import React, { useState } from 'react';
// import { Modal, Steps, Form, Button, Input, Alert } from 'antd';
// import { CreateUserDataType } from '../data.d'
// const { Step } = Steps;
// const FormItem = Form.Item;


// export interface UserCRUDProps {
//     onCancel: (flag?: boolean) => void
//     onSubmit: (vals: CreateUserDataType) => void
//     visible: boolean
// }
// const CreateUserModal: React.FC<UserCRUDProps> = props => {

//     const [form] = Form.useForm();
//     const [currentStep, setCurrentStep] = useState<number>(0);
//     const [formVals, setFormVals] = useState<CreateUserDataType>({});


//     const {
//         visible,
//         onSubmit: handleSubmit,
//         onCancel: setModalVisible
//     } = props;
//     const forward = () => setCurrentStep(currentStep + 1);
//     const backward = () => setCurrentStep(currentStep - 1);
//     const handleSaveForm = async () => {
//         try {
//             let fieldsValue = await form.validateFields();
//             handleSubmit(fieldsValue);
//         } catch (err) {

//         }
//     }
//     const handleResetForm = () => {
//         setCurrentStep(0);
//         setFormVals({});
//     };
//     const handleNext = async () => {
//         try {
//             let fieldsValue = await form.validateFields();
//             setFormVals({ ...formVals, ...fieldsValue });
//             forward();
//         } catch (err) {

//         }
//     }
//     const renderContent = () => {
//         // 账号信息
//         if (currentStep == 0) {
//             return (<>
//                 <FormItem name="loginname" label="登录名"
//                     rules={[{ required: true, message: '请输入登录名称' }]}>
//                     <Input ></Input>
//                 </FormItem>
//                 <FormItem name="email" label="电子邮箱"
//                     rules={[{ required: true, message: '请输入电子邮箱' }]}>
//                     <Input ></Input>
//                 </FormItem>
//                 <FormItem name="password" label="登录密码"
//                     rules={[{ required: true, message: '请输入登录密码' }]}>
//                     <Input.Password ></Input.Password>
//                 </FormItem>
//                 <FormItem name="phone" label="手机号码"
//                     rules={[{ required: true, message: '请输入手机号码' }]}>
//                     <Input ></Input>
//                 </FormItem>
//                 <Alert showIcon={true} type="info" message="登录名、电子邮箱、手机号码都可以作为账号在登录时使用"></Alert>
//             </>)
//         }

//         if (currentStep == 1) {
//             return (<h1>详细信息</h1>)
//         }

//         if (currentStep == 2) {
//             return (<h1>权限设置</h1>)
//         }

//         return <></>;
//     }

//     const renderFooter = () => {
//         if (currentStep === 0)
//             return (
//                 <>
//                     <Button onClick={handleNext}>下一步</Button>
//                     <Button type="primary" onClick={async () => { handleSaveForm() }}>保存</Button>
//                     <Button style={{ float: 'left' }} onClick={() => setModalVisible(false)}>取消</Button>
//                 </>
//             )

//         if (currentStep === 1) {
//             return (
//                 <>
//                     <Button onClick={handleNext}>下一步</Button>
//                     <Button type="primary" onClick={handleSaveForm}>保存</Button>
//                     <Button style={{ float: 'left' }} onClick={backward}>上一步</Button>
//                 </>
//             )
//         }

//         if (currentStep === 2) {
//             return (
//                 <>
//                     <Button onClick={handleNext}>下一步</Button>
//                     <Button type="primary" onClick={handleSaveForm}>完成</Button>
//                     <Button style={{ float: 'left' }} onClick={backward}>上一步</Button>
//                 </>
//             )
//         }

//         if (currentStep === 3) {
//             return (
//                 <>
//                     <Button type="primary" onClick={() => { setModalVisible(false) }}>关闭</Button>
//                 </>
//             )
//         }

//         return <></>;
//     }

//     return (
//         <Modal
//             width={760}
//             title="创建管理员"
//             destroyOnClose
//             visible={visible}
//             onCancel={() => setModalVisible(false)}
//             afterClose={() => handleResetForm()}
//             footer={renderFooter()}
//         >
//             <Steps size="small" current={currentStep}>
//                 <Step title="账号信息"></Step>
//                 <Step title="详细信息"></Step>
//                 <Step title="权限配置"></Step>
//                 <Step title="创建完成"></Step>
//             </Steps>
//             <Form
//                 style={{ marginTop: 48 }}
//                 labelCol={{ span: 7 }}
//                 wrapperCol={{ span: 13 }}
//                 form={form}
//                 initialValues={{
//                 }}
//             >
//                 {renderContent()}
//             </Form>
//         </Modal>
//     )
// }
// export default CreateUserModal