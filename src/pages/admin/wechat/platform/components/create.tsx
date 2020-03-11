import React from "react";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import Form from "antd/es/form";
import SimpleForm, { IFieldSet } from "@/components/Simple/Form";
import { message, Card, Button } from "antd";
import FooterToolbar from "@/components/FooterToolbar";
import { create } from "./service";

interface PlatformCreateProps {

}
const PlatformCreate: React.FC<PlatformCreateProps> = props => {

    const [form] = Form.useForm();
    const fields: IFieldSet[] = [
        { label: "公众号名称", name: "title", rules: [{ required: true, message: '请输入公众号名称' }] },
        { label: "公众号类型", name: "type", type: [0, 1], collection: ['订阅号', '服务号'], rules: [{ required: true, message: '请选择公众号类型' }] },
        { label: "公众号AppId", name: "appId", rules: [{ required: true, message: '请输入公众号AppId' }] },
        { label: "公众号AppSecret", name: "appSecret", rules: [{ required: true, message: '请输入公众号AppSecret' }] },
        { label: "服务器Token", name: "serverToken" },
        { label: "服务器加解密秘钥", name: "encodingAESKey" },
        { label: "公众号原始ID", name: "originId" },
        { label: "平台微信号", name: "pname" }
    ]

    const handeOnFinish = async (values: any) => {
        let hide = message.loading('正在保存');
        let res = await create(values);
        hide();
        if (res.err) {
            message.error(res.errmsg);
            return
        }

        message.success('保存成功');
    }

    return (<>
        <PageHeaderWrapper>
            <Card>
                <SimpleForm
                    form={form}
                    fields={fields}
                    onFinish={handeOnFinish}
                ></SimpleForm>
            </Card>
        </PageHeaderWrapper >
        <FooterToolbar inverse={true}>
            <Button type="primary" onClick={() => { form.submit() }}>保存</Button>
        </FooterToolbar>
    </>)
}

export default PlatformCreate;